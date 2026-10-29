import { useRef, useState } from 'react';
import { Download, LogOut, Sparkles, Trash2, Upload } from 'lucide-react';
import type { AppData } from '../types';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { downloadJSON } from '../lib/storage';
import { todayStr } from '../lib/srs';
import { aiUnavailableMessage, useAIStatus } from '../lib/ai';
import { useAuth } from '../store/AuthContext';
import { CodeBlock } from '../components/CodeBlock';
import { GoogleIcon, SyncBadge } from '../components/Account';
import { LangToggle, ThemeToggle } from '../components/AppLayout';
import { PageHeader } from '../components/ui';

export default function Settings() {
  const { data, setNewPerDay, importData, reset, syncStatus } = useStore();
  const { tr } = useI18n();
  const auth = useAuth();
  const ai = useAIStatus();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');

  const onImport = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as AppData;
      if (parsed.version !== 1 || typeof parsed.srs !== 'object') throw new Error();
      importData(parsed);
      setMsg(tr('✓ Progreso importado', '✓ Progress imported'));
    } catch {
      setMsg(tr('✗ Archivo inválido', '✗ Invalid file'));
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title={tr('Ajustes', 'Settings')} />

      <section className="card space-y-4 p-5">
        <h2 className="font-bold">{tr('Preferencias', 'Preferences')}</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm">{tr('Idioma', 'Language')}</span>
          <LangToggle />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">{tr('Tema', 'Theme')}</span>
          <ThemeToggle />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>{tr('Tarjetas nuevas por día', 'New cards per day')}</span>
            <b>{data.settings.newPerDay}</b>
          </div>
          <input type="range" min={0} max={30} value={data.settings.newPerDay} onChange={(e) => setNewPerDay(Number(e.target.value))} className="w-full accent-brand-600" />
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="flex items-center gap-2 font-bold">
          <Sparkles size={18} className="text-violet-500" /> {tr('Inteligencia artificial (Claude)', 'Artificial intelligence (Claude)')}
        </h2>
        <p className="text-sm">
          {tr('Estado:', 'Status:')}{' '}
          {ai === null ? '…' : ai.enabled ? <b className="text-emerald-600">{tr('activada', 'enabled')}</b> : <b className="text-amber-600">{aiUnavailableMessage(ai.reason, tr)}</b>}
        </p>
        <p className="text-sm text-zinc-500">
          {tr(
            'La evaluación de respuestas y el tutor usan la API de Anthropic desde el servidor; tu API key nunca llega al navegador. Para activarla, crea un archivo .env en la raíz del proyecto y reinicia `npm run dev`:',
            'Answer evaluation and the tutor use the Anthropic API from the server; your API key never reaches the browser. To enable it, create a .env file at the project root and restart `npm run dev`:',
          )}
        </p>
        <CodeBlock lang="bash" code={'ANTHROPIC_API_KEY=sk-ant-...\n# Con cuentas activas, solo estos correos usan la IA / With accounts on, only these emails can use AI\nAI_ALLOWED_EMAILS=tu.correo@gmail.com'} />
        <p className="text-xs text-zinc-500">{tr('En Vercel, agrega estas variables en Project Settings → Environment Variables.', 'On Vercel, add these variables under Project Settings → Environment Variables.')}</p>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="flex items-center gap-2 font-bold">
          {tr('Cuenta y sincronización', 'Account & sync')} <SyncBadge status={syncStatus} />
        </h2>
        {!auth.available ? (
          <p className="text-sm text-zinc-500">
            {tr(
              'Las cuentas no están configuradas: tu progreso solo se guarda en este navegador. Para activarlas, sigue docs/supabase.md.',
              'Accounts are not configured: your progress is only saved in this browser. To enable them, follow docs/supabase.md.',
            )}
          </p>
        ) : auth.user ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">
              {tr('Sesión iniciada como', 'Signed in as')} <b>{auth.user.email}</b>. {tr('Tu progreso se sincroniza entre dispositivos.', 'Your progress syncs across devices.')}
            </p>
            <button onClick={auth.signOut} className="btn-secondary">
              <LogOut size={16} /> {tr('Cerrar sesión', 'Sign out')}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-500">
              {tr('Estás en modo invitado. Inicia sesión para guardar tu progreso en la nube; lo que llevas se sube a tu cuenta.', 'You are in guest mode. Sign in to save your progress in the cloud; what you have so far is uploaded to your account.')}
            </p>
            <button onClick={auth.signInWithGoogle} className="btn-secondary">
              <GoogleIcon /> {tr('Continuar con Google', 'Continue with Google')}
            </button>
          </div>
        )}
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">{tr('Respaldo', 'Backup')}</h2>
        <p className="text-sm text-zinc-500">
          {tr('Descarga tu progreso como archivo JSON o restáuralo desde uno.', 'Download your progress as a JSON file or restore it from one.')}
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => downloadJSON(`interview-hub-${todayStr()}.json`, data)} className="btn-secondary">
            <Download size={16} /> {tr('Exportar', 'Export')}
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn-secondary">
            <Upload size={16} /> {tr('Importar', 'Import')}
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => onImport(e.target.files?.[0])} />
          <button
            onClick={() => confirm(tr('¿Borrar TODO tu progreso? Esto no se puede deshacer.', 'Delete ALL your progress? This cannot be undone.')) && reset()}
            className="btn-ghost text-rose-600"
          >
            <Trash2 size={16} /> {tr('Reiniciar progreso', 'Reset progress')}
          </button>
        </div>
        {msg && <p className="text-sm">{msg}</p>}
      </section>
    </div>
  );
}
