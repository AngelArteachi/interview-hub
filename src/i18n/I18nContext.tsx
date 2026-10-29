import { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { L, Lang } from '../types';
import { useLocalStorage } from '../lib/storage';

interface I18n {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Texto bilingüe en línea: tr('Hola', 'Hello') */
  tr: (es: string, en: string) => string;
  /** Resuelve un objeto L */
  t: (l: L) => string;
}

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Lang>('ih:lang', navigator.language?.startsWith('en') ? 'en' : 'es');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value: I18n = {
    lang,
    setLang,
    tr: (es, en) => (lang === 'es' ? es : en),
    t: (l) => l[lang] ?? l.es,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useI18n fuera de I18nProvider');
  return c;
}
