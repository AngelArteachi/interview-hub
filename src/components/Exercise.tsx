import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Check, CheckCircle2, Eye, Footprints, PencilLine, RotateCcw, X, XCircle } from 'lucide-react';
import type { Exercise as Ex, ExerciseLevel, L } from '../types';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { CodeBlock } from './CodeBlock';
import { Markdown } from './Markdown';
import { normalizeOutput, shuffledOrder } from '../lib/exercise';
import { StepTrace, traceFor, visibleSteps } from './StepTrace';

export const LEVEL_LABEL: Record<ExerciseLevel, L> = {
  basic: { es: 'Básico', en: 'Basic' },
  medium: { es: 'Intermedio', en: 'Intermediate' },
  interview: { es: 'Tipo entrevista', en: 'Interview-style' },
};

const KIND_LABEL: Record<Ex['kind'], L> = {
  predict: { es: 'Predice la salida', en: 'Predict the output' },
  complete: { es: 'Completa el código', en: 'Complete the code' },
  recall: { es: 'Repaso rápido', en: 'Quick recall' },
  order: { es: 'Ordena los pasos', en: 'Put the steps in order' },
};

function Result({ ok, children }: { ok: boolean; children?: ReactNode }) {
  const { tr } = useI18n();
  return (
    <div
      className={`mt-3 rounded-xl border p-3 text-sm ${
        ok ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10' : 'border-rose-300 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10'
      }`}
    >
      <div className={`mb-1 flex items-center gap-1.5 font-bold ${ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
        {ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
        {ok ? tr('¡Correcto!', 'Correct!') : tr('Todavía no', 'Not yet')}
      </div>
      {children}
      {!ok && <p className="mt-2 text-xs text-zinc-500">{tr('Este ejercicio se agregó a tu repaso de hoy.', "This exercise was added to today's review.")}</p>}
    </div>
  );
}

/** Ejercicio de práctica. No cuenta para aprobar la lección; si se falla, entra al repaso. */
export function Exercise({ ex, lessonId, compact = false }: { ex: Ex; lessonId: string; compact?: boolean }) {
  const { data, recordExercise } = useStore();
  const { t, tr } = useI18n();
  const [attempt, setAttempt] = useState(0);
  const [wide, setWide] = useState(false);
  const prev = data.exercises?.[`${lessonId}:${ex.id}`];
  const record = (ok: boolean) => recordExercise(lessonId, ex.id, ok);

  return (
    <div
      className={`not-prose rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/40 p-4 dark:border-brand-500/40 dark:bg-brand-500/5 ${compact ? '' : 'my-6'} ${
        // Con el paso a paso abierto, en pantallas anchas el ejercicio sale de la columna para que quepan código y panel lado a lado
        wide ? 'lg:relative lg:left-1/2 lg:w-[min(76rem,calc(100vw-4rem))] lg:-translate-x-1/2' : ''
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="flex items-center gap-1 text-brand-700 dark:text-brand-300">
          <PencilLine size={14} /> {t(KIND_LABEL[ex.kind])}
        </span>
        <span className="chip bg-white text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{t(LEVEL_LABEL[ex.level])}</span>
        {prev && (
          <span className={`chip ml-auto ${prev.ok ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'}`}>
            {prev.ok ? tr('Último intento: bien', 'Last try: correct') : tr('Último intento: falló', 'Last try: missed')}
          </span>
        )}
      </div>
      <ExerciseBody key={attempt} ex={ex} record={record} setWide={setWide} />
      <button
        onClick={() => {
          setAttempt((a) => a + 1);
          setWide(false);
        }}
        className="btn-ghost mt-2 px-2 py-1 text-xs"
      >
        <RotateCcw size={13} /> {tr('Intentar de nuevo', 'Try again')}
      </button>
    </div>
  );
}

function ExerciseBody({ ex, record, setWide }: { ex: Ex; record: (ok: boolean) => void; setWide: (w: boolean) => void }) {
  switch (ex.kind) {
    case 'predict':
      return <Predict ex={ex} record={record} setWide={setWide} />;
    case 'complete':
      return <Complete ex={ex} record={record} setWide={setWide} />;
    case 'recall':
      return <Recall ex={ex} record={record} />;
    case 'order':
      return <Order ex={ex} record={record} />;
  }
}

type Of<K extends Ex['kind']> = Extract<Ex, { kind: K }>;

/**
 * Código del ejercicio con un botón opcional "Ver paso a paso" que abre el panel al lado.
 * `available`: si ya se puede abrir (en "completa el código" solo después de responder).
 * `unlocked`: si se ven todos los pasos (antes de responder los últimos quedan bloqueados).
 */
function CodeWithTrace({
  exId,
  code,
  shownCode,
  lang,
  walkthrough,
  available,
  unlocked,
  setWide,
}: {
  exId: string;
  code: string;
  shownCode: string;
  lang: string;
  walkthrough?: L;
  available: boolean;
  unlocked: boolean;
  setWide: (w: boolean) => void;
}) {
  const { tr } = useI18n();
  const trace = traceFor(exId, code);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const toggle = () => {
    setOpen(!open);
    setWide(!open);
  };
  const current = trace?.steps[Math.min(step, visibleSteps(trace.steps.length, unlocked) - 1)];

  return (
    <div>
      {trace && (
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <button
            onClick={toggle}
            disabled={!available}
            className={`btn px-3 py-1.5 text-xs ${open ? 'bg-brand-600 text-white hover:bg-brand-500' : 'border border-brand-300 bg-white text-brand-700 hover:bg-brand-50 dark:border-brand-500/40 dark:bg-zinc-900 dark:text-brand-300'}`}
          >
            <Footprints size={14} /> {open ? tr('Ocultar paso a paso', 'Hide step by step') : tr('Ver paso a paso', 'Show step by step')}
          </button>
          <span className="text-xs text-zinc-500">
            {available
              ? tr('Opcional: te guía sin darte la respuesta.', 'Optional: it guides you without giving the answer.')
              : tr('Disponible después de responder (antes delataría la línea que falta).', 'Available after you answer (before, it would reveal the missing line).')}
          </span>
        </div>
      )}
      {trace && open && available ? (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <div className="min-w-0">
            <CodeBlock code={shownCode} lang={lang} highlightLine={current?.line} />
          </div>
          <StepTrace trace={trace} walkthrough={walkthrough} step={step} setStep={setStep} unlocked={unlocked} />
        </div>
      ) : (
        <CodeBlock code={shownCode} lang={lang} />
      )}
    </div>
  );
}

function Predict({ ex, record, setWide }: { ex: Of<'predict'>; record: (ok: boolean) => void; setWide: (w: boolean) => void }) {
  const { t, tr } = useI18n();
  const [text, setText] = useState('');
  const [state, setState] = useState<'idle' | 'ok' | 'mismatch' | 'fail'>('idle');
  const check = () => {
    if (normalizeOutput(text) === normalizeOutput(ex.answer)) {
      setState('ok');
      record(true);
    } else setState('mismatch');
  };
  return (
    <div>
      <Markdown className="prose-sm">{t(ex.prompt)}</Markdown>
      <CodeWithTrace
        exId={ex.id}
        code={ex.code}
        shownCode={ex.code}
        lang={ex.lang}
        walkthrough={ex.walkthrough}
        available
        unlocked={state === 'ok' || state === 'fail'}
        setWide={setWide}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={state !== 'idle'}
        rows={Math.min(4, ex.answer.split('\n').length + 1)}
        className="input resize-y font-mono"
        placeholder={tr('Escribe exactamente lo que imprime…', 'Write exactly what it prints…')}
      />
      {state === 'idle' && (
        <button onClick={check} disabled={!text.trim()} className="btn-primary mt-2 py-1.5">
          <Check size={15} /> {tr('Comprobar', 'Check')}
        </button>
      )}
      {state === 'mismatch' && (
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="mb-1 font-semibold">{tr('La salida real es:', 'The actual output is:')}</div>
          <pre className="overflow-x-auto rounded-lg bg-white p-2 font-mono text-xs dark:bg-zinc-900">{ex.answer}</pre>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setState('ok');
                record(true);
              }}
              className="btn border border-emerald-300 py-1 text-xs text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300"
            >
              {tr('La tenía bien (solo cambia el formato)', 'I had it right (only formatting differs)')}
            </button>
            <button
              onClick={() => {
                setState('fail');
                record(false);
              }}
              className="btn border border-rose-300 py-1 text-xs text-rose-700 dark:border-rose-500/40 dark:text-rose-300"
            >
              {tr('No la tenía', 'I got it wrong')}
            </button>
          </div>
        </div>
      )}
      {(state === 'ok' || state === 'fail') && (
        <Result ok={state === 'ok'}>
          {state === 'fail' && <pre className="mb-2 overflow-x-auto rounded-lg bg-white p-2 font-mono text-xs dark:bg-zinc-900">{ex.answer}</pre>}
          <Markdown className="prose-sm">{t(ex.explanation)}</Markdown>
        </Result>
      )}
    </div>
  );
}

function Complete({ ex, record, setWide }: { ex: Of<'complete'>; record: (ok: boolean) => void; setWide: (w: boolean) => void }) {
  const { t } = useI18n();
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div>
      <Markdown className="prose-sm">{t(ex.prompt)}</Markdown>
      <CodeWithTrace
        exId={ex.id}
        code={ex.code}
        shownCode={picked !== null ? ex.code.replace('____', ex.options[ex.answer]) : ex.code}
        lang={ex.lang}
        walkthrough={ex.walkthrough}
        available={picked !== null}
        unlocked={picked !== null}
        setWide={setWide}
      />
      <div className="grid gap-2">
        {ex.options.map((o, i) => {
          const right = picked !== null && i === ex.answer;
          const wrong = picked === i && i !== ex.answer;
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => {
                setPicked(i);
                record(i === ex.answer);
              }}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left font-mono text-sm transition ${
                right
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : wrong
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                    : 'border-zinc-200 bg-white hover:border-brand-300 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900'
              }`}
            >
              {right && <Check size={15} className="shrink-0 text-emerald-600" />}
              {wrong && <X size={15} className="shrink-0 text-rose-600" />}
              <span className="whitespace-pre-wrap">{o}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <Result ok={picked === ex.answer}>
          <Markdown className="prose-sm">{t(ex.explanation)}</Markdown>
        </Result>
      )}
    </div>
  );
}

function Recall({ ex, record }: { ex: Of<'recall'>; record: (ok: boolean) => void }) {
  const { t, tr } = useI18n();
  const [text, setText] = useState('');
  const [shown, setShown] = useState(false);
  const [self, setSelf] = useState<boolean | null>(null);
  return (
    <div>
      <div className="font-semibold">
        <Markdown className="prose-sm">{t(ex.q)}</Markdown>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={shown}
        rows={2}
        className="input mt-2 resize-y"
        placeholder={tr('Respóndelo con tus palabras…', 'Answer in your own words…')}
      />
      {!shown ? (
        <button onClick={() => setShown(true)} className="btn-primary mt-2 py-1.5">
          <Eye size={15} /> {tr('Ver respuesta', 'Show answer')}
        </button>
      ) : self === null ? (
        <div className="mt-3 space-y-2">
          <div className="rounded-xl border border-emerald-200 bg-white p-3 text-sm dark:border-emerald-500/20 dark:bg-zinc-900">
            <Markdown className="prose-sm">{t(ex.a)}</Markdown>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm">{tr('¿La tenías bien?', 'Did you get it right?')}</span>
            <button
              onClick={() => {
                setSelf(true);
                record(true);
              }}
              className="btn border border-emerald-300 py-1 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300"
            >
              <Check size={14} /> {tr('Sí', 'Yes')}
            </button>
            <button
              onClick={() => {
                setSelf(false);
                record(false);
              }}
              className="btn border border-rose-300 py-1 text-rose-700 dark:border-rose-500/40 dark:text-rose-300"
            >
              <X size={14} /> {tr('No', 'No')}
            </button>
          </div>
        </div>
      ) : (
        <Result ok={self}>
          <Markdown className="prose-sm">{t(ex.a)}</Markdown>
        </Result>
      )}
    </div>
  );
}

function Order({ ex, record }: { ex: Of<'order'>; record: (ok: boolean) => void }) {
  const { t, tr } = useI18n();
  const initial = useMemo(() => shuffledOrder(ex.id, ex.steps.length), [ex.id, ex.steps.length]);
  const [order, setOrder] = useState(initial);
  const [checked, setChecked] = useState(false);
  const ok = order.every((v, i) => v === i);
  const move = (i: number, d: -1 | 1) =>
    setOrder((o) => {
      const n = [...o];
      [n[i], n[i + d]] = [n[i + d], n[i]];
      return n;
    });
  return (
    <div>
      <Markdown className="prose-sm">{t(ex.prompt)}</Markdown>
      <ol className="mt-2 space-y-1.5">
        {order.map((stepIdx, i) => {
          const good = checked && stepIdx === i;
          const bad = checked && stepIdx !== i;
          return (
            <li
              key={stepIdx}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                good ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : bad ? 'border-rose-400 bg-rose-50 dark:bg-rose-500/10' : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'
              }`}
            >
              <span className="w-5 text-center font-mono text-xs text-zinc-400">{i + 1}</span>
              <span className="flex-1">
                <Markdown className="prose-sm">{t(ex.steps[stepIdx])}</Markdown>
              </span>
              {!checked && (
                <span className="flex shrink-0 flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-0.5 hover:bg-zinc-100 disabled:opacity-25 dark:hover:bg-zinc-800" aria-label={tr('Subir', 'Move up')}>
                    <ArrowUp size={15} />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="rounded p-0.5 hover:bg-zinc-100 disabled:opacity-25 dark:hover:bg-zinc-800" aria-label={tr('Bajar', 'Move down')}>
                    <ArrowDown size={15} />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!checked ? (
        <button
          onClick={() => {
            setChecked(true);
            record(ok);
          }}
          className="btn-primary mt-2 py-1.5"
        >
          <Check size={15} /> {tr('Comprobar orden', 'Check order')}
        </button>
      ) : (
        <Result ok={ok}>
          {!ok && (
            <ol className="mb-2 list-decimal space-y-0.5 pl-5">
              {ex.steps.map((s, i) => (
                <li key={i}>
                  <Markdown className="prose-sm">{t(s)}</Markdown>
                </li>
              ))}
            </ol>
          )}
          <Markdown className="prose-sm">{t(ex.explanation)}</Markdown>
        </Result>
      )}
    </div>
  );
}
