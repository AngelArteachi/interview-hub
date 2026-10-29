import { useState } from 'react';
import { PenSquare, Pencil, Play, Plus, Trash2 } from 'lucide-react';
import type { CustomCard, ItemType } from '../types';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { uid } from '../lib/storage';
import { todayStr } from '../lib/srs';
import { TYPE_LABEL, allItems } from '../lib/items';
import { Markdown } from '../components/Markdown';
import { ReviewSession } from '../components/ReviewSession';
import { Empty, PageHeader } from '../components/ui';

const TYPES: ItemType[] = ['concept', 'algorithm', 'design', 'behavioral'];
const blank = (): CustomCard => ({ id: uid(), type: 'concept', front: '', back: '', tags: [], created: todayStr() });

export default function CustomCards() {
  const { data, saveCustom, deleteCustom } = useStore();
  const { t, tr } = useI18n();
  const [form, setForm] = useState<CustomCard | null>(null);
  const [tags, setTags] = useState('');
  const [session, setSession] = useState(false);

  if (session)
    return (
      <div className="mx-auto max-w-3xl">
        <ReviewSession items={allItems(data).filter((i) => i.type === 'custom')} onExit={() => setSession(false)} />
      </div>
    );

  const edit = (c: CustomCard) => {
    setForm(c);
    setTags(c.tags.join(', '));
  };

  return (
    <div>
      <PageHeader
        back="/practice"
        title={tr('Mis preguntas', 'My questions')}
        subtitle={tr('Agrega preguntas de entrevistas reales o temas que quieras reforzar. Entran a tu repaso diario.', 'Add questions from real interviews or topics you want to reinforce. They join your daily review.')}
        actions={
          <>
            {!!data.custom.length && (
              <button onClick={() => setSession(true)} className="btn-secondary">
                <Play size={16} /> {tr('Repasar todas', 'Review all')}
              </button>
            )}
            <button onClick={() => edit(blank())} className="btn-primary">
              <Plus size={16} /> {tr('Nueva tarjeta', 'New card')}
            </button>
          </>
        }
      />

      {form && (
        <div className="card mb-6 space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">{tr('Tipo', 'Type')}</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ItemType })}>
                {TYPES.map((ty) => (
                  <option key={ty} value={ty}>
                    {t(TYPE_LABEL[ty])}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">{tr('Etiquetas (separadas por coma)', 'Tags (comma separated)')}</label>
              <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="google, sql, react" />
            </div>
          </div>
          <div>
            <label className="label">{tr('Pregunta (frente) · admite Markdown', 'Question (front) · Markdown supported')}</label>
            <textarea className="input" rows={3} value={form.front} onChange={(e) => setForm({ ...form, front: e.target.value })} />
          </div>
          <div>
            <label className="label">{tr('Respuesta (reverso)', 'Answer (back)')}</label>
            <textarea className="input" rows={5} value={form.back} onChange={(e) => setForm({ ...form, back: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button
              disabled={!form.front.trim() || !form.back.trim()}
              onClick={() => {
                saveCustom({ ...form, tags: tags.split(',').map((x) => x.trim()).filter(Boolean) });
                setForm(null);
              }}
              className="btn-primary"
            >
              {tr('Guardar', 'Save')}
            </button>
            <button onClick={() => setForm(null)} className="btn-ghost">
              {tr('Cancelar', 'Cancel')}
            </button>
          </div>
        </div>
      )}

      {!data.custom.length && !form && (
        <Empty icon={<PenSquare />} title={tr('Sin tarjetas propias todavía', 'No custom cards yet')}>
          {tr('Después de cada entrevista real, anota las preguntas que te hicieron aquí.', 'After every real interview, write down the questions you were asked here.')}
        </Empty>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {data.custom.map((c) => {
          const s = data.srs[`cus:${c.id}`];
          return (
            <div key={c.id} className="card p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="chip bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300">{t(TYPE_LABEL[c.type])}</span>
                {c.tags.map((tg) => (
                  <span key={tg} className="chip bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {tg}
                  </span>
                ))}
                <div className="ml-auto flex">
                  <button onClick={() => edit(c)} className="btn-ghost p-1.5" aria-label="edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => confirm(tr('¿Borrar tarjeta?', 'Delete card?')) && deleteCustom(c.id)} className="btn-ghost p-1.5 text-rose-500" aria-label="delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <Markdown className="prose-sm font-semibold">{c.front}</Markdown>
              <div className="mt-2 text-xs text-zinc-500">
                {s ? tr(`Próximo repaso: ${s.due}`, `Next review: ${s.due}`) : tr('Nueva: aparecerá en tu cola diaria', 'New: will appear in your daily queue')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
