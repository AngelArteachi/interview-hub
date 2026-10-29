import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Eye, History, PartyPopper, RotateCcw, Send } from 'lucide-react';
import type { AIEvaluation, Rating, ReviewItem, SrsState } from '../types';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { TYPE_COLOR, TYPE_LABEL, tagLabel } from '../lib/items';
import { Markdown } from './Markdown';
import { RatingButtons } from './RatingButtons';
import { AIEvaluateButton, AIFeedbackView } from './AIFeedback';
import { DifficultyBadge, ProgressBar } from './ui';

/** Lo que pasó con una tarjeta ya calificada en esta sesión */
interface PastEntry {
  answer: string;
  rating: Rating;
  prev: SrsState | undefined; // estado antes de calificar, para poder cambiar la calificación
  ai: AIEvaluation | null;
}

/**
 * Sesión de repaso con recuerdo activo:
 * pregunta → escribe tu respuesta y "Responder" (o "Mostrar respuesta") → (evaluación IA) → calificar.
 * Las tarjetas calificadas "Otra vez" vuelven al final de la sesión una vez.
 * Con "Anterior" puedes volver a las ya respondidas y cambiar su calificación.
 */
export function ReviewSession({ items, onExit }: { items: ReviewItem[]; onExit?: () => void }) {
  const { data, rate, undoRate } = useStore();
  const { t, tr } = useI18n();
  const [queue, setQueue] = useState(items);
  const [frontier, setFrontier] = useState(0); // primera tarjeta sin calificar
  const [view, setView] = useState(0); // tarjeta que se muestra
  const [past, setPast] = useState<Record<number, PastEntry>>({});
  // Borrador de la tarjeta actual (se conserva mientras navegas hacia atrás)
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ai, setAi] = useState<AIEvaluation | null>(null);
  const [relearned, setRelearned] = useState<Set<string>>(new Set());

  const reviewing = view < frontier;
  const done = frontier >= queue.length && view >= frontier;
  const item = queue[view];
  const entry = reviewing ? past[view] : undefined;

  /** Si el usuario vuelve a calificar "Otra vez" la tarjeta reaparece al final, una sola vez */
  const requeueIfNeeded = (it: ReviewItem, r: Rating, fromPos: number, q: ReviewItem[]) => {
    const pendingCopy = q.findIndex((x, i) => i > fromPos && i >= frontier && x.id === it.id);
    if (r === 1 && pendingCopy === -1 && !relearned.has(it.id)) {
      setRelearned((s) => new Set(s).add(it.id));
      return [...q, it];
    }
    if (r !== 1 && pendingCopy !== -1) {
      setRelearned((s) => {
        const n = new Set(s);
        n.delete(it.id);
        return n;
      });
      return q.filter((_, i) => i !== pendingCopy);
    }
    return q;
  };

  const handleRate = (r: Rating) => {
    if (!item) return;
    setPast((p) => ({ ...p, [frontier]: { answer, rating: r, prev: data.srs[item.id], ai } }));
    rate(item.id, r);
    setQueue((q) => requeueIfNeeded(item, r, frontier, q));
    setFrontier((f) => f + 1);
    setView((v) => v + 1);
    setRevealed(false);
    setSubmitted(false);
    setAnswer('');
    setAi(null);
  };

  /** Solo se puede cambiar la calificación más reciente de cada tarjeta */
  const canChange = (pos: number) => !Object.keys(past).some((k) => Number(k) > pos && queue[Number(k)]?.id === queue[pos].id);

  const changeRating = (r: Rating) => {
    if (!entry || !item || entry.rating === r || !canChange(view)) return;
    undoRate(item.id, entry.prev);
    rate(item.id, r);
    setPast((p) => ({ ...p, [view]: { ...entry, rating: r } }));
    setQueue((q) => requeueIfNeeded(item, r, view, q));
  };

  /** "Responder": envía lo escrito, revela la respuesta y (si hay IA) la evalúa sola */
  const submit = () => {
    if (!answer.trim()) return;
    (document.activeElement as HTMLElement | null)?.blur(); // para que funcionen los atajos 1–4
    setSubmitted(true);
    setRevealed(true);
  };

  const goPrev = () => setView((v) => Math.max(0, v - 1));
  const goNext = () => setView((v) => Math.min(frontier, v + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') return goPrev();
      if (e.key === 'ArrowRight') return goNext();
      if (done) return;
      const digit = ['1', '2', '3', '4'].includes(e.key) ? (Number(e.key) as Rating) : null;
      if (reviewing) {
        if (digit) changeRating(digit);
      } else if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && digit) handleRate(digit);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!queue.length) return null;

  const results = Object.values(past).map((p) => p.rating);

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
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={goPrev} className="btn-secondary">
            <History size={16} /> {tr('Revisar respuestas', 'Review answers')}
          </button>
          {onExit && (
            <button onClick={onExit} className="btn-primary">
              {tr('Continuar', 'Continue')} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  const state = reviewing ? entry?.prev : data.srs[item.id];
  const shownAnswer = reviewing ? entry?.answer ?? '' : answer;
  const shownAi = reviewing ? entry?.ai ?? null : ai;
  const isRevealed = reviewing || revealed;
  const ratingNames = ['', tr('Otra vez', 'Again'), tr('Difícil', 'Hard'), tr('Bien', 'Good'), tr('Fácil', 'Easy')];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <button onClick={goPrev} disabled={view === 0} className="btn-ghost px-2 py-1 text-xs" title="←">
          <ChevronLeft size={16} /> {tr('Anterior', 'Previous')}
        </button>
        <span className="font-mono">
          {view + 1}/{queue.length}
        </span>
        <ProgressBar value={frontier / queue.length} className="flex-1" />
        {reviewing && (
          <button onClick={goNext} className="btn-ghost px-2 py-1 text-xs" title="→">
            {view + 1 === frontier ? tr('Volver a la actual', 'Back to current') : tr('Siguiente', 'Next')} <ChevronRight size={16} />
          </button>
        )}
        {onExit && (
          <button onClick={onExit} className="btn-ghost px-2 py-1 text-xs">
            {tr('Salir', 'Exit')}
          </button>
        )}
      </div>

      {reviewing && (
        <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
          <History size={15} /> {tr('Estás viendo una tarjeta ya respondida.', 'You are viewing an answered card.')}
        </div>
      )}

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
              value={shownAnswer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && answer.trim()) {
                  e.preventDefault();
                  submit();
                }
              }}
              readOnly={isRevealed}
              rows={3}
              className={`input resize-y ${submitted || (reviewing && shownAnswer) ? 'border-brand-400 bg-brand-50/40 dark:bg-brand-500/5' : ''}`}
              placeholder={
                reviewing
                  ? tr('(no escribiste respuesta)', '(no answer written)')
                  : item.type === 'algorithm'
                    ? tr('Enfoque, estructura de datos y complejidad…', 'Approach, data structure and complexity…')
                    : tr('Responde con tus palabras antes de ver la respuesta…', 'Answer in your own words before revealing…')
              }
            />
          </div>

          {!isRevealed ? (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button onClick={submit} disabled={!answer.trim()} className="btn-primary" title="Ctrl + Enter">
                <Send size={16} /> {tr('Responder', 'Submit answer')}
              </button>
              <button onClick={() => setRevealed(true)} className="btn-secondary">
                <Eye size={16} /> {tr('Mostrar respuesta', 'Show answer')} <kbd className="ml-1 rounded bg-zinc-200 px-1.5 font-mono text-[10px] dark:bg-zinc-700">␣</kbd>
              </button>
            </div>
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
              {!reviewing && !ai && (
                <AIEvaluateButton type={item.type} question={t(item.front)} referenceAnswer={t(item.back)} userAnswer={answer} onResult={setAi} autoRun={submitted} />
              )}
              {shownAi && <AIFeedbackView ev={shownAi} />}
              <div>
                {reviewing && entry ? (
                  <>
                    <div className="label">
                      {tr('Tu calificación:', 'Your rating:')} <span className="text-brand-600 dark:text-brand-300">{ratingNames[entry.rating]}</span>
                      {canChange(view) && <span className="ml-1 normal-case">· {tr('elige otra para cambiarla', 'pick another to change it')}</span>}
                    </div>
                    {canChange(view) ? (
                      <RatingButtons state={state} onRate={changeRating} suggested={entry.rating} />
                    ) : (
                      <p className="text-xs text-zinc-500">{tr('Volviste a ver esta tarjeta más adelante; cambia esa calificación.', 'You saw this card again later; change that rating instead.')}</p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="label">{tr('¿Qué tan bien lo sabías?', 'How well did you know it?')}</div>
                    <RatingButtons state={state} onRate={handleRate} suggested={ai?.suggestedRating} />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
