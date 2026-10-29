import { useState } from 'react';
import { Loader2, Sparkles, ThumbsUp, Wrench } from 'lucide-react';
import type { AIEvaluation, ItemType } from '../types';
import { evaluateAnswer, useAIEnabled } from '../lib/ai';
import { useI18n } from '../i18n/I18nContext';
import { Markdown } from './Markdown';

export function AIFeedbackView({ ev }: { ev: AIEvaluation }) {
  const { tr } = useI18n();
  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/30 dark:bg-violet-500/5">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
          <Sparkles size={16} /> {tr('Evaluación de Claude', 'Claude\'s evaluation')}
        </span>
        <span className="flex gap-0.5" aria-label={`${ev.score}/5`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`h-2 w-5 rounded-full ${i <= ev.score ? 'bg-violet-500' : 'bg-violet-200 dark:bg-violet-900'}`} />
          ))}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">
            <ThumbsUp size={13} /> {tr('Fortalezas', 'Strengths')}
          </div>
          <ul className="list-disc space-y-1 pl-5 text-sm">{ev.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase text-amber-600 dark:text-amber-400">
            <Wrench size={13} /> {tr('A mejorar', 'To improve')}
          </div>
          <ul className="list-disc space-y-1 pl-5 text-sm">{ev.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      </div>
      <div className="mt-3 border-t border-violet-200 pt-3 dark:border-violet-500/20">
        <div className="mb-1 text-xs font-semibold uppercase text-zinc-500">{tr('Respuesta modelo', 'Model answer')}</div>
        <Markdown className="prose-sm">{ev.idealAnswerSummary}</Markdown>
      </div>
    </div>
  );
}

/** Botón que pide la evaluación y la muestra */
export function AIEvaluateButton({
  type,
  question,
  referenceAnswer,
  userAnswer,
  onResult,
}: {
  type: ItemType;
  question: string;
  referenceAnswer?: string;
  userAnswer: string;
  onResult: (ev: AIEvaluation) => void;
}) {
  const { tr, lang } = useI18n();
  const enabled = useAIEnabled();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (enabled === false)
    return (
      <p className="text-xs text-zinc-500">
        {tr('Evaluación con IA desactivada: configura ANTHROPIC_API_KEY (ver Ajustes).', 'AI evaluation disabled: set ANTHROPIC_API_KEY (see Settings).')}
      </p>
    );

  const run = async () => {
    setLoading(true);
    setError('');
    try {
      onResult(await evaluateAnswer({ type, question, referenceAnswer, userAnswer, lang }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={run}
        disabled={loading || !enabled || userAnswer.trim().length < 5}
        className="btn border border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? tr('Evaluando…', 'Evaluating…') : tr('Evaluar con IA', 'Evaluate with AI')}
      </button>
      {userAnswer.trim().length < 5 && <span className="text-xs text-zinc-500">{tr('Escribe tu respuesta para evaluarla', 'Write your answer to evaluate it')}</span>}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </div>
  );
}
