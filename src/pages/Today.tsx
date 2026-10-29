import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarCheck, CheckCircle2, Flame, Layers, Mic, Sparkles } from 'lucide-react';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { dailyQueue } from '../lib/items';
import { streak } from '../lib/stats';
import { LESSONS, trackById } from '../content/lessons';
import { ReviewSession } from '../components/ReviewSession';
import { PageHeader, StatCard } from '../components/ui';

export default function Today() {
  const { data } = useStore();
  const { t, tr } = useI18n();
  const [running, setRunning] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const queue = useMemo(() => dailyQueue(data), [data]);
  const s = streak(data);
  const nextLesson = LESSONS.find((l) => !data.lessons[l.id]);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? tr('¡Buenos días!', 'Good morning!') : hour < 19 ? tr('¡Buenas tardes!', 'Good afternoon!') : tr('¡Buenas noches!', 'Good evening!');

  if (running && queue.all.length) {
    return (
      <div className="mx-auto max-w-3xl">
        <ReviewSession key={sessionKey} items={queue.all} onExit={() => setRunning(false)} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={greeting} subtitle={tr('Tu plan de estudio para hoy', 'Your study plan for today')} />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<CalendarCheck size={16} />} label={tr('Por repasar', 'Due')} value={queue.due.length} />
        <StatCard icon={<Sparkles size={16} />} label={tr('Nuevas hoy', 'New today')} value={queue.fresh.length} />
        <StatCard icon={<Flame size={16} />} label={tr('Racha', 'Streak')} value={`${s.current} ${tr('días', 'days')}`} hint={tr(`Mejor: ${s.best}`, `Best: ${s.best}`)} />
        <StatCard icon={<BookOpen size={16} />} label={tr('Lecciones', 'Lessons')} value={`${Object.keys(data.lessons).length}/${LESSONS.length}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card relative overflow-hidden p-6 lg:col-span-2">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-2xl" />
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Layers size={20} className="text-brand-500" /> {tr('Repaso diario', 'Daily review')}
          </h2>
          {queue.all.length ? (
            <>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                {tr(
                  `Tienes ${queue.due.length} tarjetas para repasar y ${queue.fresh.length} nuevas. Unos ${Math.max(1, Math.round(queue.all.length * 1.2))} minutos.`,
                  `You have ${queue.due.length} cards to review and ${queue.fresh.length} new ones. About ${Math.max(1, Math.round(queue.all.length * 1.2))} minutes.`,
                )}
              </p>
              <button
                onClick={() => {
                  setSessionKey((k) => k + 1);
                  setRunning(true);
                }}
                className="btn-primary mt-5 px-6 py-3 text-base"
              >
                {tr('Empezar repaso', 'Start review')} <ArrowRight size={18} />
              </button>
            </>
          ) : (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2 />
              <div>
                <div className="font-bold">{tr('¡Al día!', 'All caught up!')}</div>
                <div className="text-sm">
                  {tr('Vuelve mañana o practica libremente en ', 'Come back tomorrow or practice freely in ')}
                  <Link to="/practice" className="font-semibold underline">
                    {tr('Practicar', 'Practice')}
                  </Link>
                  .
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {nextLesson && (
            <Link to={`/learn/${nextLesson.id}`} className="card block p-5 transition hover:border-brand-400">
              <div className="text-xs font-semibold uppercase text-zinc-500">{tr('Siguiente lección', 'Next lesson')}</div>
              <div className="mt-1 font-bold">{t(nextLesson.title)}</div>
              <div className="mt-1 text-sm text-zinc-500">
                {t(trackById(nextLesson.track).title)} · {nextLesson.minutes} min
              </div>
            </Link>
          )}
          <Link to="/mock" className="card block p-5 transition hover:border-brand-400">
            <div className="flex items-center gap-2 font-bold">
              <Mic size={18} className="text-brand-500" /> {tr('Simulacro de entrevista', 'Mock interview')}
            </div>
            <div className="mt-1 text-sm text-zinc-500">
              {data.mocks.length
                ? tr(`Has hecho ${data.mocks.length}. ¿Otro hoy?`, `You've done ${data.mocks.length}. Another today?`)
                : tr('Practica con tiempo real y preguntas de tus puntos débiles.', 'Practice under real time with questions from your weak spots.')}
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
        💡{' '}
        {tr(
          'Flujo recomendado: aprende una lección → practica sus problemas → repasa a diario. Los conceptos de cada lección completada se agregan solos a tu repaso.',
          'Recommended flow: learn a lesson → practice its problems → review daily. Concepts from every completed lesson are added to your reviews automatically.',
        )}
      </div>
    </div>
  );
}
