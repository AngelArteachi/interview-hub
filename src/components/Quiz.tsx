import { useState } from 'react';
import { Check, CheckCircle2, Eye, ListChecks, RotateCcw, X, XCircle } from 'lucide-react';
import type { AIEvaluation, QuizQ } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { AIEvaluateButton, AIFeedbackView } from './AIFeedback';
import { InlineMarkdown } from './Markdown';
import { shuffledOrder } from '../lib/exercise';

/**
 * Cada pregunta se responde primero por escrito (recuerdo activo).
 * Las opciones están ocultas: puedes verlas y elegir una, o comprobar tu respuesta escrita
 * contra la correcta y marcar tú mismo si la tenías bien.
 */
interface QState {
  text: string;
  showOptions: boolean;
  picked: number | null; // opción elegida
  checked: boolean; // comprobó la respuesta escrita sin ver opciones
  self: boolean | null; // autoevaluación de la respuesta escrita
  ai: AIEvaluation | null;
}

const blank = (): QState => ({ text: '', showOptions: false, picked: null, checked: false, self: null, ai: null });

/** Correcta si eligió la opción buena o si marcó su respuesta escrita como correcta */
const isCorrect = (s: QState, q: QuizQ) => (s.picked !== null ? s.picked === q.answer : s.self === true);
const isResolved = (s: QState) => s.picked !== null || s.self !== null;

function QuizQuestion({ q, n, s, set }: { q: QuizQ; n: number; s: QState; set: (patch: Partial<QState>) => void }) {
  const { t, tr } = useI18n();
  const resolved = isResolved(s);
  const correctText = t(q.options[q.answer]);
  // Orden fijo por pregunta pero barajado, para que la respuesta correcta no quede siempre en el mismo lugar
  const order = shuffledOrder(q.q.es, q.options.length);

  return (
    <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-3 flex items-start gap-2 font-semibold">
        <span className="text-brand-600 dark:text-brand-300">{n}.</span>
        <span className="flex-1"><InlineMarkdown>{t(q.q)}</InlineMarkdown></span>
        {resolved &&
          (isCorrect(s, q) ? <CheckCircle2 size={20} className="shrink-0 text-emerald-500" /> : <XCircle size={20} className="shrink-0 text-rose-500" />)}
      </div>

      <textarea
        value={s.text}
        onChange={(e) => set({ text: e.target.value })}
        readOnly={s.checked || s.picked !== null}
        rows={2}
        className="input resize-y"
        placeholder={tr('Escribe tu respuesta…', 'Write your answer…')}
      />

      {/* Acciones antes de resolver */}
      {!s.checked && !s.showOptions && s.picked === null && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => set({ checked: true })} disabled={!s.text.trim()} className="btn-primary py-1.5">
            <Check size={15} /> {tr('Comprobar', 'Check')}
          </button>
          <button onClick={() => set({ showOptions: true })} className="btn-secondary py-1.5">
            <ListChecks size={15} /> {tr('Ver opciones', 'Show options')}
          </button>
        </div>
      )}

      {/* Opciones (ocultas hasta que las pidas) */}
      {s.showOptions && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {order.map((oi) => {
            const o = q.options[oi];
            const chosen = s.picked === oi;
            const right = s.picked !== null && oi === q.answer;
            const wrong = chosen && oi !== q.answer;
            return (
              <button
                key={oi}
                disabled={s.picked !== null}
                onClick={() => set({ picked: oi })}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                  right
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                    : wrong
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                      : 'border-zinc-200 hover:border-brand-300 disabled:opacity-60 dark:border-zinc-700'
                }`}
              >
                {right && <Check size={15} className="shrink-0 text-emerald-600" />}
                {wrong && <X size={15} className="shrink-0 text-rose-600" />}
                <InlineMarkdown>{t(o)}</InlineMarkdown>
              </button>
            );
          })}
        </div>
      )}

      {/* Comprobación de la respuesta escrita */}
      {s.checked && (
        <div className="mt-3 space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-sm dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <div className="mb-1 text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400">{tr('Respuesta correcta', 'Correct answer')}</div>
            <b>{correctText}</b>
          </div>
          {!s.ai && (
            <AIEvaluateButton type="concept" question={t(q.q)} referenceAnswer={`${correctText}. ${t(q.explanation)}`} userAnswer={s.text} onResult={(ai) => set({ ai })} autoRun />
          )}
          {s.ai && <AIFeedbackView ev={s.ai} />}
          {s.self === null ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">{tr('¿La tenías bien?', 'Did you get it right?')}</span>
              <button onClick={() => set({ self: true })} className="btn border border-emerald-300 py-1.5 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/40 dark:text-emerald-300 dark:hover:bg-emerald-500/10">
                <Check size={15} /> {tr('Sí', 'Yes')}
              </button>
              <button onClick={() => set({ self: false })} className="btn border border-rose-300 py-1.5 text-rose-700 hover:bg-rose-50 dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/10">
                <X size={15} /> {tr('No', 'No')}
              </button>
            </div>
          ) : null}
        </div>
      )}

      {resolved && <p className="mt-3 text-sm text-zinc-500">💡 <InlineMarkdown>{t(q.explanation)}</InlineMarkdown></p>}
    </div>
  );
}

/** onComplete recibe el porcentaje y los índices (en `questions`) de las preguntas falladas */
export function Quiz({ questions, onComplete }: { questions: QuizQ[]; onComplete: (scorePct: number, wrong: number[]) => void }) {
  const { tr } = useI18n();
  const [states, setStates] = useState<QState[]>(() => questions.map(blank));
  const [finished, setFinished] = useState(false);

  const correct = states.filter((s, i) => isCorrect(s, questions[i])).length;
  const pct = Math.round((correct / questions.length) * 100);
  const allResolved = states.every(isResolved);
  const resolvedCount = states.filter(isResolved).length;

  const update = (i: number, patch: Partial<QState>) => setStates((list) => list.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2 text-sm text-zinc-500">
        <Eye size={15} />
        {tr(
          'Responde primero por escrito. Si te atoras, pulsa "Ver opciones".',
          'Answer in writing first. If you get stuck, press "Show options".',
        )}
      </p>
      {questions.map((q, i) => (
        <QuizQuestion key={i} q={q} n={i + 1} s={states[i]} set={(patch) => update(i, patch)} />
      ))}

      {!finished ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setFinished(true);
              onComplete(
                pct,
                questions.map((q, i) => (isCorrect(states[i], q) ? -1 : i)).filter((i) => i >= 0),
              );
            }}
            disabled={!allResolved}
            className="btn-primary"
          >
            {tr('Terminar quiz', 'Finish quiz')}
          </button>
          <span className="text-sm text-zinc-500">
            {resolvedCount}/{questions.length} {tr('respondidas', 'answered')}
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-lg font-extrabold ${pct >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {correct}/{questions.length} ({pct}%)
          </span>
          <button
            onClick={() => {
              setStates(questions.map(blank));
              setFinished(false);
            }}
            className="btn-ghost"
          >
            <RotateCcw size={15} /> {tr('Reintentar', 'Retry')}
          </button>
        </div>
      )}
    </div>
  );
}
