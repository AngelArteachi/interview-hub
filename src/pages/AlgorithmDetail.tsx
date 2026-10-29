import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, Eye, Lightbulb } from 'lucide-react';
import type { AIEvaluation } from '../types';
import { ALGORITHMS, PATTERNS, algorithmById } from '../data/algorithms';
import { LESSONS } from '../content/lessons';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { Markdown } from '../components/Markdown';
import { CodeBlock } from '../components/CodeBlock';
import { RatingButtons } from '../components/RatingButtons';
import { AIEvaluateButton, AIFeedbackView } from '../components/AIFeedback';
import { DifficultyBadge, PageHeader } from '../components/ui';

export default function AlgorithmDetail() {
  const { id = '' } = useParams();
  return <AlgorithmView key={id} id={id} />;
}

function AlgorithmView({ id }: { id: string }) {
  const algo = algorithmById(id);
  const { data, rate, setNote } = useStore();
  const { t, tr } = useI18n();
  const [hints, setHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [ai, setAi] = useState<AIEvaluation | null>(null);
  const [rated, setRated] = useState(false);

  if (!algo) return <Navigate to="/practice/algorithms" replace />;

  const itemId = `alg:${algo.id}`;
  const note = data.notes[itemId] ?? '';
  const idx = ALGORITHMS.indexOf(algo);
  const prev = ALGORITHMS[idx - 1];
  const next = ALGORITHMS[idx + 1];
  const lesson = LESSONS.find((l) => l.related?.includes(algo.id));
  const question = `${t(algo.title)}\n\n${t(algo.statement)}${algo.example ? `\n\nExample: ${algo.example}` : ''}`;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader back="/practice/algorithms" title={t(algo.title)} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <DifficultyBadge d={algo.difficulty} />
        <span className="chip bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{t(PATTERNS[algo.pattern].name)}</span>
        {algo.leetcode && (
          <a href={algo.leetcode} target="_blank" rel="noreferrer" className="chip bg-amber-100 text-amber-800 hover:underline dark:bg-amber-500/15 dark:text-amber-300">
            LeetCode <ExternalLink size={11} />
          </a>
        )}
        {lesson && (
          <Link to={`/learn/${lesson.id}`} className="chip bg-violet-100 text-violet-700 hover:underline dark:bg-violet-500/15 dark:text-violet-300">
            📖 {t(lesson.title)}
          </Link>
        )}
      </div>

      <div className="card p-5">
        <Markdown>{t(algo.statement)}</Markdown>
        {algo.example && <pre className="mt-3 overflow-x-auto rounded-xl bg-zinc-100 p-3 font-mono text-sm dark:bg-zinc-800">{algo.example}</pre>}
      </div>

      <div className="card mt-4 p-5">
        <label className="label">{tr('Tu enfoque (se guarda automáticamente)', 'Your approach (auto-saved)')}</label>
        <textarea
          value={note}
          onChange={(e) => setNote(itemId, e.target.value)}
          rows={5}
          className="input resize-y font-mono"
          placeholder={tr(
            '1. Idea principal y estructura de datos\n2. Pasos\n3. Complejidad: tiempo O(?), espacio O(?)\n4. Casos borde',
            '1. Main idea and data structure\n2. Steps\n3. Complexity: time O(?), space O(?)\n4. Edge cases',
          )}
        />
        <p className="mt-2 text-xs text-zinc-500">
          {tr('Tip: explica en voz alta como si estuvieras con el entrevistador. Luego codifícalo en LeetCode.', 'Tip: explain out loud as if you were with the interviewer. Then code it on LeetCode.')}
        </p>
      </div>

      <div className="card mt-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-bold">
            <Lightbulb size={18} className="text-amber-500" /> {tr('Pistas', 'Hints')} ({hints}/{algo.hints.length})
          </h3>
          {hints < algo.hints.length && (
            <button onClick={() => setHints((h) => h + 1)} className="btn-secondary py-1.5">
              {tr('Revelar pista', 'Reveal hint')}
            </button>
          )}
        </div>
        {hints > 0 && (
          <ol className="mt-3 space-y-2">
            {algo.hints.slice(0, hints).map((h, i) => (
              <li key={i} className="rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-500/10">
                <b>{i + 1}.</b> <Markdown className="prose-sm inline-block">{t(h)}</Markdown>
              </li>
            ))}
          </ol>
        )}
      </div>

      {!showSolution ? (
        <button onClick={() => setShowSolution(true)} className="btn-primary mt-4">
          <Eye size={16} /> {tr('Ver solución', 'Show solution')}
        </button>
      ) : (
        <div className="card mt-4 space-y-4 p-5">
          <h3 className="font-bold">{tr('Solución', 'Solution')}</h3>
          <Markdown>{t(algo.solution)}</Markdown>
          <CodeBlock code={algo.code} lang="python" />
          <div className="flex gap-3 text-sm">
            <span className="chip bg-zinc-100 px-3 py-1 font-mono dark:bg-zinc-800">⏱ {algo.time}</span>
            <span className="chip bg-zinc-100 px-3 py-1 font-mono dark:bg-zinc-800">💾 {algo.space}</span>
          </div>
          {!ai && <AIEvaluateButton type="algorithm" question={question} referenceAnswer={`${t(algo.solution)}\nTime ${algo.time}, space ${algo.space}`} userAnswer={note} onResult={setAi} />}
          {ai && <AIFeedbackView ev={ai} />}
          {rated ? (
            <div className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              ✓ {tr('Guardado en tu repaso espaciado', 'Saved to your spaced repetition')}
            </div>
          ) : (
            <div>
              <div className="label">{tr('¿Qué tan bien lo resolviste?', 'How well did you solve it?')}</div>
              <RatingButtons
                state={data.srs[itemId]}
                suggested={ai?.suggestedRating}
                onRate={(r) => {
                  rate(itemId, r);
                  setRated(true);
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {prev ? (
          <Link to={`/practice/algorithms/${prev.id}`} className="btn-ghost">
            <ChevronLeft size={16} /> {t(prev.title)}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/practice/algorithms/${next.id}`} className="btn-ghost">
            {t(next.title)} <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
