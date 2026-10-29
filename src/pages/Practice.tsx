import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Code2, Network, PenSquare, Play, Puzzle, Shuffle, Users } from 'lucide-react';
import type { Difficulty, ItemType } from '../types';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { TYPE_LABEL, allItems } from '../lib/items';
import { mastery } from '../lib/srs';
import { ReviewSession } from '../components/ReviewSession';
import { PageHeader, ProgressBar } from '../components/ui';

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

export default function Practice() {
  const { data } = useStore();
  const { t, tr } = useI18n();
  const items = useMemo(() => allItems(data), [data]);
  const [types, setTypes] = useState<ItemType[]>(['algorithm', 'concept']);
  const [diff, setDiff] = useState<Difficulty | 'all'>('all');
  const [mode, setMode] = useState<'random' | 'weak' | 'unseen'>('random');
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<typeof items | null>(null);

  const typeMastery = (type: ItemType) => {
    const list = items.filter((i) => i.type === type);
    return list.length ? list.reduce((a, i) => a + mastery(data.srs[i.id]), 0) / list.length : 0;
  };

  const sections = [
    { to: 'algorithms', icon: Code2, title: tr('Algoritmos', 'Algorithms'), desc: tr('42 problemas por patrón con pistas y soluciones', '42 problems by pattern with hints and solutions'), type: 'algorithm' as ItemType },
    { to: 'patterns', icon: Puzzle, title: tr('Adivina el patrón', 'Guess the pattern'), desc: tr('Lee el enunciado e identifica la técnica', 'Read the statement and identify the technique') },
    { to: 'concepts', icon: Brain, title: tr('Fundamentos', 'Fundamentals'), desc: tr('Flashcards de OOP, BD, web, SO y más', 'Flashcards on OOP, DBs, web, OS and more'), type: 'concept' as ItemType },
    { to: 'design', icon: Network, title: 'System design', desc: tr('Casos básicos con un marco guiado', 'Basic cases with a guided framework'), type: 'design' as ItemType },
    { to: 'behavioral', icon: Users, title: tr('Conductuales', 'Behavioral'), desc: tr('Tus historias STAR y preguntas frecuentes', 'Your STAR stories and common questions'), type: 'behavioral' as ItemType },
    { to: 'custom', icon: PenSquare, title: tr('Mis preguntas', 'My questions'), desc: tr('Crea tarjetas propias (p. ej. de entrevistas reales)', 'Create your own cards (e.g. from real interviews)'), type: 'custom' as ItemType },
  ];

  const start = () => {
    let pool = items.filter((i) => types.includes(i.type));
    if (diff !== 'all') pool = pool.filter((i) => !i.difficulty || i.difficulty === diff);
    if (mode === 'unseen') pool = shuffle(pool.filter((i) => !data.srs[i.id]));
    else if (mode === 'weak') pool = pool.filter((i) => data.srs[i.id]).sort((a, b) => mastery(data.srs[a.id]) - mastery(data.srs[b.id]));
    else pool = shuffle(pool);
    setSession(pool.slice(0, count));
  };

  if (session?.length)
    return (
      <div className="mx-auto max-w-3xl">
        <ReviewSession items={session} onExit={() => setSession(null)} />
      </div>
    );

  const typeOptions: ItemType[] = ['algorithm', 'concept', 'lesson', 'design', 'behavioral', 'custom'];

  return (
    <div>
      <PageHeader title={tr('Practicar', 'Practice')} subtitle={tr('Estudio libre por categoría. Todo lo que califiques actualiza tu repaso espaciado.', 'Free study by category. Everything you rate updates your spaced repetition.')} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="card group p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-brand-50 p-2.5 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                <s.icon size={20} />
              </div>
              <h3 className="font-bold">{s.title}</h3>
            </div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{s.desc}</p>
            {s.type && (
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                <ProgressBar value={typeMastery(s.type)} className="flex-1" />
                {Math.round(typeMastery(s.type) * 100)}%
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="card mt-8 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Shuffle size={20} className="text-brand-500" /> {tr('Sesión personalizada', 'Custom session')}
        </h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <div className="label">{tr('Tipos', 'Types')}</div>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((ty) => (
                <button
                  key={ty}
                  onClick={() => setTypes((x) => (x.includes(ty) ? x.filter((y) => y !== ty) : [...x, ty]))}
                  className={`chip border px-3 py-1 text-sm ${types.includes(ty) ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : 'border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300'}`}
                >
                  {t(TYPE_LABEL[ty])} <span className="opacity-60">{items.filter((i) => i.type === ty).length}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="label">{tr('Modo', 'Mode')}</div>
            <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="input">
              <option value="random">{tr('Aleatorio', 'Random')}</option>
              <option value="weak">{tr('Mis puntos débiles primero', 'My weak spots first')}</option>
              <option value="unseen">{tr('Solo nuevas', 'New only')}</option>
            </select>
          </div>
          <div>
            <div className="label">{tr('Dificultad (algoritmos)', 'Difficulty (algorithms)')}</div>
            <select value={diff} onChange={(e) => setDiff(e.target.value as typeof diff)} className="input">
              <option value="all">{tr('Todas', 'All')}</option>
              <option value="easy">{tr('Fácil', 'Easy')}</option>
              <option value="medium">{tr('Media', 'Medium')}</option>
            </select>
          </div>
          <div>
            <div className="label">
              {tr('Cantidad', 'Count')}: {count}
            </div>
            <input type="range" min={5} max={30} step={5} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-brand-600" />
          </div>
        </div>
        <button onClick={start} disabled={!types.length} className="btn-primary mt-5">
          <Play size={16} /> {tr('Empezar', 'Start')}
        </button>
      </div>
    </div>
  );
}
