import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, Dumbbell } from 'lucide-react';
import { TRACKS, lessonsByTrack } from '../content/lessons';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { PageHeader, ProgressRing } from '../components/ui';

export default function Learn() {
  const { data } = useStore();
  const { t, tr } = useI18n();
  return (
    <div>
      <PageHeader
        title={tr('Aprender', 'Learn')}
        subtitle={tr('Rutas de aprendizaje con lecciones cortas, quiz, visualizaciones y tutor IA.', 'Learning paths with short lessons, quizzes, visualizations and an AI tutor.')}
      />
      <div className="space-y-8">
        {TRACKS.map((track) => {
          const lessons = lessonsByTrack(track.id);
          const done = lessons.filter((l) => data.lessons[l.id]).length;
          const nextId = lessons.find((l) => !data.lessons[l.id])?.id;
          return (
            <section key={track.id} className="card overflow-hidden">
              <div className={`flex items-center gap-4 bg-gradient-to-r ${track.color} p-5 text-white`}>
                <div className="flex-1">
                  <h2 className="text-xl font-extrabold">{t(track.title)}</h2>
                  <p className="text-sm text-white/85">{t(track.description)}</p>
                </div>
                <div className="rounded-full bg-white/90 p-1 text-zinc-900">
                  <ProgressRing value={done / lessons.length} size={56} label={`${done}/${lessons.length}`} />
                </div>
              </div>
              <ol className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {lessons.map((l, i) => {
                  const p = data.lessons[l.id];
                  return (
                    <li key={l.id}>
                      <Link to={l.id} className={`flex items-center gap-4 px-5 py-3.5 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${l.id === nextId ? 'bg-brand-50/50 dark:bg-brand-500/5' : ''}`}>
                        <span className="w-6 text-center font-mono text-sm text-zinc-400">{i + 1}</span>
                        {p ? <CheckCircle2 size={20} className="shrink-0 text-emerald-500" /> : <Circle size={20} className="shrink-0 text-zinc-300 dark:text-zinc-600" />}
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold">{t(l.title)}</div>
                          <div className="truncate text-sm text-zinc-500">{t(l.summary)}</div>
                        </div>
                        {l.id === nextId && <span className="chip hidden bg-brand-600 text-white sm:inline-flex">{tr('Siguiente', 'Next')}</span>}
                        {!!l.practice?.length && (
                          <span className="chip hidden bg-zinc-100 text-zinc-600 sm:inline-flex dark:bg-zinc-800 dark:text-zinc-300" title={tr('Ejercicios de práctica resueltos', 'Practice exercises solved')}>
                            <Dumbbell size={11} /> {l.practice.filter((e) => data.exercises?.[`${l.id}:${e.id}`]?.ok).length}/{l.practice.length}
                          </span>
                        )}
                        {p && <span className="hidden text-xs text-zinc-500 sm:block">Quiz {p.quizScore}%</span>}
                        <span className="flex shrink-0 items-center gap-1 text-xs text-zinc-400">
                          <Clock size={12} /> {l.minutes}m
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
