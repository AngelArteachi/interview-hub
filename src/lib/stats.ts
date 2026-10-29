import type { AppData, ItemType, ReviewItem } from '../types';
import { addDays, mastery, todayStr, weakness } from './srs';
import { allItems } from './items';

/** Un día cuenta para la racha si hubo ≥10 repasos o se completó una lección o un mock */
export function activeDay(data: AppData, day: string): boolean {
  const a = data.activity[day];
  const mock = data.mocks.some((m) => m.date.startsWith(day));
  return !!a && (a.reviews >= 10 || a.lessons > 0) || mock;
}

export function streak(data: AppData, today = todayStr()): { current: number; best: number; todayDone: boolean } {
  const todayDone = activeDay(data, today);
  let current = 0;
  let d = todayDone ? today : addDays(today, -1);
  while (activeDay(data, d)) {
    current++;
    d = addDays(d, -1);
  }
  const days = Object.keys(data.activity).sort();
  let best = 0;
  let run = 0;
  let prev = '';
  for (const day of days) {
    if (!activeDay(data, day)) {
      run = 0;
    } else {
      run = prev && addDays(prev, 1) === day ? run + 1 : 1;
      prev = day;
    }
    best = Math.max(best, run);
  }
  return { current, best: Math.max(best, current), todayDone };
}

export function masteryByType(data: AppData) {
  const items = allItems(data);
  const res: Partial<Record<ItemType, { total: number; seen: number; mastery: number }>> = {};
  for (const it of items) {
    const r = (res[it.type] ??= { total: 0, seen: 0, mastery: 0 });
    r.total++;
    if (data.srs[it.id]) r.seen++;
    r.mastery += mastery(data.srs[it.id]);
  }
  for (const r of Object.values(res)) r.mastery = r.total ? r.mastery / r.total : 0;
  return res;
}

export function masteryByTag(data: AppData, type: ItemType) {
  const res: Record<string, { total: number; mastery: number }> = {};
  for (const it of allItems(data).filter((i) => i.type === type)) {
    const tag = it.tags[0];
    const r = (res[tag] ??= { total: 0, mastery: 0 });
    r.total++;
    r.mastery += mastery(data.srs[it.id]);
  }
  for (const r of Object.values(res)) r.mastery /= r.total;
  return res;
}

export function weakItems(data: AppData, n = 5): ReviewItem[] {
  return allItems(data)
    .filter((i) => data.srs[i.id])
    .map((i) => ({ i, w: weakness(data.srs[i.id]) }))
    .filter((x) => x.w > 0.6)
    .sort((a, b) => b.w - a.w)
    .slice(0, n)
    .map((x) => x.i);
}

export function forecast(data: AppData, days = 7) {
  const today = todayStr();
  const counts = Array.from({ length: days }, (_, i) => ({ day: addDays(today, i), count: 0 }));
  for (const s of Object.values(data.srs)) {
    const idx = Math.max(0, counts.findIndex((c) => c.day === s.due));
    if (s.due <= today) counts[0].count++;
    else if (idx > 0) counts[idx].count++;
  }
  return counts;
}

export function totalReviews(data: AppData) {
  return Object.values(data.activity).reduce((acc, a) => acc + a.reviews, 0);
}
