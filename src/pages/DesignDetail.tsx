import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { AIEvaluation } from '../types';
import { DESIGN_CASES, DESIGN_FRAMEWORK } from '../data/systemDesign';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { Markdown } from '../components/Markdown';
import { RatingButtons } from '../components/RatingButtons';
import { AIEvaluateButton, AIFeedbackView } from '../components/AIFeedback';
import { PageHeader } from '../components/ui';

export default function DesignDetail() {
  const { id = '' } = useParams();
  return <DesignCaseView key={id} id={id} />;
}

function DesignCaseView({ id }: { id: string }) {
  const d = DESIGN_CASES.find((x) => x.id === id);
  const { data, rate, setNote } = useStore();
  const { t, tr } = useI18n();
  const [reveal, setReveal] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [ai, setAi] = useState<AIEvaluation | null>(null);
  const [rated, setRated] = useState(false);
  if (!d) return <Navigate to="/practice/design" replace />;

  const itemId = `des:${d.id}`;
  const note = data.notes[itemId] ?? '';
  const reference = d.steps.map((s) => `${t(s.title)}: ${s.points.map((p) => t(p)).join(' ')}`).join('\n');

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader back="/practice/design" title={t(d.title)} />
      <div className="card p-5">
        <Markdown>{t(d.prompt)}</Markdown>
      </div>

      <div className="card mt-4 p-5">
        <label className="label">{tr('Tu diseño (se guarda automáticamente)', 'Your design (auto-saved)')}</label>
        <textarea
          rows={10}
          value={note}
          onChange={(e) => setNote(itemId, e.target.value)}
          className="input resize-y font-mono"
          placeholder={DESIGN_FRAMEWORK.map((s) => `${t(s.title)}:\n`).join('\n')}
        />
        <p className="mt-2 text-xs text-zinc-500">{tr('Dedica unos 20–30 minutos, como en una entrevista real.', 'Spend about 20–30 minutes, like in a real interview.')}</p>
      </div>

      {!reveal ? (
        <button onClick={() => setReveal(true)} className="btn-primary mt-4">
          <Eye size={16} /> {tr('Ver puntos clave', 'Show key points')}
        </button>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="card p-5">
            <h3 className="mb-3 font-bold">{tr('Puntos clave de una buena respuesta', 'Key points of a good answer')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {d.steps.map((s) => (
                <div key={s.title.es} className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                  <div className="mb-2 font-semibold text-brand-600 dark:text-brand-300">{t(s.title)}</div>
                  <ul className="space-y-1.5 text-sm">
                    {s.points.map((p, i) => (
                      <li key={i}>
                        <Markdown className="prose-sm">{`• ${t(p)}`}</Markdown>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="mb-3 font-bold">{tr('Autoevaluación', 'Self-check')}</h3>
            <div className="space-y-2">
              {d.checklist.map((c, i) => (
                <label key={i} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand-600"
                    checked={checked.has(i)}
                    onChange={() =>
                      setChecked((s) => {
                        const n = new Set(s);
                        if (n.has(i)) n.delete(i);
                        else n.add(i);
                        return n;
                      })
                    }
                  />
                  {t(c)}
                </label>
              ))}
            </div>
            <div className="mt-4">
              {!ai && <AIEvaluateButton type="design" question={t(d.prompt)} referenceAnswer={reference} userAnswer={note} onResult={setAi} />}
              {ai && <AIFeedbackView ev={ai} />}
            </div>
            <div className="mt-4">
              {rated ? (
                <div className="text-sm font-semibold text-emerald-600">✓ {tr('Guardado en tu repaso', 'Saved to your reviews')}</div>
              ) : (
                <RatingButtons
                  state={data.srs[itemId]}
                  suggested={ai?.suggestedRating}
                  onRate={(r) => {
                    rate(itemId, r);
                    setRated(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
