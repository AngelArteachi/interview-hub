import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

const KEYWORDS = new Set(
  (
    'def return if elif else for while in not and or is None True False class import from as with try except finally raise lambda yield pass break continue global async await ' +
    'const let var function new this typeof instanceof export default interface type extends implements null undefined true false catch throw ' +
    'SELECT FROM WHERE JOIN LEFT INNER ON GROUP BY ORDER HAVING COUNT AS INSERT INTO VALUES UPDATE SET DELETE CREATE INDEX TABLE BEGIN COMMIT DESC ASC IS NULL AND OR NOT ' +
    'FROM WORKDIR COPY RUN EXPOSE CMD'
  ).split(' '),
);

/** Resaltado de sintaxis mínimo (comentarios, strings, números y palabras clave) */
const COMMENT: Record<string, string> = {
  javascript: '\\/\\/[^\\n]*',
  typescript: '\\/\\/[^\\n]*',
  sql: '--[^\\n]*',
  http: '(?!)',
};

function highlight(code: string, lang = 'python'): ReactNode[] {
  // Python, bash, yaml y dockerfile usan '#'
  const comment = COMMENT[lang] ?? '#[^\\n]*';
  const re = new RegExp(`(${comment})|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`[^\`]*\`)|\\b(\\d+(?:\\.\\d+)?)\\b|\\b([A-Za-z_]\\w*)\\b`, 'g');
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    if (m[1]) out.push(<span key={k++} className="text-zinc-500 italic">{m[1]}</span>);
    else if (m[2]) out.push(<span key={k++} className="text-emerald-400">{m[2]}</span>);
    else if (m[3]) out.push(<span key={k++} className="text-amber-300">{m[3]}</span>);
    else if (m[4] && KEYWORDS.has(m[4])) out.push(<span key={k++} className="text-violet-400">{m[4]}</span>);
    else out.push(m[0]);
    last = re.lastIndex;
  }
  out.push(code.slice(last));
  return out;
}

/**
 * Bloque de código con resaltado de sintaxis.
 * Con `lineNumbers` muestra números de línea; con `highlightLine` marca esa línea (paso a paso).
 */
export function CodeBlock({ code, lang, lineNumbers = false, highlightLine }: { code: string; lang?: string; lineNumbers?: boolean; highlightLine?: number }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* portapapeles no disponible */
    }
  };
  return (
    <div className="not-prose group relative my-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-1.5 text-xs text-zinc-500">
        <span className="font-mono">{lang === 'text' ? '' : (lang ?? 'code')}</span>
        <button onClick={copy} className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-zinc-800 hover:text-zinc-200" aria-label="Copy">
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-200 [font-variant-ligatures:none]">
        {lineNumbers || highlightLine ? (
          <code className="block min-w-max">
            {code.split('\n').map((ln, i) => (
              <div
                key={i}
                className={`-mx-4 flex border-l-[3px] px-4 transition-colors ${i + 1 === highlightLine ? 'border-brand-400 bg-brand-500/25' : 'border-transparent'}`}
              >
                <span className="mr-4 w-5 shrink-0 select-none text-right text-zinc-600">{i + 1}</span>
                <span>{highlight(ln, lang)}</span>
              </div>
            ))}
          </code>
        ) : (
          <code>{highlight(code, lang)}</code>
        )}
      </pre>
    </div>
  );
}
