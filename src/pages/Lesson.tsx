import { useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Dumbbell, ChevronLeft, ChevronRight, Clock, ExternalLink, Library, Lightbulb, MessageSquareQuote, RotateCcw, Sparkles } from 'lucide-react';
import type { Block } from '../types';
import { LESSONS, lessonById, lessonConceptId, quizItemId, trackById } from '../content/lessons';
import { algorithmById } from '../data/algorithms';
import { LESSON_SOURCES } from '../content/lessons/sources';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { InlineMarkdown, Markdown } from '../components/Markdown';
import { CodeBlock } from '../components/CodeBlock';
import { Quiz } from '../components/Quiz';
import { Exercise } from '../components/Exercise';
import { TutorPanel } from '../components/TutorPanel';
import { Visualizer } from '../visualizers';
import { DifficultyBadge } from '../components/ui';

/** Porcentaje mínimo para aprobar el quiz de una lección */
const PASS = 70;

function BlockView({ block, lessonId }: { block: Block; lessonId: string }) {
  const { t, tr } = useI18n();
  switch (block.kind) {
    case 'exercise':
      return <Exercise ex={block.ex} lessonId={lessonId} />;
    case 'md':
      return <Markdown>{t(block.md)}</Markdown>;
    case 'code':
      return <CodeBlock code={block.code} lang={block.lang} />;
    case 'viz':
      return <Visualizer id={block.id} />;
    case 'callout': {
      const styles = {
        tip: ['border-sky-300 bg-sky-50 dark:border-sky-500/30 dark:bg-sky-500/5', <Lightbulb key="i" size={18} className="text-sky-500" />, tr('Tip', 'Tip')],
        interview: ['border-violet-300 bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/5', <MessageSquareQuote key="i" size={18} className="text-violet-500" />, tr('En la entrevista', 'In the interview')],
        warning: ['border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/5', <AlertTriangle key="i" size={18} className="text-amber-500" />, tr('Cuidado', 'Watch out')],
      } as const;
      const [cls, icon, label] = styles[block.tone];
      return (
        <div className={`my-5 rounded-2xl border-l-4 p-4 ${cls}`}>
          <div className="mb-1 flex items-center gap-2 text-sm font-bold">
            {icon} {label}
          </div>
          <Markdown className="prose-sm">{t(block.md)}</Markdown>
        </div>
      );
    }
  }
}

export default function LessonPage() {
  const { id = '' } = useParams();
  return <LessonView key={id} id={id} />;
}

function LessonView({ id }: { id: string }) {
  const lesson = lessonById(id);
  const { data, completeLesson, enroll } = useStore();
  const { t, tr } = useI18n();
  const [tutor, setTutor] = useState(false);
  const [tutorPrompt, setTutorPrompt] = useState<string | null>(null);
  // Resultado acumulado: preguntas que siguen falladas tras el intento (o reintento)
  const [result, setResult] = useState<{ pct: number; wrong: number[] } | null>(null);
  const [retryIdx, setRetryIdx] = useState<number[] | null>(null);
  const [attemptKey, setAttemptKey] = useState(0);
  const quizRef = useRef<HTMLElement>(null);
  if (!lesson) return <Navigate to="/learn" replace />;

  const finishAttempt = (wrong: number[]) => {
    const pct = Math.round(((lesson.quiz.length - wrong.length) / lesson.quiz.length) * 100);
    setResult({ pct, wrong });
    if (pct >= PASS) {
      completeLesson(
        lesson.id,
        pct,
        lesson.concepts.map((_, i) => lessonConceptId(lesson.id, i)),
      );
    } else {
      enroll(wrong.map((i) => quizItemId(lesson.id, i)));
    }
  };

  const startRetry = (wrong: number[]) => {
    setRetryIdx(wrong);
    setResult(null);
    setAttemptKey((k) => k + 1);
    quizRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const explainPrompt = (wrong: number[]) =>
    tr(
      `Fallé estas preguntas del quiz. Explícamelas de forma sencilla, con un ejemplo, y dime qué parte de la lección debo repasar:\n\n${wrong.map((i) => `- ${t(lesson.quiz[i].q)}`).join('\n')}`,
      `I missed these quiz questions. Explain them simply, with an example, and tell me which part of the lesson to review:\n\n${wrong.map((i) => `- ${t(lesson.quiz[i].q)}`).join('\n')}`,
    );

  const track = trackById(lesson.track);
  const trackLessons = LESSONS.filter((l) => l.track === lesson.track);
  const idx = trackLessons.indexOf(lesson);
  const prev = trackLessons[idx - 1];
  const next = trackLessons[idx + 1];
  const progress = data.lessons[lesson.id];
  const related = (lesson.related ?? []).map(algorithmById).filter((a) => !!a);
  const sources = LESSON_SOURCES[lesson.id] ?? [];
  const practiceDone = (lesson.practice ?? []).filter((e) => data.exercises?.[`${lesson.id}:${e.id}`]?.ok).length;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/learn" className="mb-3 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-brand-600">
        <ChevronLeft size={16} /> {t(track.title)}
      </Link>
      <div className={`mb-6 rounded-3xl bg-gradient-to-br ${track.color} p-6 text-white sm:p-8`}>
        <div className="flex items-center gap-3 text-sm text-white/80">
          <span>
            {tr('Lección', 'Lesson')} {idx + 1}/{trackLessons.length}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {lesson.minutes} min
          </span>
          {progress && (
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} /> {tr('Completada', 'Completed')}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{t(lesson.title)}</h1>
        <p className="mt-1 text-white/85">{t(lesson.summary)}</p>
      </div>

      <article>
        {lesson.blocks.map((b, i) => (
          <BlockView key={i} block={b} lessonId={lesson.id} />
        ))}
      </article>

      {!!lesson.practice?.length && (
        <Link
          to={`/learn/${lesson.id}/practice`}
          className="card mt-8 flex items-center gap-4 border-brand-300 p-5 transition hover:border-brand-500 hover:shadow-md dark:border-brand-500/40"
        >
          <div className="rounded-xl bg-brand-100 p-3 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            <Dumbbell size={22} />
          </div>
          <div className="flex-1">
            <div className="font-bold">{tr('Practica esta lección', 'Practice this lesson')}</div>
            <div className="text-sm text-zinc-500">
              {tr(
                `${lesson.practice.length} ejercicios en 3 niveles · llevas ${practiceDone}/${lesson.practice.length}. Practicar recordando fija mejor que releer.`,
                `${lesson.practice.length} exercises in 3 levels · ${practiceDone}/${lesson.practice.length} done. Practicing recall sticks better than re-reading.`,
              )}
            </div>
          </div>
          <ArrowRight size={18} className="text-brand-500" />
        </Link>
      )}

      {sources.length > 0 && (
        <section className="mt-8 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="flex items-center gap-2 font-bold">
            <Library size={18} className="text-brand-500" /> {tr('Fuentes y lecturas recomendadas', 'Sources & further reading')}
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            {tr(
              'Documentación oficial, estándares, universidades y autores reconocidos. Úsalas para confirmar y profundizar lo que leíste aquí (la mayoría están en inglés).',
              'Official documentation, standards, universities and recognized authors. Use them to confirm and go deeper into what you read here.',
            )}
          </p>
          <ul className="mt-3 space-y-2">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="group flex items-start gap-2 text-sm">
                  <ExternalLink size={14} className="mt-0.5 shrink-0 text-zinc-400 group-hover:text-brand-600" />
                  <span>
                    <span className="font-semibold text-brand-600 group-hover:underline dark:text-brand-300">{s.title}</span>
                    <span className="text-zinc-500"> — {s.publisher}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section ref={quizRef} className="card mt-10 scroll-mt-20 p-6">
        <h2 className="mb-1 text-xl font-extrabold">{tr('Quiz de la lección', 'Lesson quiz')}</h2>
        <p className="mb-4 text-sm text-zinc-500">{tr(`Necesitas ${PASS}% o más para aprobar la lección.`, `You need ${PASS}% or more to pass the lesson.`)}</p>

        {retryIdx ? (
          <>
            <div className="mb-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-800 dark:bg-brand-500/10 dark:text-brand-200">
              {tr(`Reintento: solo las ${retryIdx.length} preguntas que fallaste.`, `Retry: only the ${retryIdx.length} questions you missed.`)}
            </div>
            <Quiz
              key={`retry-${attemptKey}`}
              questions={retryIdx.map((i) => lesson.quiz[i])}
              onComplete={(_, wrongInRetry) => finishAttempt(wrongInRetry.map((j) => retryIdx[j]))}
            />
          </>
        ) : (
          <Quiz key={`full-${attemptKey}`} questions={lesson.quiz} onComplete={(_, wrong) => finishAttempt(wrong)} />
        )}

        {result && result.pct >= PASS && (
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
            ✓{' '}
            {tr(
              `¡Aprobada con ${result.pct}%! Se agregaron ${lesson.concepts.length} conceptos clave a tu repaso y se desbloquearon las preguntas de este tema.`,
              `Passed with ${result.pct}%! ${lesson.concepts.length} key concepts were added to your review and this topic's questions are unlocked.`,
            )}
          </div>
        )}

        {result && result.pct < PASS && (
          <div className="mt-6 space-y-4 rounded-2xl border border-amber-300 bg-amber-50/60 p-5 dark:border-amber-500/30 dark:bg-amber-500/5">
            <div>
              <h3 className="text-lg font-bold">
                {tr(`Sacaste ${result.pct}%: repasemos lo que fallaste`, `You got ${result.pct}%: let's review what you missed`)}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {tr(
                  'Lee la respuesta correcta y la explicación de cada una. Estas preguntas ya están en tu repaso de hoy para que no se te olviden.',
                  "Read each correct answer and explanation. These questions are already in today's review so you don't forget them.",
                )}
              </p>
            </div>
            <ol className="space-y-3">
              {result.wrong.map((i) => {
                const q = lesson.quiz[i];
                return (
                  <li key={i} className="rounded-xl bg-white p-4 text-sm dark:bg-zinc-900">
                    <div className="font-semibold"><InlineMarkdown>{t(q.q)}</InlineMarkdown></div>
                    <div className="mt-2 text-emerald-700 dark:text-emerald-400">
                      ✓ <b><InlineMarkdown>{t(q.options[q.answer])}</InlineMarkdown></b>
                    </div>
                    <div className="mt-1 text-zinc-600 dark:text-zinc-400">💡 <InlineMarkdown>{t(q.explanation)}</InlineMarkdown></div>
                  </li>
                );
              })}
            </ol>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => startRetry(result.wrong)} className="btn-primary">
                <RotateCcw size={16} /> {tr('Reintentar las que fallé', 'Retry the ones I missed')}
              </button>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-secondary">
                <BookOpen size={16} /> {tr('Volver a leer la lección', 'Re-read the lesson')}
              </button>
              <button onClick={() => setTutorPrompt(explainPrompt(result.wrong))} className="btn border border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300">
                <Sparkles size={16} /> {tr('Que Claude me lo explique', 'Have Claude explain it')}
              </button>
            </div>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold">{tr('Practica lo aprendido', 'Practice what you learned')}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {related.map((a) => (
              <Link key={a.id} to={`/practice/algorithms/${a.id}`} className="card flex items-center gap-3 p-3 transition hover:border-brand-400">
                <span className="flex-1 text-sm font-semibold">{t(a.title)}</span>
                <DifficultyBadge d={a.difficulty} />
                <ArrowRight size={14} className="text-zinc-400" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex justify-between gap-2">
        {prev ? (
          <Link to={`/learn/${prev.id}`} className="btn-ghost">
            <ChevronLeft size={16} /> <span className="hidden sm:inline">{t(prev.title)}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/learn/${next.id}`} className="btn-secondary">
            <span className="hidden sm:inline">{t(next.title)}</span>
            <span className="sm:hidden">{tr('Siguiente', 'Next')}</span> <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {!tutor && !tutorPrompt && (
        <button
          onClick={() => setTutor(true)}
          className="btn fixed bottom-5 right-5 z-30 bg-violet-600 px-4 py-3 text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500"
        >
          <Sparkles size={18} /> {tr('Pregúntale a Claude', 'Ask Claude')}
        </button>
      )}
      {(tutor || tutorPrompt) && (
        <TutorPanel
          key={tutorPrompt ?? 'chat'}
          lesson={lesson}
          initialPrompt={tutorPrompt ?? undefined}
          onClose={() => {
            setTutor(false);
            setTutorPrompt(null);
          }}
        />
      )}
    </div>
  );
}
