import { useEffect, useMemo, useRef, useState } from 'react';
import { Clock, Loader2, Mic, Play, Sparkles, Square, Trophy } from 'lucide-react';
import type { AIEvaluation, MockAnswer, MockKind, MockResult, ReviewItem } from '../types';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { TYPE_COLOR, TYPE_LABEL, allItems } from '../lib/items';
import { uid } from '../lib/storage';
import { evaluateAnswer, useAIEnabled } from '../lib/ai';
import { Markdown } from '../components/Markdown';
import { AIFeedbackView } from '../components/AIFeedback';
import { PageHeader, ProgressBar } from '../components/ui';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

type Phase = 'setup' | 'running' | 'review' | 'done';

export default function MockInterview() {
  const { data, addMock } = useStore();
  const { t, tr, lang } = useI18n();
  const aiEnabled = useAIEnabled();
  const [phase, setPhase] = useState<Phase>('setup');
  const [kind, setKind] = useState<MockKind>('mixed');
  const [minutes, setMinutes] = useState(30);
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<ReviewItem[]>([]);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<MockAnswer[]>([]);
  const [draft, setDraft] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [qStart, setQStart] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [saved, setSaved] = useState<MockResult | null>(null);
  const finishedRef = useRef(false);

  // Como en una entrevista real: todo el banco de preguntas, sin importar lecciones ni repasos
  const pool = useMemo(() => {
    const items = allItems(data).filter((i) => i.type !== 'lesson');
    const technical = items.filter((i) => ['algorithm', 'concept', 'design'].includes(i.type) || (i.type === 'custom' && !i.tags.includes('behavioral')));
    const behavioral = items.filter((i) => i.type === 'behavioral' || (i.type === 'custom' && i.tags.includes('behavioral')));
    return { technical, behavioral };
  }, [data]);

  /** Selección completamente al azar */
  const pick = (list: ReviewItem[], n: number) =>
    list
      .map((i) => ({ i, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .slice(0, n)
      .map((x) => x.i);

  const start = () => {
    let qs: ReviewItem[];
    if (kind === 'technical') qs = pick(pool.technical, count);
    else if (kind === 'behavioral') qs = pick(pool.behavioral, count);
    else {
      const nb = Math.max(1, Math.round(count / 3));
      qs = [...pick(pool.technical, count - nb), ...pick(pool.behavioral, nb)];
    }
    setQuestions(qs);
    setAnswers([]);
    setQi(0);
    setDraft('');
    setRemaining(minutes * 60);
    setQStart(Date.now());
    finishedRef.current = false;
    setSaved(null);
    setPhase('running');
  };

  const recordCurrent = (list: MockAnswer[]) => {
    const q = questions[qi];
    if (!q) return list;
    return [...list, { itemId: q.id, question: t(q.front), answer: draft, seconds: Math.round((Date.now() - qStart) / 1000), selfScore: 0 }];
  };

  const finish = (list: MockAnswer[]) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setAnswers(list);
    setPhase('review');
  };

  const nextQuestion = () => {
    const list = recordCurrent(answers);
    if (qi + 1 >= questions.length) return finish(list);
    setAnswers(list);
    setQi(qi + 1);
    setDraft('');
    setQStart(Date.now());
  };

  // Temporizador global
  useEffect(() => {
    if (phase !== 'running') return;
    const timer = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && remaining <= 0) finish(recordCurrent(answers));
  }, [remaining, phase]);

  const evaluateAll = async () => {
    setAiLoading(true);
    const results = await Promise.all(
      answers.map(async (a): Promise<AIEvaluation | undefined> => {
        const item = questions.find((q) => q.id === a.itemId);
        if (!item || !a.answer.trim()) return undefined;
        try {
          return await evaluateAnswer({ type: item.type, question: a.question, referenceAnswer: t(item.back), userAnswer: a.answer, lang });
        } catch {
          return undefined;
        }
      }),
    );
    setAnswers((list) => list.map((a, i) => (results[i] ? { ...a, ai: results[i], selfScore: a.selfScore || results[i]!.score } : a)));
    setAiLoading(false);
  };

  const save = () => {
    const result: MockResult = { id: uid(), date: new Date().toISOString(), kind, durationMin: minutes, answers };
    addMock(result); // solo al historial: el simulacro no modifica el repaso espaciado
    setSaved(result);
    setPhase('done');
  };

  /* ---------------- Render ---------------- */

  if (phase === 'running') {
    const q = questions[qi];
    const perQ = (minutes * 60) / questions.length;
    const elapsedQ = Math.round((Date.now() - qStart) / 1000);
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <span className={`chip px-3 py-1.5 font-mono text-base ${remaining < 120 ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
            <Clock size={15} /> {fmt(remaining)}
          </span>
          <ProgressBar value={qi / questions.length} className="flex-1" />
          <span className="font-mono text-sm text-zinc-500">
            {qi + 1}/{questions.length}
          </span>
        </div>
        <div className="card p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className={`chip ${TYPE_COLOR[q.type]}`}>{t(TYPE_LABEL[q.type])}</span>
            <span className={`ml-auto text-xs ${elapsedQ > perQ ? 'text-rose-500' : 'text-zinc-500'}`}>
              {tr('Sugerido', 'Suggested')}: {fmt(Math.round(perQ))}
            </span>
          </div>
          <Markdown>{t(q.front)}</Markdown>
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={9}
            className="input mt-5 resize-y"
            placeholder={
              q.type === 'behavioral'
                ? tr('Responde con STAR: Situación, Tarea, Acción, Resultado…', 'Answer with STAR: Situation, Task, Action, Result…')
                : tr('Piensa en voz alta: aclara el problema, explica tu enfoque, complejidad y casos borde…', 'Think out loud: clarify the problem, explain your approach, complexity and edge cases…')
            }
          />
          <div className="mt-2 text-xs text-zinc-500">
            🎙️ {tr('Tip: dilo en voz alta mientras escribes las ideas clave, como en la entrevista real.', 'Tip: say it out loud while jotting down key ideas, like in the real interview.')}
          </div>
          <div className="mt-4 flex justify-between">
            <button onClick={() => finish(recordCurrent(answers))} className="btn-ghost text-rose-600">
              <Square size={15} /> {tr('Terminar', 'End')}
            </button>
            <button onClick={nextQuestion} className="btn-primary">
              {qi + 1 >= questions.length ? tr('Finalizar', 'Finish') : tr('Siguiente pregunta', 'Next question')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'review') {
    const allScored = answers.every((a) => a.selfScore > 0);
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title={tr('Revisión del simulacro', 'Mock review')}
          subtitle={tr('Califícate cada respuesta (1–5) o pide a Claude que las evalúe.', 'Score each answer (1–5) or ask Claude to evaluate them.')}
          actions={
            aiEnabled && (
              <button onClick={evaluateAll} disabled={aiLoading} className="btn border border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300">
                {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} {tr('Evaluar todo con IA', 'Evaluate all with AI')}
              </button>
            )
          }
        />
        <div className="space-y-4">
          {answers.map((a, i) => {
            const item = questions.find((q) => q.id === a.itemId)!;
            return (
              <div key={i} className="card p-5">
                <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
                  <span className={`chip ${TYPE_COLOR[item.type]}`}>{t(TYPE_LABEL[item.type])}</span>
                  <Clock size={12} /> {fmt(a.seconds)}
                </div>
                <Markdown className="prose-sm font-semibold">{a.question}</Markdown>
                <div className="mt-3 whitespace-pre-wrap rounded-xl bg-zinc-50 p-3 text-sm dark:bg-zinc-800/60">{a.answer || <i className="text-zinc-400">{tr('(sin respuesta)', '(no answer)')}</i>}</div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-semibold text-emerald-600">{tr('Ver respuesta de referencia', 'See reference answer')}</summary>
                  <Markdown className="prose-sm mt-2">{t(item.back)}</Markdown>
                </details>
                {a.ai && (
                  <div className="mt-3">
                    <AIFeedbackView ev={a.ai} />
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-zinc-500">{tr('Tu calificación:', 'Your score:')}</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setAnswers((list) => list.map((x, j) => (j === i ? { ...x, selfScore: n } : x)))}
                      className={`h-8 w-8 rounded-lg border text-sm font-bold ${a.selfScore === n ? 'border-brand-500 bg-brand-600 text-white' : 'border-zinc-300 dark:border-zinc-700'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={save} disabled={!allScored} className="btn-primary mt-6">
          {tr('Guardar resultado', 'Save result')}
        </button>
        {!allScored && <span className="ml-3 text-sm text-zinc-500">{tr('Califica todas las respuestas para guardar.', 'Score every answer to save.')}</span>}
      </div>
    );
  }

  if (phase === 'done' && saved) {
    const avg = saved.answers.reduce((s, a) => s + a.selfScore, 0) / saved.answers.length;
    return (
      <div className="mx-auto max-w-xl">
        <div className="card p-10 text-center">
          <Trophy size={48} className="mx-auto text-amber-500" />
          <h2 className="mt-3 text-2xl font-extrabold">{tr('¡Simulacro guardado!', 'Mock saved!')}</h2>
          <div className="mt-2 text-5xl font-extrabold text-brand-600">{avg.toFixed(1)}/5</div>
          <p className="mt-2 text-zinc-500">{tr('Quedó en tu historial. El simulacro no modifica tu repaso diario.', 'Saved to your history. Mocks do not change your daily review.')}</p>
          <button onClick={() => setPhase('setup')} className="btn-primary mt-6">
            {tr('Volver', 'Back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={tr('Simulador de entrevista', 'Mock interview')} subtitle={tr('Como una entrevista real: preguntas al azar de todos los temas, sin importar lo que hayas estudiado, y con tiempo real.', 'Like a real interview: random questions from every topic, regardless of what you have studied, under real time.')} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="space-y-5">
            <div>
              <div className="label">{tr('Tipo de entrevista', 'Interview type')}</div>
              <div className="grid gap-2 sm:grid-cols-3">
                {(
                  [
                    ['mixed', tr('Mixta', 'Mixed'), tr('Técnica + conductual', 'Technical + behavioral')],
                    ['technical', tr('Técnica', 'Technical'), tr('Algoritmos, conceptos, diseño', 'Algorithms, concepts, design')],
                    ['behavioral', tr('Conductual', 'Behavioral'), tr('Preguntas STAR', 'STAR questions')],
                  ] as const
                ).map(([k, title, desc]) => (
                  <button key={k} onClick={() => setKind(k)} className={`rounded-xl border-2 p-3 text-left transition ${kind === k ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-zinc-200 dark:border-zinc-700'}`}>
                    <div className="font-bold">{title}</div>
                    <div className="text-xs text-zinc-500">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <div className="label">{tr('Duración', 'Duration')}</div>
                <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="input">
                  {[15, 30, 45, 60].map((m) => (
                    <option key={m} value={m}>
                      {m} min
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="label">
                  {tr('Preguntas', 'Questions')}: {count}
                </div>
                <input type="range" min={2} max={8} value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-3 w-full accent-brand-600" />
              </div>
            </div>
            <button onClick={start} className="btn-primary px-6 py-3 text-base">
              <Play size={18} /> {tr('Comenzar simulacro', 'Start mock')}
            </button>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-bold">
            <Mic size={18} className="text-brand-500" /> {tr('Historial', 'History')}
          </h3>
          {!data.mocks.length && <p className="text-sm text-zinc-500">{tr('Aún no has hecho simulacros.', 'No mocks yet.')}</p>}
          <ul className="space-y-2">
            {data.mocks.slice(0, 8).map((m) => {
              const avg = m.answers.reduce((s, a) => s + a.selfScore, 0) / Math.max(1, m.answers.length);
              return (
                <li key={m.id} className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/50">
                  <span>
                    {new Date(m.date).toLocaleDateString(lang)} · {m.answers.length} {tr('preg.', 'q.')}
                  </span>
                  <span className="font-bold text-brand-600">{avg.toFixed(1)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
