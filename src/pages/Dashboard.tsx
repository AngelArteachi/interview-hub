import { Link } from 'react-router-dom';
import { Activity, BookOpen, Flame, Layers, Mic, Target } from 'lucide-react';
import type { ItemType } from '../types';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { TYPE_LABEL, tagLabel } from '../lib/items';
import { forecast, masteryByTag, masteryByType, streak, totalReviews, weakItems } from '../lib/stats';
import { addDays, todayStr } from '../lib/srs';
import { LESSONS } from '../content/lessons';
import { Markdown } from '../components/Markdown';
import { PageHeader, ProgressBar, StatCard } from '../components/ui';

function Heatmap() {
  const { data } = useStore();
  const { tr, lang } = useI18n();
  const today = todayStr();
  const weeks = 18;
  const start = addDays(today, -(weeks * 7 - 1) - new Date().getDay());
  const days = Array.from({ length: weeks * 7 + new Date().getDay() + 1 }, (_, i) => addDays(start, i)).filter((d) => d <= today);
  const level = (d: string) => {
    const a = data.activity[d];
    const n = (a?.reviews ?? 0) + (a?.lessons ?? 0) * 5;
    return n === 0 ? 0 : n < 5 ? 1 : n < 15 ? 2 : n < 30 ? 3 : 4;
  };
  const colors = ['bg-zinc-200 dark:bg-zinc-800', 'bg-brand-200 dark:bg-brand-900', 'bg-brand-300 dark:bg-brand-700', 'bg-brand-500', 'bg-brand-700 dark:bg-brand-400'];
  return (
    <div className="overflow-x-auto">
      <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
        {days.map((d) => (
          <div
            key={d}
            title={`${new Date(d + 'T12:00').toLocaleDateString(lang)}: ${data.activity[d]?.reviews ?? 0} ${tr('repasos', 'reviews')}`}
            className={`h-3.5 w-3.5 rounded-sm ${colors[level(d)]}`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
        {tr('Menos', 'Less')}
        {colors.map((c) => (
          <span key={c} className={`h-3 w-3 rounded-sm ${c}`} />
        ))}
        {tr('Más', 'More')}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data } = useStore();
  const { t, tr, lang } = useI18n();
  const s = streak(data);
  const byType = masteryByType(data);
  const byPattern = masteryByTag(data, 'algorithm');
  const byTopic = masteryByTag(data, 'concept');
  const weak = weakItems(data, 5);
  const fc = forecast(data, 7);
  const maxFc = Math.max(1, ...fc.map((f) => f.count));
  const mocks = [...data.mocks].reverse().slice(-10);

  return (
    <div>
      <PageHeader title={tr('Tu progreso', 'Your progress')} />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Flame size={16} />} label={tr('Racha actual', 'Current streak')} value={`${s.current} 🔥`} hint={tr(`Mejor racha: ${s.best}`, `Best streak: ${s.best}`)} />
        <StatCard icon={<Layers size={16} />} label={tr('Repasos totales', 'Total reviews')} value={totalReviews(data)} />
        <StatCard icon={<BookOpen size={16} />} label={tr('Lecciones', 'Lessons')} value={`${Object.keys(data.lessons).length}/${LESSONS.length}`} />
        <StatCard icon={<Mic size={16} />} label={tr('Simulacros', 'Mocks')} value={data.mocks.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 font-bold">
            <Activity size={18} className="text-brand-500" /> {tr('Actividad', 'Activity')}
          </h2>
          <Heatmap />
          <p className="mt-3 text-xs text-zinc-500">{tr('Un día cuenta para la racha con ≥10 repasos, una lección o un simulacro.', 'A day counts toward the streak with ≥10 reviews, a lesson or a mock.')}</p>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-bold">{tr('Próximos 7 días', 'Next 7 days')}</h2>
          <div className="flex h-32 items-end gap-2">
            {fc.map((f, i) => (
              <div key={f.day} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-bold">{f.count}</span>
                <div className="w-full rounded-t bg-brand-400" style={{ height: `${(f.count / maxFc) * 80 + 2}px` }} />
                <span className="text-[10px] text-zinc-500">{i === 0 ? tr('hoy', 'today') : new Date(f.day + 'T12:00').toLocaleDateString(lang, { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-bold">{tr('Dominio por categoría', 'Mastery by category')}</h2>
          <div className="space-y-3">
            {(Object.entries(byType) as [ItemType, { total: number; seen: number; mastery: number }][]).map(([type, m]) => (
              <div key={type}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{t(TYPE_LABEL[type])}</span>
                  <span className="text-zinc-500">
                    {m.seen}/{m.total} · {Math.round(m.mastery * 100)}%
                  </span>
                </div>
                <ProgressBar value={m.mastery} />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-bold">{tr('Algoritmos por patrón', 'Algorithms by pattern')}</h2>
          <div className="space-y-2.5">
            {Object.entries(byPattern).map(([tag, m]) => (
              <div key={tag} className="flex items-center gap-3 text-sm">
                <span className="w-32 truncate">{tagLabel(tag) ? t(tagLabel(tag)!) : tag}</span>
                <ProgressBar value={m.mastery} className="flex-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-bold">{tr('Fundamentos por tema', 'Fundamentals by topic')}</h2>
          <div className="space-y-2.5">
            {Object.entries(byTopic).map(([tag, m]) => (
              <div key={tag} className="flex items-center gap-3 text-sm">
                <span className="w-32 truncate">{tagLabel(tag) ? t(tagLabel(tag)!) : tag}</span>
                <ProgressBar value={m.mastery} className="flex-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 font-bold">
            <Target size={18} className="text-rose-500" /> {tr('Puntos débiles', 'Weak spots')}
          </h2>
          {!weak.length ? (
            <p className="text-sm text-zinc-500">{tr('Aún no hay suficientes datos. ¡Sigue repasando!', 'Not enough data yet. Keep reviewing!')}</p>
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {weak.map((w) => (
                <li key={w.id} className="flex items-center gap-3 py-2">
                  <div className="line-clamp-1 flex-1 text-sm">
                    <Markdown className="prose-sm">{t(w.front).split('\n')[0]}</Markdown>
                  </div>
                  <span className="text-xs text-rose-500">
                    {data.srs[w.id].lapses} {tr('fallos', 'lapses')}
                  </span>
                  {w.link && (
                    <Link to={w.link} className="text-xs font-semibold text-brand-600 hover:underline">
                      {tr('Estudiar', 'Study')}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-bold">{tr('Evolución de simulacros', 'Mock score trend')}</h2>
          {mocks.length < 1 ? (
            <p className="text-sm text-zinc-500">
              <Link to="/mock" className="text-brand-600 hover:underline">
                {tr('Haz tu primer simulacro', 'Do your first mock')}
              </Link>
            </p>
          ) : (
            <div className="flex h-32 items-end gap-2">
              {mocks.map((m) => {
                const avg = m.answers.reduce((sum, a) => sum + a.selfScore, 0) / Math.max(1, m.answers.length);
                return (
                  <div key={m.id} className="flex flex-1 flex-col items-center gap-1" title={new Date(m.date).toLocaleString(lang)}>
                    <span className="text-[10px] font-bold">{avg.toFixed(1)}</span>
                    <div className="w-full rounded-t bg-emerald-400" style={{ height: `${(avg / 5) * 90}px` }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
