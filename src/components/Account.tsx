import { useEffect, useRef, useState } from 'react';
import { Cloud, CloudOff, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useStore, type SyncStatus } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';

export function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function SyncBadge({ status }: { status: SyncStatus }) {
  const { tr } = useI18n();
  if (status === 'guest') return null;
  const map = {
    syncing: [<Loader2 key="i" size={14} className="animate-spin" />, tr('Sincronizando…', 'Syncing…'), 'text-zinc-500'],
    synced: [<Cloud key="i" size={14} />, tr('Sincronizado', 'Synced'), 'text-emerald-600 dark:text-emerald-400'],
    error: [<CloudOff key="i" size={14} />, tr('Sin conexión: se guardará al reconectar', 'Offline: will save on reconnect'), 'text-amber-600'],
  } as const;
  const [icon, label, cls] = map[status];
  return (
    <span className={`flex items-center gap-1 text-xs ${cls}`} title={label}>
      {icon}
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Botón de cuenta en la barra superior */
export function AccountButton() {
  const { available, user, loading, signInWithGoogle, signOut } = useAuth();
  const { syncStatus } = useStore();
  const { tr } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!available || loading) return null;

  if (!user)
    return (
      <button onClick={signInWithGoogle} className="btn-secondary px-2.5 py-1.5 text-xs sm:px-3">
        <GoogleIcon /> <span className="hidden sm:inline">{tr('Entrar', 'Sign in')}</span>
      </button>
    );

  const name = (user.user_metadata.full_name as string | undefined) ?? user.email ?? '';
  const avatar = user.user_metadata.avatar_url as string | undefined;
  return (
    <div ref={ref} className="relative flex items-center gap-1.5">
      <SyncBadge status={syncStatus} />
      <button onClick={() => setOpen(!open)} className="rounded-full ring-brand-500 focus-visible:ring-2" aria-label={tr('Cuenta', 'Account')}>
        {avatar ? (
          <img src={avatar} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{name[0]?.toUpperCase()}</span>
        )}
      </button>
      {open && (
        <div className="card absolute right-0 top-11 z-50 w-64 p-3 shadow-xl">
          <div className="truncate text-sm font-semibold">{name}</div>
          <div className="truncate text-xs text-zinc-500">{user.email}</div>
          <div className="my-3 text-xs text-zinc-500">
            {syncStatus === 'error'
              ? tr('⚠️ No se pudo sincronizar. Tu progreso sigue guardado en este navegador.', '⚠️ Sync failed. Your progress is still saved in this browser.')
              : tr('☁️ Tu progreso se sincroniza entre tus dispositivos.', '☁️ Your progress syncs across your devices.')}
          </div>
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="btn-ghost w-full justify-start px-2 text-rose-600"
          >
            <LogOut size={15} /> {tr('Cerrar sesión', 'Sign out')}
          </button>
        </div>
      )}
    </div>
  );
}
