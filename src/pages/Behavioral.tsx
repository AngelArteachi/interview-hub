import { useState } from 'react';
import { BookMarked, Pencil, Play, Plus, Trash2 } from 'lucide-react';
import type { Story, StoryTag } from '../types';
import { BEHAVIORAL, STAR_GUIDE, STORY_TAGS } from '../data/behavioral';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { uid } from '../lib/storage';
import { allItems } from '../lib/items';
import { Markdown } from '../components/Markdown';
import { ReviewSession } from '../components/ReviewSession';
import { Empty, PageHeader } from '../components/ui';

const blank = (): Story => ({ id: uid(), title: '', tags: [], situation: '', task: '', action: '', result: '' });

function StoryEditor({ story, onSave, onCancel }: { story: Story; onSave: (s: Story) => void; onCancel: () => void }) {
  const { t, tr } = useI18n();
  const [s, setS] = useState(story);
  return (
    <div className="card space-y-4 p-5">
      <div>
        <label className="label">{tr('Título de la historia', 'Story title')}</label>
        <input className="input" value={s.title} onChange={(e) => setS({ ...s, title: e.target.value })} placeholder={tr('Ej.: El bug de pagos en producción', 'E.g.: The payments bug in production')} />
      </div>
      <div>
        <label className="label">{tr('Sirve para…', 'Good for…')}</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STORY_TAGS) as StoryTag[]).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setS({ ...s, tags: s.tags.includes(tag) ? s.tags.filter((x) => x !== tag) : [...s.tags, tag] })}
              className={`chip border px-3 py-1 text-sm ${s.tags.includes(tag) ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300' : 'border-zinc-300 dark:border-zinc-700'}`}
            >
              {t(STORY_TAGS[tag])}
            </button>
          ))}
        </div>
      </div>
      {STAR_GUIDE.map((g) => (
        <div key={g.key}>
          <label className="label">
            {g.key[0].toUpperCase()} · {t(g.title)}
          </label>
          <div className="mb-1 text-xs text-zinc-500">
            <Markdown className="prose-sm text-xs">{t(g.help)}</Markdown>
          </div>
          <textarea className="input" rows={g.key === 'action' ? 4 : 2} value={s[g.key]} onChange={(e) => setS({ ...s, [g.key]: e.target.value })} />
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={() => onSave(s)} disabled={!s.title.trim()} className="btn-primary">
          {tr('Guardar', 'Save')}
        </button>
        <button onClick={onCancel} className="btn-ghost">
          {tr('Cancelar', 'Cancel')}
        </button>
      </div>
    </div>
  );
}

export default function Behavioral() {
  const { data, saveStory, deleteStory } = useStore();
  const { t, tr } = useI18n();
  const [editing, setEditing] = useState<Story | null>(null);
  const [tab, setTab] = useState<'stories' | 'questions'>('stories');
  const [session, setSession] = useState(false);

  if (session)
    return (
      <div className="mx-auto max-w-3xl">
        <ReviewSession items={allItems(data).filter((i) => i.type === 'behavioral').sort(() => Math.random() - 0.5).slice(0, 8)} onExit={() => setSession(false)} />
      </div>
    );

  return (
    <div>
      <PageHeader
        back="/practice"
        title={tr('Entrevista conductual', 'Behavioral interview')}
        subtitle={tr('Prepara 5–8 historias STAR reutilizables. Cubren casi cualquier pregunta.', 'Prepare 5–8 reusable STAR stories. They cover almost any question.')}
        actions={
          <button onClick={() => setSession(true)} className="btn-primary">
            <Play size={16} /> {tr('Practicar 8 preguntas', 'Practice 8 questions')}
          </button>
        }
      />
      <div className="mb-5 flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900 sm:w-fit">
        {(['stories', 'questions'] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-lg px-4 py-1.5 text-sm font-semibold ${tab === k ? 'bg-white shadow dark:bg-zinc-800' : 'text-zinc-500'}`}>
            {k === 'stories' ? tr(`Mis historias (${data.stories.length})`, `My stories (${data.stories.length})`) : tr(`Preguntas (${BEHAVIORAL.length})`, `Questions (${BEHAVIORAL.length})`)}
          </button>
        ))}
      </div>

      {tab === 'stories' &&
        (editing ? (
          <StoryEditor
            story={editing}
            onCancel={() => setEditing(null)}
            onSave={(s) => {
              saveStory(s);
              setEditing(null);
            }}
          />
        ) : (
          <div className="space-y-4">
            <button onClick={() => setEditing(blank())} className="btn-secondary">
              <Plus size={16} /> {tr('Nueva historia', 'New story')}
            </button>
            {!data.stories.length && (
              <Empty icon={<BookMarked />} title={tr('Aún no tienes historias', 'No stories yet')}>
                {tr(
                  'Piensa en proyectos, prácticas, trabajos en equipo de la escuela o voluntariados. Una buena historia puede responder varias preguntas.',
                  'Think about projects, internships, school team work or volunteering. One good story can answer several questions.',
                )}
              </Empty>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {data.stories.map((s) => (
                <div key={s.id} className="card p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold">{s.title}</h3>
                    <div className="flex">
                      <button onClick={() => setEditing(s)} className="btn-ghost p-1.5" aria-label="edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => confirm(tr('¿Borrar historia?', 'Delete story?')) && deleteStory(s.id)} className="btn-ghost p-1.5 text-rose-500" aria-label="delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.tags.map((tag) => (
                      <span key={tag} className="chip bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                        {t(STORY_TAGS[tag])}
                      </span>
                    ))}
                  </div>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    {STAR_GUIDE.map((g) =>
                      s[g.key] ? (
                        <div key={g.key}>
                          <dt className="inline font-bold text-brand-600 dark:text-brand-300">{g.key[0].toUpperCase()}: </dt>
                          <dd className="inline text-zinc-600 dark:text-zinc-300">{s[g.key]}</dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        ))}

      {tab === 'questions' && (
        <div className="space-y-3">
          {BEHAVIORAL.map((b) => {
            const matching = data.stories.filter((s) => s.tags.some((tag) => b.tags.includes(tag)));
            return (
              <details key={b.id} className="card group p-4">
                <summary className="cursor-pointer list-none font-semibold">
                  <span className="mr-2 text-zinc-400 transition group-open:rotate-90">›</span>
                  {t(b.q)}
                </summary>
                <div className="mt-3 space-y-2 pl-4 text-sm">
                  <Markdown className="prose-sm">{`💡 ${t(b.tip)}`}</Markdown>
                  <div className="text-zinc-500">
                    {tr('Historias sugeridas: ', 'Suggested stories: ')}
                    {matching.length ? matching.map((s) => s.title).join(', ') : <i>{tr('ninguna con estas etiquetas', 'none with these tags')}</i>}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
