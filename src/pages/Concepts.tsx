import { useMemo, useState } from 'react';
import { Play, RotateCw } from 'lucide-react';
import type { ConceptTopic } from '../types';
import { CONCEPTS, CONCEPT_TOPICS } from '../data/fundamentals';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { allItems } from '../lib/items';
import { mastery } from '../lib/srs';
import { Markdown } from '../components/Markdown';
import { ReviewSession } from '../components/ReviewSession';
import { PageHeader, ProgressBar } from '../components/ui';

function FlipCard({ q, a, m }: { q: string; a: string; m: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button onClick={() => setFlipped(!flipped)} className="flip h-56 w-full text-left" aria-label="flip">
      <div className={`flip-inner relative h-full w-full ${flipped ? 'flipped' : ''}`}>
        <div className="flip-face card absolute inset-0 flex flex-col p-5">
          <div className="flex-1 overflow-hidden font-semibold">
            <Markdown className="prose-sm">{q}</Markdown>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <RotateCw size={12} /> <ProgressBar value={m} className="flex-1" />
          </div>
        </div>
        <div className="flip-face flip-back card absolute inset-0 overflow-y-auto border-brand-300 bg-brand-50 p-5 dark:border-brand-500/40 dark:bg-zinc-900">
          <Markdown className="prose-sm">{a}</Markdown>
        </div>
      </div>
    </button>
  );
}

export default function Concepts() {
  const { data } = useStore();
  const { t, tr } = useI18n();
  const [topic, setTopic] = useState<ConceptTopic | 'all'>('all');
  const [session, setSession] = useState(false);
  const list = CONCEPTS.filter((c) => topic === 'all' || c.topic === topic);
  const sessionItems = useMemo(() => {
    const ids = new Set(list.map((c) => `con:${c.id}`));
    return allItems(data)
      .filter((i) => ids.has(i.id))
      .sort(() => Math.random() - 0.5);
  }, [topic, session]);

  if (session)
    return (
      <div className="mx-auto max-w-3xl">
        <ReviewSession items={sessionItems} onExit={() => setSession(false)} />
      </div>
    );

  return (
    <div>
      <PageHeader
        back="/practice"
        title={tr('Fundamentos', 'Fundamentals')}
        subtitle={tr('Toca una tarjeta para voltearla. Inicia una sesión para calificarte.', 'Tap a card to flip it. Start a session to rate yourself.')}
        actions={
          <button onClick={() => setSession(true)} className="btn-primary">
            <Play size={16} /> {tr(`Repasar ${list.length}`, `Review ${list.length}`)}
          </button>
        }
      />
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {(['all', ...Object.keys(CONCEPT_TOPICS)] as (ConceptTopic | 'all')[]).map((tp) => (
          <button
            key={tp}
            onClick={() => setTopic(tp)}
            className={`chip shrink-0 border px-3 py-1.5 text-sm ${topic === tp ? 'border-brand-500 bg-brand-600 text-white' : 'border-zinc-300 dark:border-zinc-700'}`}
          >
            {tp === 'all' ? tr('Todos', 'All') : t(CONCEPT_TOPICS[tp])}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <FlipCard key={c.id} q={t(c.q)} a={t(c.a)} m={mastery(data.srs[`con:${c.id}`])} />
        ))}
      </div>
    </div>
  );
}
