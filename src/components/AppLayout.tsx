import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { BarChart3, BookOpen, CalendarCheck, Dumbbell, Flame, Menu, Mic, Moon, Settings, Sun, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { useTheme } from '../store/ThemeContext';
import { useStore } from '../store/AppStore';
import { dailyQueue } from '../lib/items';
import { streak } from '../lib/stats';

export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex rounded-lg border border-zinc-200 p-0.5 text-xs font-bold dark:border-zinc-700">
      {(['es', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-md px-2 py-1 uppercase transition ${lang === l ? 'bg-brand-600 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { tr } = useI18n();
  return (
    <button onClick={toggle} className="btn-ghost p-2" aria-label={tr('Cambiar tema', 'Toggle theme')}>
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function AppLayout() {
  const { tr } = useI18n();
  const { data } = useStore();
  const [open, setOpen] = useState(false);
  const pending = dailyQueue(data).all.length;
  const s = streak(data);

  const links = [
    { to: '/', end: true, icon: CalendarCheck, label: tr('Hoy', 'Today'), badge: pending },
    { to: '/learn', icon: BookOpen, label: tr('Aprender', 'Learn') },
    { to: '/practice', icon: Dumbbell, label: tr('Practicar', 'Practice') },
    { to: '/mock', icon: Mic, label: tr('Simulador', 'Mock interview') },
    { to: '/stats', icon: BarChart3, label: tr('Progreso', 'Progress') },
  ];

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
    }`;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap font-extrabold">
            <img src="/favicon.svg" alt="" className="h-7 w-7" />
            <span className="hidden sm:inline">Interview Hub</span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={navCls}>
                <l.icon size={16} /> {l.label}
                {!!l.badge && <span className="rounded-full bg-brand-600 px-1.5 text-[10px] text-white">{l.badge}</span>}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <span
              className={`chip ${s.todayDone ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}`}
              title={tr('Racha de días', 'Day streak')}
            >
              <Flame size={13} /> {s.current}
            </span>
            <LangToggle />
            <ThemeToggle />
            <NavLink to="/settings" className="btn-ghost hidden p-2 sm:inline-flex" aria-label={tr('Ajustes', 'Settings')}>
              <Settings size={18} />
            </NavLink>
            <button className="btn-ghost p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-zinc-200 px-4 py-2 lg:hidden dark:border-zinc-800" onClick={() => setOpen(false)}>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={navCls}>
                <l.icon size={16} /> {l.label}
                {!!l.badge && <span className="ml-auto rounded-full bg-brand-600 px-1.5 text-[10px] text-white">{l.badge}</span>}
              </NavLink>
            ))}
            <NavLink to="/settings" className={navCls}>
              <Settings size={16} /> {tr('Ajustes', 'Settings')}
            </NavLink>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
