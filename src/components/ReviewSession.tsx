import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, PartyPopper, RotateCcw } from 'lucide-react';
import type { AIEvaluation, Rating, ReviewItem } from '../types';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { TYPE_COLOR, TYPE_LABEL, tagLabel } from '../lib/items';
import { Markdown } from './Markdown';
import { RatingButtons } from './RatingButtons';
import { AIEvaluateButton, AIFeedbackView } from './AIFeedback';
import { DifficultyBadge, ProgressBar } from './ui';

/**
 * Sesión de repaso con recuerdo activo:
 * pregunta → (escribe tu respuesta) → revelar → (evaluación IA) → calificar.
 * Las tarjetas calificadas "Otra vez" vuelven al final de la sesión una vez.
 */
export function ReviewSession({ items, onExit }: { items: ReviewItem[]; onExit?: () => void }) {
  const { data, rate } = useStore();
  const { t, tr } = useI18n();
  const [queue, setQueue] = useState(items);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState('');
  const [ai, setAi] = useState<AIEvaluation | null>(null);
  const [results, setResults] = useState<Rating[]>([]);
  const [relearned, setRelearned] = useState<Set<string>>(new Set());

  const item = queue[idx];
  const done = idx >= queue.length;

  const handleRate = (r: Rating) => {
    if (!item) return;
    rate(item.id, r);
    setResults((x) => [...x, r]);
    if (r === 1 && !relearned.has(item.id)) {
      setQueue((q) => [...q, item]);
      setRelearned((s) => new Set(s).add(item.id));
    }
    setIdx((i) => i + 1);
    setRevealed(false);
    setAnswer('');
    setAi(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && ['1', '2', '3', '4'].includes(e.key)) handleRate(Number(e.key) as Rating);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!queue.length) return null;

  if (done) {
    const good = results.filter((r) => r >= 3).length;
    return (
      <div className="card flex flex-col items-center gap-4 p-10 text-center">
        <PartyPopper className="text-brand-500" size={48} />
        <h2 className="text-2xl font-extrabold">{tr('¡Sesión completada!', 'Session complete!')}</h2>
        <p className="text-zinc-500">
          {tr(`Repasaste ${results.length} tarjetas · ${good} bien o fácil`, `You reviewed ${results.length} cards · ${good} good or easy`)}
        </p>
        <div className="flex gap-1">
          {results.map((r, i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${['', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-sky-500'][r]}`} />
          ))}
        </div>
        {onExit && (
          <button onClick={onExit} className="btn-primary">
            {tr('Continuar', 'Continue')} <ArrowRight size={16} />
          </button>
        )}
      </div>
    );
  }

  const state = data.srs[item.id];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-zinc-500">
        <span className="font-mono">
          {idx + 1}/{queue.length}
        </span>
        <ProgressBar value={idx / queue.length} className="flex-1" />
        {onExit && (
          <button onClick={onExit} className="btn-ghost px-2 py-1 text-xs">
            {tr('Salir', 'Exit')}
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
          <span className={`chip ${TYPE_COLOR[item.type]}`}>{t(TYPE_LABEL[item.type])}</span>
          {item.difficulty && <DifficultyBadge d={item.difficulty} />}
          {item.tags.slice(0, 2).map((tag) => {
            const lab = tagLabel(tag);
            return lab ? (
              <span key={tag} className="chip bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {t(lab)}
              </span>
            ) : null;
          })}
          {!state && <span className="chip ml-auto bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">{tr('Nueva', 'New')}</span>}
          {state && state.lapses > 0 && (
            <span className="chip ml-auto bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
              <RotateCcw size={11} /> {state.lapses}
            </span>
          )}
        </div>

        <div className="p-5">
          <Markdown>{t(item.front)}</Markdown>

          <div className="mt-5">
            <label className="label">{tr('Tu respuesta (recuerdo activo)', 'Your answer (active recall)')}</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              className="input resize-y"
              placeholder={
                item.type === 'algorithm'
                  ? tr('Enfoque, estructura de datos y complejidad…', 'Approach, data structure and complexity…')
                  : tr('Responde con tus palabras antes de ver la respuesta…', 'Answer in your own words before revealing…')
              }
            />
          </div>

          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="btn-primary mt-4 w-full sm:w-auto">
              <Eye size={16} /> {tr('Mostrar respuesta', 'Show answer')} <kbd className="ml-1 rounded bg-white/20 px-1.5 font-mono text-[10px]">␣</kbd>
            </button>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                <div className="mb-2 text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400">{tr('Respuesta', 'Answer')}</div>
                <Markdown className="prose-sm">{t(item.back)}</Markdown>
                {item.link && (
                  <Link to={item.link} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
                    {tr('Ver detalle', 'See details')} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
              {!ai && (
                <AIEvaluateButton type={item.type} question={t(item.front)} referenceAnswer={t(item.back)} userAnswer={answer} onResult={setAi} />
              )}
              {ai && <AIFeedbackView ev={ai} />}
              <div>
                <div className="label">{tr('¿Qué tan bien lo sabías?', 'How well did you know it?')}</div>
                <RatingButtons state={state} onRate={handleRate} suggested={ai?.suggestedRating} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
