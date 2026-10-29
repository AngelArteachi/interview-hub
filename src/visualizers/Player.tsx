import { useEffect, useState, type ReactNode } from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

/**
 * Motor común de visualizaciones: un algoritmo genera una lista de pasos (Step[])
 * y el reproductor los anima con play/pausa/anterior/siguiente.
 */
export interface BaseStep {
  note: { es: string; en: string };
}

export function usePlayer<S>(steps: S[], speedMs = 900) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setI(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing) return;
    if (i >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setI((x) => x + 1), speedMs);
    return () => clearTimeout(timer);
  }, [playing, i, steps.length, speedMs]);

  return {
    i,
    step: steps[Math.min(i, steps.length - 1)],
    playing,
    total: steps.length,
    toggle: () => {
      if (i >= steps.length - 1) setI(0);
      setPlaying((p) => !p);
    },
    next: () => setI((x) => Math.min(steps.length - 1, x + 1)),
    prev: () => setI((x) => Math.max(0, x - 1)),
    reset: () => {
      setI(0);
      setPlaying(false);
    },
  };
}

export function VizFrame({
  title,
  controls,
  player,
  note,
  children,
}: {
  title: string;
  controls?: ReactNode;
  player: ReturnType<typeof usePlayer<BaseStep>>;
  note: { es: string; en: string };
  children: ReactNode;
}) {
  const { t, tr } = useI18n();
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-brand-200 bg-white dark:border-brand-500/30 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-100 bg-brand-50/60 px-4 py-2.5 dark:border-brand-500/20 dark:bg-brand-500/5">
        <span className="chip bg-brand-600 text-white">{tr('Interactivo', 'Interactive')}</span>
        <span className="text-sm font-bold">{title}</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">{controls}</div>
      </div>
      <div className="overflow-x-auto p-4">{children}</div>
      <div className="min-h-[3rem] border-t border-zinc-100 px-4 py-2.5 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">{t(note)}</div>
      <div className="flex items-center gap-1 border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
        <button onClick={player.reset} className="btn-ghost p-1.5" aria-label="reset">
          <RotateCcw size={16} />
        </button>
        <button onClick={player.prev} className="btn-ghost p-1.5" aria-label="previous">
          <SkipBack size={16} />
        </button>
        <button onClick={player.toggle} className="btn-primary px-3 py-1.5" aria-label="play">
          {player.playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={player.next} className="btn-ghost p-1.5" aria-label="next">
          <SkipForward size={16} />
        </button>
        <input
          type="range"
          min={0}
          max={Math.max(0, player.total - 1)}
          value={player.i}
          readOnly
          className="mx-2 flex-1 accent-brand-600"
          aria-label="progress"
        />
        <span className="font-mono text-xs text-zinc-500">
          {player.i + 1}/{player.total}
        </span>
      </div>
    </div>
  );
}

export function parseNumbers(s: string, max = 12): number[] {
  return s
    .split(/[,\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n))
    .slice(0, max);
}

/** Celda de arreglo reutilizable */
export function Cell({ value, tone = 'default', label }: { value: ReactNode; tone?: 'default' | 'active' | 'compare' | 'done' | 'muted' | 'found'; label?: string }) {
  const tones = {
    default: 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800',
    active: 'border-brand-500 bg-brand-100 text-brand-800 dark:bg-brand-500/25 dark:text-brand-200',
    compare: 'border-amber-500 bg-amber-100 text-amber-800 dark:bg-amber-500/25 dark:text-amber-200',
    done: 'border-emerald-500 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200',
    found: 'border-emerald-600 bg-emerald-500 text-white',
    muted: 'border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600',
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold transition-all duration-300 ${tones[tone]}`}>{value}</div>
      <div className="h-4 font-mono text-[10px] font-bold text-brand-600 dark:text-brand-300">{label}</div>
    </div>
  );
}
