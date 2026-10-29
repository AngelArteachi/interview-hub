import { useRef, useState } from 'react';
import { Download, Sparkles, Trash2, Upload } from 'lucide-react';
import type { AppData } from '../types';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { downloadJSON } from '../lib/storage';
import { todayStr } from '../lib/srs';
import { useAIEnabled } from '../lib/ai';
import { CodeBlock } from '../components/CodeBlock';
import { LangToggle, ThemeToggle } from '../components/AppLayout';
import { PageHeader } from '../components/ui';

export default function Settings() {
  const { data, setNewPerDay, importData, reset } = useStore();
  const { tr } = useI18n();
  const ai = useAIEnabled();
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
          {ai === null ? '…' : ai ? <b className="text-emerald-600">{tr('activada', 'enabled')}</b> : <b className="text-amber-600">{tr('desactivada', 'disabled')}</b>}
        </p>
        <p className="text-sm text-zinc-500">
          {tr(
            'La evaluación de respuestas y el tutor usan la API de Anthropic desde el servidor; tu API key nunca llega al navegador. Para activarla, crea un archivo .env en la raíz del proyecto y reinicia `npm run dev`:',
            'Answer evaluation and the tutor use the Anthropic API from the server; your API key never reaches the browser. To enable it, create a .env file at the project root and restart `npm run dev`:',
          )}
        </p>
        <CodeBlock lang="bash" code={'ANTHROPIC_API_KEY=sk-ant-...\n# opcional / optional\nANTHROPIC_MODEL=claude-opus-5-5'} />
        <p className="text-xs text-zinc-500">{tr('En Vercel, agrega ANTHROPIC_API_KEY en Project Settings → Environment Variables.', 'On Vercel, add ANTHROPIC_API_KEY under Project Settings → Environment Variables.')}</p>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">{tr('Tus datos', 'Your data')}</h2>
        <p className="text-sm text-zinc-500">
          {tr('Todo tu progreso se guarda en este navegador. Exporta un respaldo para moverlo a otro equipo.', 'All your progress is stored in this browser. Export a backup to move it to another device.')}
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
