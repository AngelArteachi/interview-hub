import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppData, CustomCard, DayActivity, MockResult, Rating, SrsState, Story } from '../types';
import { useLocalStorage } from '../lib/storage';
import { newState, review, todayStr } from '../lib/srs';
import { fetchRemote, mergeData, pushRemote } from '../lib/sync';
import { useAuth } from './AuthContext';

export type SyncStatus = 'guest' | 'syncing' | 'synced' | 'error';

export const EMPTY_DATA: AppData = {
  version: 1,
  srs: {},
  custom: [],
  stories: [],
  lessons: {},
  mocks: [],
  activity: {},
  notes: {},
  settings: { newPerDay: 10 },
};

interface Store {
  data: AppData;
  syncStatus: SyncStatus;
  rate: (itemId: string, rating: Rating) => void;
  /** Revierte una calificación: restaura el estado anterior de la tarjeta y descuenta la actividad */
  undoRate: (itemId: string, prev: SrsState | undefined) => void;
  completeLesson: (lessonId: string, quizScore: number, conceptIds: string[]) => void;
  /** Mete tarjetas al repaso de hoy (nuevas o adelantando su fecha) */
  enroll: (ids: string[]) => void;
  saveCustom: (c: CustomCard) => void;
  deleteCustom: (id: string) => void;
  saveStory: (s: Story) => void;
  deleteStory: (id: string) => void;
  addMock: (m: MockResult) => void;
  setNote: (id: string, text: string) => void;
  setNewPerDay: (n: number) => void;
  importData: (d: AppData) => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

function bump(activity: AppData['activity'], patch: Partial<DayActivity>) {
  const today = todayStr();
  const cur = activity[today] ?? { reviews: 0, newCards: 0, lessons: 0 };
  return {
    ...activity,
    [today]: {
      reviews: cur.reviews + (patch.reviews ?? 0),
      newCards: cur.newCards + (patch.newCards ?? 0),
      lessons: cur.lessons + (patch.lessons ?? 0),
    },
  };
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [stored, setData] = useLocalStorage<AppData>('ih:data', EMPTY_DATA);
  // Asegura que datos viejos o importados tengan todos los campos
  const data = useMemo(() => ({ ...EMPTY_DATA, ...stored, settings: { ...EMPTY_DATA.settings, ...stored.settings } }), [stored]);

  /* ---------- Sincronización con Supabase ---------- */
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('guest');
  const syncedFor = useRef<string | null>(null); // usuario cuyos datos ya se descargaron
  const lastRemote = useRef('');
  const prevUser = useRef<string | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  // Al iniciar sesión: descargar, combinar con lo local y subir el resultado
  useEffect(() => {
    const uid = user?.id ?? null;
    if (prevUser.current && !uid) {
      // Cerró sesión: no dejar su progreso en este navegador
      setData(EMPTY_DATA);
      syncedFor.current = null;
    }
    prevUser.current = uid;
    if (!uid) {
      setSyncStatus('guest');
      return;
    }
    let cancelled = false;
    setSyncStatus('syncing');
    (async () => {
      try {
        const remote = await fetchRemote(uid);
        if (cancelled) return;
        const merged = remote ? mergeData(dataRef.current, remote.data) : dataRef.current;
        setData(merged);
        lastRemote.current = await pushRemote(uid, merged);
        syncedFor.current = uid;
        if (!cancelled) setSyncStatus('synced');
      } catch {
        if (!cancelled) setSyncStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, setData]);

  // Cada cambio se sube unos segundos después
  useEffect(() => {
    const uid = user?.id;
    if (!uid || syncedFor.current !== uid) return;
    const timer = setTimeout(async () => {
      setSyncStatus('syncing');
      try {
        lastRemote.current = await pushRemote(uid, stored);
        setSyncStatus('synced');
      } catch {
        setSyncStatus('error');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [stored, user?.id]);

  // Al volver a la pestaña, traer cambios hechos en otro dispositivo
  useEffect(() => {
    const uid = user?.id;
    if (!uid) return;
    const onVisible = async () => {
      if (document.visibilityState !== 'visible' || syncedFor.current !== uid) return;
      try {
        const remote = await fetchRemote(uid);
        if (remote && remote.updatedAt > lastRemote.current) {
          lastRemote.current = remote.updatedAt;
          setData(mergeData(dataRef.current, remote.data));
        }
      } catch {
        setSyncStatus('error');
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user?.id, setData]);

  const store: Store = {
    data,
    syncStatus,
    rate: (itemId, rating) =>
      setData((d) => {
        const prev = d.srs[itemId];
        return {
          ...d,
          srs: { ...d.srs, [itemId]: review(prev, rating) },
          activity: bump(d.activity, { reviews: 1, newCards: prev ? 0 : 1 }),
        };
      }),
    undoRate: (itemId, prev) =>
      setData((d) => {
        const srs = { ...d.srs };
        if (prev) srs[itemId] = prev;
        else delete srs[itemId];
        return { ...d, srs, activity: bump(d.activity, { reviews: -1, newCards: prev ? 0 : -1 }) };
      }),
    enroll: (ids) =>
      setData((d) => {
        const today = todayStr();
        const srs = { ...d.srs };
        for (const id of ids) srs[id] = srs[id] ? { ...srs[id], due: today } : newState(today);
        return { ...d, srs };
      }),
    completeLesson: (lessonId, quizScore, conceptIds) =>
      setData((d) => {
        const first = !d.lessons[lessonId];
        const srs = { ...d.srs };
        for (const id of conceptIds) if (!srs[id]) srs[id] = newState();
        return {
          ...d,
          srs,
          lessons: { ...d.lessons, [lessonId]: { completed: todayStr(), quizScore: Math.max(quizScore, d.lessons[lessonId]?.quizScore ?? 0) } },
          activity: first ? bump(d.activity, { lessons: 1 }) : d.activity,
        };
      }),
    saveCustom: (c) =>
      setData((d) => ({ ...d, custom: d.custom.some((x) => x.id === c.id) ? d.custom.map((x) => (x.id === c.id ? c : x)) : [c, ...d.custom] })),
    deleteCustom: (id) =>
      setData((d) => {
        const srs = { ...d.srs };
        delete srs[`cus:${id}`];
        return { ...d, srs, custom: d.custom.filter((x) => x.id !== id) };
      }),
    saveStory: (s) =>
      setData((d) => ({ ...d, stories: d.stories.some((x) => x.id === s.id) ? d.stories.map((x) => (x.id === s.id ? s : x)) : [s, ...d.stories] })),
    deleteStory: (id) => setData((d) => ({ ...d, stories: d.stories.filter((x) => x.id !== id) })),
    addMock: (m) => setData((d) => ({ ...d, mocks: [m, ...d.mocks] })),
    setNote: (id, text) => setData((d) => ({ ...d, notes: { ...d.notes, [id]: text } })),
    setNewPerDay: (n) => setData((d) => ({ ...d, settings: { ...d.settings, newPerDay: n } })),
    importData: (imported) => setData({ ...EMPTY_DATA, ...imported }),
    reset: () => setData(EMPTY_DATA),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStore fuera de AppStoreProvider');
  return c;
}
