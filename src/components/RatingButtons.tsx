import type { Rating, SrsState } from '../types';
import { previewInterval } from '../lib/srs';
import { useI18n } from '../i18n/I18nContext';

export function RatingButtons({ state, onRate, suggested }: { state?: SrsState; onRate: (r: Rating) => void; suggested?: Rating }) {
  const { tr } = useI18n();
  const fmt = (days: number) => (days === 0 ? tr('hoy', 'today') : days < 30 ? `${days}d` : `${Math.round(days / 30)}${tr('m', 'mo')}`);
  const buttons: { r: Rating; label: string; cls: string; key: string }[] = [
    { r: 1, label: tr('Otra vez', 'Again'), key: '1', cls: 'border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/10' },
    { r: 2, label: tr('Difícil', 'Hard'), key: '2', cls: 'border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-500/40 dark:text-amber-300 dark:hover:bg-amber-500/10' },
    { r: 3, label: tr('Bien', 'Good'), key: '3', cls: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/40 dark:text-emerald-300 dark:hover:bg-emerald-500/10' },
    { r: 4, label: tr('Fácil', 'Easy'), key: '4', cls: 'border-sky-300 text-sky-700 hover:bg-sky-50 dark:border-sky-500/40 dark:text-sky-300 dark:hover:bg-sky-500/10' },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {buttons.map((b) => (
        <button
          key={b.r}
          onClick={() => onRate(b.r)}
          className={`btn flex-col gap-0 border bg-white py-2.5 dark:bg-zinc-900 ${b.cls} ${suggested === b.r ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-zinc-950' : ''}`}
        >
          <span>{b.label}</span>
          <span className="text-[11px] font-normal opacity-70">
            {fmt(previewInterval(state, b.r))} · <kbd className="font-mono">{b.key}</kbd>
          </span>
        </button>
      ))}
    </div>
  );
}
