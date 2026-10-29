import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { BookOpen, ChevronLeft, Dumbbell } from 'lucide-react';
import type { ExerciseLevel } from '../types';
import { lessonById } from '../content/lessons';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { Exercise, LEVEL_LABEL } from '../components/Exercise';
import { Empty, ProgressBar } from '../components/ui';

type Filter = ExerciseLevel | 'all' | 'missed';

/** Banco de ejercicios de una lección: practicar recordando, sin releer */
export default function LessonPractice() {
  const { id = '' } = useParams();
  const lesson = lessonById(id);
  const { data } = useStore();
  const { t, tr } = useI18n();
  const [filter, setFilter] = useState<Filter>('all');
  if (!lesson || !lesson.practice?.length) return <Navigate to={lesson ? `/learn/${id}` : '/learn'} replace />;

  const bank = lesson.practice;
  const status = (exId: string) => data.exercises?.[`${lesson.id}:${exId}`];
  const done = bank.filter((e) => status(e.id)?.ok).length;
  const list = bank.filter((e) =>
    filter === 'all' ? true : filter === 'missed' ? status(e.id) && !status(e.id)!.ok : e.level === filter,
  );
  const filters: { k: Filter; label: string; n: number }[] = [
    { k: 'all', label: tr('Todos', 'All'), n: bank.length },
    ...(['basic', 'medium', 'interview'] as ExerciseLevel[]).map((lv) => ({ k: lv as Filter, label: t(LEVEL_LABEL[lv]), n: bank.filter((e) => e.level === lv).length })),
    { k: 'missed', label: tr('Los que fallé', 'The ones I missed'), n: bank.filter((e) => status(e.id) && !status(e.id)!.ok).length },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={`/learn/${lesson.id}`} className="mb-3 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-brand-600">
        <ChevronLeft size={16} /> {t(lesson.title)}
      </Link>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            <Dumbbell className="text-brand-500" /> {tr('Practica esta lección', 'Practice this lesson')}
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            {tr(
              'Resuelve sin mirar la lección: recordar por tu cuenta es lo que más ayuda a fijar lo aprendido. Los que falles entran a tu repaso diario.',
              'Solve them without looking at the lesson: recalling on your own is what helps most to make it stick. The ones you miss join your daily review.',
            )}
          </p>
        </div>
        <Link to={`/learn/${lesson.id}`} className="btn-secondary">
          <BookOpen size={16} /> {tr('Ver lección', 'View lesson')}
        </Link>
      </div>

      <div className="card mb-5 flex items-center gap-3 p-4 text-sm">
        <span className="font-semibold">
          {done}/{bank.length} {tr('resueltos', 'solved')}
        </span>
        <ProgressBar value={done / bank.length} className="flex-1" />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={`chip shrink-0 border px-3 py-1.5 text-sm ${filter === f.k ? 'border-brand-500 bg-brand-600 text-white' : 'border-zinc-300 dark:border-zinc-700'}`}
          >
            {f.label} <span className="opacity-70">{f.n}</span>
          </button>
        ))}
      </div>

      {!list.length ? (
        <Empty icon={<Dumbbell />} title={filter === 'missed' ? tr('No tienes ejercicios fallados', 'No missed exercises') : tr('Sin ejercicios', 'No exercises')}>
          {filter === 'missed' && tr('¡Bien! Cuando falles uno aparecerá aquí para que lo repitas.', 'Nice! When you miss one it will show up here to retry.')}
        </Empty>
      ) : (
        <div className="space-y-4">
          {list.map((ex) => (
            <Exercise key={ex.id} ex={ex} lessonId={lesson.id} compact />
          ))}
        </div>
      )}
    </div>
  );
}
