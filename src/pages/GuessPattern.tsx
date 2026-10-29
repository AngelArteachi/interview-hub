import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import type { Pattern } from '../types';
import { ALGORITHMS, PATTERNS } from '../data/algorithms';
import { useI18n } from '../i18n/I18nContext';
import { Markdown } from '../components/Markdown';
import { PageHeader, ProgressBar } from '../components/ui';

const ROUND = 10;

function makeRound() {
  return [...ALGORITHMS].sort(() => Math.random() - 0.5).slice(0, ROUND);
}

/** Modo "Adivina el patrón": solo enunciado, eliges la técnica */
export default function GuessPattern() {
  const { t, tr } = useI18n();
  const [round, setRound] = useState(makeRound);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Pattern | null>(null);
  const [score, setScore] = useState(0);
  const algo = round[i];

  const options = useMemo(() => {
    if (!algo) return [];
    const others = (Object.keys(PATTERNS) as Pattern[]).filter((p) => p !== algo.pattern).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...others, algo.pattern].sort(() => Math.random() - 0.5);
  }, [algo]);

  const choose = (p: Pattern) => {
    if (picked) return;
    setPicked(p);
    if (p === algo.pattern) setScore((s) => s + 1);
  };

  const restart = () => {
    setRound(makeRound());
    setI(0);
    setScore(0);
    setPicked(null);
  };

  if (!algo)
    return (
      <div className="mx-auto max-w-xl">
        <div className="card p-10 text-center">
          <div className="text-5xl font-extrabold text-brand-600">
            {score}/{ROUND}
          </div>
          <p className="mt-2 text-zinc-500">
            {score >= 8 ? tr('¡Excelente reconocimiento de patrones!', 'Excellent pattern recognition!') : tr('Sigue practicando: reconocer el patrón es la mitad del problema.', 'Keep practicing: recognizing the pattern is half the problem.')}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button onClick={restart} className="btn-primary">
              <RotateCcw size={16} /> {tr('Otra ronda', 'Another round')}
            </button>
            <Link to="/practice/algorithms" className="btn-secondary">
              {tr('Ver algoritmos', 'See algorithms')}
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader back="/practice" title={tr('Adivina el patrón', 'Guess the pattern')} subtitle={tr('Lee el problema y elige la técnica que usarías.', 'Read the problem and pick the technique you would use.')} />
      <div className="mb-4 flex items-center gap-3 text-sm text-zinc-500">
        <span className="font-mono">
          {i + 1}/{ROUND}
        </span>
        <ProgressBar value={i / ROUND} className="flex-1" />
        <span className="font-semibold text-emerald-600">✓ {score}</span>
      </div>
      <div className="card p-6">
        <h2 className="mb-2 text-lg font-bold">{t(algo.title)}</h2>
        <Markdown>{t(algo.statement)}</Markdown>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {options.map((p) => {
            const correct = picked && p === algo.pattern;
            const wrong = picked === p && p !== algo.pattern;
            return (
              <button
                key={p}
                onClick={() => choose(p)}
                className={`btn justify-start border px-4 py-3 text-left ${
                  correct
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : wrong
                      ? 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300'
                      : 'border-zinc-300 hover:border-brand-400 dark:border-zinc-700'
                }`}
              >
                {correct && <Check size={16} />}
                {wrong && <X size={16} />}
                {t(PATTERNS[p].name)}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
              <b>{t(PATTERNS[algo.pattern].name)}:</b> {t(algo.hints[algo.hints.length - 1])}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setI(i + 1);
                  setPicked(null);
                }}
                className="btn-primary"
              >
                {tr('Siguiente', 'Next')} <ArrowRight size={16} />
              </button>
              <Link to={`/practice/algorithms/${algo.id}`} className="btn-secondary">
                {tr('Ver problema completo', 'Open full problem')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
