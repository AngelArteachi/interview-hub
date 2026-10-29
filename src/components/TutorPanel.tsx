import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, Sparkles, X } from 'lucide-react';
import type { Lesson } from '../types';
import { aiUnavailableMessage, askTutor, useAIStatus } from '../lib/ai';
import { useI18n } from '../i18n/I18nContext';
import { Markdown } from './Markdown';

type Msg = { role: 'user' | 'assistant'; content: string };

export function lessonPlainText(lesson: Lesson, lang: 'es' | 'en') {
  return lesson.blocks
    .map((b) => (b.kind === 'md' || b.kind === 'callout' ? b.md[lang] : b.kind === 'code' ? '```\n' + b.code + '\n```' : ''))
    .join('\n\n');
}

/** Panel lateral "Pregúntale a Claude" con el contexto de la lección */
export function TutorPanel({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const { t, tr, lang } = useI18n();
  const status = useAIStatus();
  const enabled = status === null ? null : status.enabled;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => () => abortRef.current?.abort(), []);

  const quick = [
    tr('Explícamelo más simple', 'Explain it more simply'),
    tr('Dame otro ejemplo', 'Give me another example'),
    tr('Hazme una pregunta de entrevista sobre esto', 'Ask me an interview question about this'),
  ];

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    abortRef.current = new AbortController();
    try {
      await askTutor(
        { lessonTitle: t(lesson.title), lessonContent: lessonPlainText(lesson, lang), messages: next, lang },
        (chunk) =>
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: 'assistant', content: copy[copy.length - 1].content + chunk };
            return copy;
          }),
        abortRef.current.signal,
      );
    } catch (e) {
      if ((e as Error).name !== 'AbortError')
        setMessages((m) => [...m.slice(0, -1), { role: 'assistant', content: `⚠️ ${(e as Error).message}` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="fixed inset-0 z-40 flex flex-col bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[420px] sm:border-l sm:border-zinc-200 sm:shadow-2xl dark:bg-zinc-950 dark:sm:border-zinc-800">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <Sparkles size={18} className="text-violet-500" />
        <div className="flex-1">
          <div className="text-sm font-bold">{tr('Pregúntale a Claude', 'Ask Claude')}</div>
          <div className="truncate text-xs text-zinc-500">{t(lesson.title)}</div>
        </div>
        <button onClick={onClose} className="btn-ghost p-1.5" aria-label="close">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {enabled === false && (
          <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            {aiUnavailableMessage(status?.reason ?? null, tr)}
          </div>
        )}
        {!messages.length && enabled !== false && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-zinc-500">
            <Bot size={32} className="text-violet-400" />
            {tr('Pregunta cualquier duda sobre esta lección.', 'Ask anything about this lesson.')}
          </div>
        )}
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="ml-8 rounded-2xl rounded-br-sm bg-brand-600 px-3.5 py-2 text-sm text-white">
              {m.content}
            </div>
          ) : (
            <div key={i} className="mr-4 rounded-2xl rounded-bl-sm bg-zinc-100 px-3.5 py-2 dark:bg-zinc-900">
              {m.content ? <Markdown className="prose-sm">{m.content}</Markdown> : <Loader2 size={16} className="animate-spin text-zinc-400" />}
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {quick.map((q) => (
            <button key={q} disabled={busy || !enabled} onClick={() => send(q)} className="chip border border-violet-200 px-2.5 py-1 text-violet-700 hover:bg-violet-50 disabled:opacity-50 dark:border-violet-500/30 dark:text-violet-300">
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <input value={input} onChange={(e) => setInput(e.target.value)} disabled={!enabled} className="input" placeholder={tr('Escribe tu pregunta…', 'Type your question…')} />
          <button type="submit" disabled={busy || !input.trim() || !enabled} className="btn-primary px-3" aria-label="send">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>
    </aside>
  );
}
