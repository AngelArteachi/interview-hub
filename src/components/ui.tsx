import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Difficulty } from '../types';
import { useI18n } from '../i18n/I18nContext';

export function PageHeader({ title, subtitle, back, actions }: { title: string; subtitle?: string; back?: string; actions?: ReactNode }) {
  const { tr } = useI18n();
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link to={back} className="mb-2 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-brand-600">
            <ChevronLeft size={16} /> {tr('Volver', 'Back')}
          </Link>
        )}
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function DifficultyBadge({ d }: { d: Difficulty }) {
  const { tr } = useI18n();
  const map = {
    easy: ['bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300', tr('Fácil', 'Easy')],
    medium: ['bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300', tr('Media', 'Medium')],
    hard: ['bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300', tr('Difícil', 'Hard')],
  } as const;
  const [cls, label] = map[d];
  return <span className={`chip ${cls}`}>{label}</span>;
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 ${className}`}>
      <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }} />
    </div>
  );
}

export function ProgressRing({ value, size = 64, stroke = 6, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-zinc-200 dark:stroke-zinc-800" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="fill-none stroke-brand-500 transition-all"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, value))}
        />
      </svg>
      <span className="absolute text-xs font-bold">{label ?? `${Math.round(value * 100)}%`}</span>
    </div>
  );
}

export function Empty({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="rounded-2xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
      {children && <div className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">{children}</div>}
    </div>
  );
}

export function StatCard({ icon, label, value, hint }: { icon: ReactNode; label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        {icon} {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
      {hint && <div className="text-xs text-zinc-500">{hint}</div>}
    </div>
  );
}
