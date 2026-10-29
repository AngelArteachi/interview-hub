import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { DESIGN_CASES, DESIGN_FRAMEWORK } from '../data/systemDesign';
import { useStore } from '../store/AppStore';
import { useI18n } from '../i18n/I18nContext';
import { PageHeader } from '../components/ui';

export default function SystemDesign() {
  const { data } = useStore();
  const { t, tr } = useI18n();
  return (
    <div>
      <PageHeader
        back="/practice"
        title="System design"
        subtitle={tr('Para un puesto junior se espera un diseño básico bien razonado: requisitos claros, API, datos y algunos trade-offs.', 'For a junior role a well-reasoned basic design is expected: clear requirements, API, data and a few trade-offs.')}
      />
      <div className="card mb-6 p-5">
        <h2 className="mb-3 font-bold">{tr('Marco de 5 pasos (úsalo siempre)', '5-step framework (always use it)')}</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {DESIGN_FRAMEWORK.map((s) => (
            <li key={s.title.es} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60">
              <div className="text-sm font-bold text-brand-600 dark:text-brand-300">{t(s.title)}</div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{t(s.desc)}</div>
            </li>
          ))}
        </ol>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DESIGN_CASES.map((d) => (
          <Link key={d.id} to={d.id} className="card group flex flex-col p-5 transition hover:border-brand-400">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold">{t(d.title)}</h3>
              {data.srs[`des:${d.id}`] && <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />}
            </div>
            <p className="mt-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">{t(d.prompt)}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
              {tr('Practicar', 'Practice')} <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
