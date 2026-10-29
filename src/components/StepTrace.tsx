import { ChevronLeft, ChevronRight, Footprints, Lock, SkipBack } from 'lucide-react';
import type { L } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { Markdown } from './Markdown';
import TRACES from '../content/lessons/exercises/traces.json';

/** Paso a paso generado ejecutando el código real (scripts/gen_traces.py) */
export interface TraceStep {
  line: number;
  depth: number;
  fn: string | null;
  vars: Record<string, string>;
  changed: string[];
  text: L;
}
interface TraceData {
  code: string;
  steps: TraceStep[];
  truncated: boolean;
}

/** Devuelve el paso a paso de un ejercicio, o null si no existe o está desactualizado */
export function traceFor(exId: string, code: string): TraceData | null {
  const t = (TRACES as Record<string, TraceData>)[exId];
  return t && t.code === code ? t : null;
}

/** Hasta qué paso se puede ver antes de responder: el resto lo piensas tú */
export function visibleSteps(total: number, unlocked: boolean) {
  return unlocked ? total : Math.min(total, Math.max(3, Math.ceil(total * 0.6)));
}

export function StepTrace({
  trace,
  walkthrough,
  step,
  setStep,
  unlocked,
}: {
  trace: TraceData;
  walkthrough?: L;
  step: number;
  setStep: (n: number) => void;
  unlocked: boolean;
}) {
  const { t, tr } = useI18n();
  const total = trace.steps.length;
  const visible = visibleSteps(total, unlocked);
  const s = trace.steps[Math.min(step, visible - 1)];
  const atLockEdge = !unlocked && step >= visible - 1 && visible < total;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-300">
        <Footprints size={16} /> {tr('Paso a paso', 'Step by step')}
      </div>

      {walkthrough && (
        <div className="rounded-lg bg-brand-50 p-3 dark:bg-brand-500/10">
          <div className="mb-1 text-xs font-semibold uppercase text-brand-700 dark:text-brand-300">{tr('Cómo funciona', 'How it works')}</div>
          <Markdown className="prose-sm">{t(walkthrough)}</Markdown>
        </div>
      )}

      <div className="flex items-center gap-1">
        <button onClick={() => setStep(0)} disabled={step === 0} className="btn-ghost p-1.5" aria-label={tr('Al inicio', 'To start')}>
          <SkipBack size={15} />
        </button>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="btn-secondary px-2 py-1" aria-label={tr('Paso anterior', 'Previous step')}>
          <ChevronLeft size={16} />
        </button>
        <span className="flex-1 text-center font-mono text-xs text-zinc-500">
          {tr('Paso', 'Step')} {Math.min(step, visible - 1) + 1} / {total}
        </span>
        <button
          onClick={() => setStep(Math.min(visible - 1, step + 1))}
          disabled={step >= visible - 1}
          className="btn-primary px-2 py-1"
          aria-label={tr('Siguiente paso', 'Next step')}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="min-h-[3.5rem] rounded-lg border border-zinc-100 p-3 dark:border-zinc-800">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="chip bg-zinc-100 font-mono dark:bg-zinc-800">
            {tr('línea', 'line')} {s.line}
          </span>
          {s.fn && (
            <span className="chip bg-violet-100 font-mono text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              {s.fn}() · {tr('nivel', 'level')} {s.depth}
            </span>
          )}
        </div>
        <Markdown className="prose-sm">{t(s.text)}</Markdown>
      </div>

      {Object.keys(s.vars).length > 0 && (
        <div>
          <div className="label">{tr('Variables en este momento', 'Variables right now')}</div>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs">
            {Object.entries(s.vars).map(([k, v]) => (
              <div key={k} className="contents">
                <span className="text-zinc-500">{k}</span>
                <span className={s.changed.includes(k) ? 'font-bold text-amber-600 dark:text-amber-300' : ''}>
                  {v}
                  {s.changed.includes(k) && ' ←'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {atLockEdge && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          <Lock size={14} className="mt-0.5 shrink-0" />
          <span>
            {tr(
              `Los últimos ${total - visible} pasos los haces tú: sigue el mismo patrón en tu cabeza (o en papel). Se desbloquean al comprobar tu respuesta.`,
              `The last ${total - visible} steps are yours: follow the same pattern in your head (or on paper). They unlock when you check your answer.`,
            )}
          </span>
        </div>
      )}
      {trace.truncated && unlocked && step >= total - 1 && (
        <p className="text-xs text-zinc-500">{tr('El paso a paso se recortó aquí porque el código da muchas vueltas.', 'The walkthrough is cut here because the code runs many steps.')}</p>
      )}
    </div>
  );
}
