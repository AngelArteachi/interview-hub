import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Clock, Lightbulb, MessageSquareQuote, Sparkles } from 'lucide-react';
import type { Block } from '../types';
import { LESSONS, lessonById, lessonConceptId, trackById } from '../content/lessons';
import { algorithmById } from '../data/algorithms';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { Markdown } from '../components/Markdown';
import { CodeBlock } from '../components/CodeBlock';
import { Quiz } from '../components/Quiz';
import { TutorPanel } from '../components/TutorPanel';
import { Visualizer } from '../visualizers';
import { DifficultyBadge } from '../components/ui';

function BlockView({ block }: { block: Block }) {
  const { t, tr } = useI18n();
  switch (block.kind) {
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
  const { data, completeLesson } = useStore();
  const { t, tr } = useI18n();
  const [tutor, setTutor] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  if (!lesson) return <Navigate to="/learn" replace />;

  const track = trackById(lesson.track);
  const trackLessons = LESSONS.filter((l) => l.track === lesson.track);
  const idx = trackLessons.indexOf(lesson);
  const prev = trackLessons[idx - 1];
  const next = trackLessons[idx + 1];
  const progress = data.lessons[lesson.id];
  const related = (lesson.related ?? []).map(algorithmById).filter((a) => !!a);

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
          <BlockView key={i} block={b} />
        ))}
      </article>

      <section className="card mt-10 p-6">
        <h2 className="mb-4 text-xl font-extrabold">{tr('Mini-quiz', 'Mini quiz')}</h2>
        <Quiz
          questions={lesson.quiz}
          onComplete={(pct) => {
            completeLesson(
              lesson.id,
              pct,
              lesson.concepts.map((_, i) => lessonConceptId(lesson.id, i)),
            );
            setJustCompleted(true);
          }}
        />
        {justCompleted && (
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
            ✓{' '}
            {tr(
              `Lección completada. Se agregaron ${lesson.concepts.length} conceptos clave a tu repaso de hoy.`,
              `Lesson completed. ${lesson.concepts.length} key concepts were added to today's review.`,
            )}
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

      {!tutor && (
        <button
          onClick={() => setTutor(true)}
          className="btn fixed bottom-5 right-5 z-30 bg-violet-600 px-4 py-3 text-white shadow-lg shadow-violet-600/30 hover:bg-violet-500"
        >
          <Sparkles size={18} /> {tr('Pregúntale a Claude', 'Ask Claude')}
        </button>
      )}
      {tutor && <TutorPanel lesson={lesson} onClose={() => setTutor(false)} />}
    </div>
  );
}
