import type { AppData, SrsState } from '../types';
import { supabase } from './supabase';

/** El estado más reciente gana; si empatan, el que tiene más historial */
function newerSrs(a: SrsState, b: SrsState): SrsState {
  if (a.last !== b.last) return a.last > b.last ? a : b;
  return a.history.length >= b.history.length ? a : b;
}

function unionById<T extends { id: string }>(primary: T[], secondary: T[]): T[] {
  const ids = new Set(primary.map((x) => x.id));
  return [...primary, ...secondary.filter((x) => !ids.has(x.id))];
}

/**
 * Combina el progreso de dos dispositivos sin perder nada:
 * repaso por tarjeta (gana el más reciente), listas por id, actividad por día (máximo).
 */
export function mergeData(local: AppData, remote: AppData): AppData {
  const srs = { ...remote.srs };
  for (const [id, s] of Object.entries(local.srs)) srs[id] = srs[id] ? newerSrs(s, srs[id]) : s;

  const lessons = { ...remote.lessons };
  for (const [id, l] of Object.entries(local.lessons)) {
    const r = lessons[id];
    lessons[id] = r ? { completed: l.completed < r.completed ? l.completed : r.completed, quizScore: Math.max(l.quizScore, r.quizScore) } : l;
  }

  const activity = { ...remote.activity };
  for (const [day, a] of Object.entries(local.activity)) {
    const r = activity[day];
    activity[day] = r ? { reviews: Math.max(a.reviews, r.reviews), newCards: Math.max(a.newCards, r.newCards), lessons: Math.max(a.lessons, r.lessons) } : a;
  }

  return {
    version: 1,
    srs,
    lessons,
    activity,
    custom: unionById(local.custom, remote.custom),
    stories: unionById(local.stories, remote.stories),
    mocks: unionById(local.mocks, remote.mocks).sort((a, b) => b.date.localeCompare(a.date)),
    notes: { ...remote.notes, ...Object.fromEntries(Object.entries(local.notes).filter(([, v]) => v)) },
    settings: { ...remote.settings, ...local.settings },
  };
}

export async function fetchRemote(userId: string): Promise<{ data: AppData; updatedAt: string } | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('user_data').select('data, updated_at').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data ? { data: data.data as AppData, updatedAt: data.updated_at as string } : null;
}

export async function pushRemote(userId: string, data: AppData): Promise<string> {
  if (!supabase) throw new Error('Supabase no configurado');
  const updatedAt = new Date().toISOString();
  const { error } = await supabase.from('user_data').upsert({ user_id: userId, data, updated_at: updatedAt });
  if (error) throw error;
  return updatedAt;
}
