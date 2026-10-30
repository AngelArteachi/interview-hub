import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

export function Markdown({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div className={`prose prose-zinc max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-brand-600 prose-table:text-sm ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className ?? '');
            const text = String(children);
            if (match || text.includes('\n')) return <CodeBlock code={text.replace(/\n$/, '')} lang={match?.[1]} />;
            return <code>{children}</code>;
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

/** Markdown en una sola línea (negritas, `código`) para textos cortos como preguntas y opciones */
export function InlineMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <>{children}</>,
        code: ({ children }) => <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.9em] dark:bg-zinc-800">{children}</code>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
