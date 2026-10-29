import { useEffect, useState } from 'react';
import type { AIEvaluation, ItemType, Lang } from '../types';

let statusPromise: Promise<boolean> | null = null;

export function fetchAIStatus(): Promise<boolean> {
  statusPromise ??= fetch('/api/status')
    .then((r) => (r.ok ? r.json() : { enabled: false }))
    .then((d) => Boolean(d.enabled))
    .catch(() => false);
  return statusPromise;
}

export function useAIEnabled() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    fetchAIStatus().then(setEnabled);
  }, []);
  return enabled;
}

export async function evaluateAnswer(params: {
  type: ItemType;
  question: string;
  referenceAnswer?: string;
  userAnswer: string;
  lang: Lang;
}): Promise<AIEvaluation> {
  const r = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error === 'AI_DISABLED' ? 'AI_DISABLED' : data.error || `Error ${r.status}`);
  return data as AIEvaluation;
}

export async function askTutor(
  params: { lessonTitle: string; lessonContent: string; messages: { role: 'user' | 'assistant'; content: string }[]; lang: Lang },
  onText: (chunk: string) => void,
  signal?: AbortSignal,
) {
  const r = await fetch('/api/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    signal,
  });
  if (!r.ok || !r.body) {
    const data = await r.json().catch(() => ({}));
    throw new Error(data.error || `Error ${r.status}`);
  }
  const reader = r.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onText(decoder.decode(value, { stream: true }));
  }
}
