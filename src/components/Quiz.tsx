import { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import type { QuizQ } from '../types';
import { useI18n } from '../i18n/I18nContext';

export function Quiz({ questions, onComplete }: { questions: QuizQ[]; onComplete: (scorePct: number) => void }) {
  const { t, tr } = useI18n();
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  const pct = Math.round((correct / questions.length) * 100);

  const submit = () => {
    setSubmitted(true);
    onComplete(pct);
  };

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => (
        <div key={qi}>
          <div className="mb-2 font-semibold">
            {qi + 1}. {t(q.q)}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {q.options.map((o, oi) => {
              const chosen = answers[qi] === oi;
              const isRight = submitted && oi === q.answer;
              const isWrong = submitted && chosen && oi !== q.answer;
              return (
                <button
                  key={oi}
                  disabled={submitted}
                  onClick={() => setAnswers((a) => a.map((x, i) => (i === qi ? oi : x)))}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                    isRight
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                      : isWrong
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                        : chosen
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                          : 'border-zinc-200 hover:border-brand-300 dark:border-zinc-700'
                  }`}
                >
                  {isRight && <Check size={15} className="text-emerald-600" />}
                  {isWrong && <X size={15} className="text-rose-600" />}
                  {t(o)}
                </button>
              );
            })}
          </div>
          {submitted && <p className="mt-2 text-sm text-zinc-500">💡 {t(q.explanation)}</p>}
        </div>
      ))}
      {!submitted ? (
        <button onClick={submit} disabled={answers.some((a) => a === null)} className="btn-primary">
          {tr('Comprobar respuestas', 'Check answers')}
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-lg font-extrabold ${pct >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {correct}/{questions.length} ({pct}%)
          </span>
          <button
            onClick={() => {
              setAnswers(questions.map(() => null));
              setSubmitted(false);
            }}
            className="btn-ghost"
          >
            <RotateCcw size={15} /> {tr('Reintentar', 'Retry')}
          </button>
        </div>
      )}
    </div>
  );
}
