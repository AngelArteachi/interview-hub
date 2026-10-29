import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Search } from 'lucide-react';
import type { Difficulty, Pattern } from '../types';
import { ALGORITHMS, PATTERNS } from '../data/algorithms';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { mastery } from '../lib/srs';
import { DifficultyBadge, PageHeader, ProgressBar } from '../components/ui';

export default function Algorithms() {
  const { data } = useStore();
  const { t, tr } = useI18n();
  const [q, setQ] = useState('');
  const [pattern, setPattern] = useState<Pattern | 'all'>('all');
  const [diff, setDiff] = useState<Difficulty | 'all'>('all');
  const [status, setStatus] = useState<'all' | 'todo' | 'seen'>('all');

  const list = ALGORITHMS.filter(
    (a) =>
      (pattern === 'all' || a.pattern === pattern) &&
      (diff === 'all' || a.difficulty === diff) &&
      (status === 'all' || (status === 'seen') === Boolean(data.srs[`alg:${a.id}`])) &&
      (!q || t(a.title).toLowerCase().includes(q.toLowerCase())),
  );

  const patterns = Object.keys(PATTERNS) as Pattern[];
  const solved = ALGORITHMS.filter((a) => data.srs[`alg:${a.id}`]).length;

  return (
    <div>
      <PageHeader
        back="/practice"
        title={tr('Algoritmos', 'Algorithms')}
        subtitle={tr(`${solved} de ${ALGORITHMS.length} practicados`, `${solved} of ${ALGORITHMS.length} practiced`)}
        actions={
          <Link to="/practice/patterns" className="btn-secondary">
            {tr('Adivina el patrón', 'Guess the pattern')}
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr('Buscar…', 'Search…')} className="input pl-9" />
        </div>
        <select value={diff} onChange={(e) => setDiff(e.target.value as typeof diff)} className="input w-auto">
          <option value="all">{tr('Toda dificultad', 'Any difficulty')}</option>
          <option value="easy">{tr('Fácil', 'Easy')}</option>
          <option value="medium">{tr('Media', 'Medium')}</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="input w-auto">
          <option value="all">{tr('Todos', 'All')}</option>
          <option value="todo">{tr('Pendientes', 'To do')}</option>
          <option value="seen">{tr('Practicados', 'Practiced')}</option>
        </select>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setPattern('all')} className={`chip shrink-0 border px-3 py-1.5 text-sm ${pattern === 'all' ? 'border-brand-500 bg-brand-600 text-white' : 'border-zinc-300 dark:border-zinc-700'}`}>
          {tr('Todos', 'All')}
        </button>
        {patterns.map((p) => (
          <button
            key={p}
            onClick={() => setPattern(p)}
            className={`chip shrink-0 border px-3 py-1.5 text-sm ${pattern === p ? 'border-brand-500 bg-brand-600 text-white' : 'border-zinc-300 dark:border-zinc-700'}`}
          >
            {t(PATTERNS[p].name)}
          </button>
        ))}
      </div>

      {pattern !== 'all' && (
        <div className="mb-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-900 dark:bg-brand-500/10 dark:text-brand-200">
          <b>{t(PATTERNS[pattern].name)}:</b> {t(PATTERNS[pattern].idea)}
        </div>
      )}

      <div className="card divide-y divide-zinc-100 dark:divide-zinc-800">
        {list.map((a) => {
          const s = data.srs[`alg:${a.id}`];
          return (
            <Link key={a.id} to={a.id} className="flex items-center gap-3 px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              {s ? <CheckCircle2 size={18} className="shrink-0 text-emerald-500" /> : <Circle size={18} className="shrink-0 text-zinc-300 dark:text-zinc-600" />}
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{t(a.title)}</div>
                <div className="text-xs text-zinc-500">{t(PATTERNS[a.pattern].name)}</div>
              </div>
              {s && <ProgressBar value={mastery(s)} className="hidden w-20 sm:block" />}
              <DifficultyBadge d={a.difficulty} />
            </Link>
          );
        })}
        {!list.length && <div className="p-8 text-center text-sm text-zinc-500">{tr('Sin resultados', 'No results')}</div>}
      </div>
    </div>
  );
}
