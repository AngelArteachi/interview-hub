import { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { VizFrame, parseNumbers, usePlayer, type BaseStep } from './Player';

/* ---------------- BST: inserción y recorridos ---------------- */

interface TNode {
  v: number;
  l?: TNode;
  r?: TNode;
}

interface BSTStep extends BaseStep {
  nodes: number[]; // valores insertados hasta ahora
  path: number[];
  current?: number;
  visited: number[];
}

function insert(root: TNode | undefined, v: number): TNode {
  if (!root) return { v };
  if (v < root.v) root.l = insert(root.l, v);
  else if (v > root.v) root.r = insert(root.r, v);
  return root;
}

function bstSteps(values: number[], order: 'in' | 'pre' | 'post'): BSTStep[] {
  const steps: BSTStep[] = [];
  let root: TNode | undefined;
  const inserted: number[] = [];
  for (const v of values) {
    if (inserted.includes(v)) continue;
    const path: number[] = [];
    let n = root;
    while (n) {
      path.push(n.v);
      n = v < n.v ? n.l : n.r;
    }
    root = insert(root, v);
    inserted.push(v);
    steps.push({
      nodes: [...inserted],
      path,
      current: v,
      visited: [],
      note: path.length
        ? { es: `Insertar ${v}: ${path.map((p) => `${v} ${v < p ? '<' : '>'} ${p}`).join(' → ')} → aquí.`, en: `Insert ${v}: ${path.map((p) => `${v} ${v < p ? '<' : '>'} ${p}`).join(' → ')} → here.` }
        : { es: `Insertar ${v} como raíz.`, en: `Insert ${v} as the root.` },
    });
  }
  const visited: number[] = [];
  const name = { in: ['Inorden', 'Inorder'], pre: ['Preorden', 'Preorder'], post: ['Postorden', 'Postorder'] }[order];
  const walk = (n?: TNode) => {
    if (!n) return;
    const visit = () => {
      visited.push(n.v);
      steps.push({ nodes: [...inserted], path: [], current: n.v, visited: [...visited], note: { es: `${name[0]}: visitar ${n.v} → [${visited.join(', ')}]`, en: `${name[1]}: visit ${n.v} → [${visited.join(', ')}]` } });
    };
    if (order === 'pre') visit();
    walk(n.l);
    if (order === 'in') visit();
    walk(n.r);
    if (order === 'post') visit();
  };
  walk(root);
  steps.push({
    nodes: [...inserted],
    path: [],
    visited: [...visited],
    note: order === 'in' ? { es: `Inorden en un BST = valores ordenados: ${visited.join(', ')}`, en: `Inorder on a BST = sorted values: ${visited.join(', ')}` } : { es: `${name[0]} completo: ${visited.join(', ')}`, en: `${name[1]} done: ${visited.join(', ')}` },
  });
  return steps;
}

function layout(values: number[]) {
  let root: TNode | undefined;
  for (const v of values) root = insert(root, v);
  const pos = new Map<number, { x: number; y: number }>();
  const edges: [number, number][] = [];
  let i = 0;
  const walk = (n: TNode | undefined, depth: number) => {
    if (!n) return;
    walk(n.l, depth + 1);
    pos.set(n.v, { x: i++, y: depth });
    walk(n.r, depth + 1);
    if (n.l) edges.push([n.v, n.l.v]);
    if (n.r) edges.push([n.v, n.r.v]);
  };
  walk(root, 0);
  return { pos, edges, count: i, depth: Math.max(0, ...[...pos.values()].map((p) => p.y)) };
}

export function BSTViz() {
  const { tr } = useI18n();
  const [text, setText] = useState('50, 30, 70, 20, 40, 60, 80, 35');
  const [order, setOrder] = useState<'in' | 'pre' | 'post'>('in');
  const values = useMemo(() => parseNumbers(text, 12), [text]);
  const steps = useMemo(() => bstSteps(values.length ? values : [5, 3, 8], order), [values, order]);
  const player = usePlayer(steps, 1000);
  const s = player.step;
  const { pos, edges, count, depth } = layout(s.nodes);
  const W = Math.max(320, count * 52);
  const H = (depth + 1) * 64 + 20;
  const px = (v: number) => ((pos.get(v)!.x + 0.5) * W) / count;
  const py = (v: number) => pos.get(v)!.y * 64 + 30;

  return (
    <VizFrame
      title={tr('Árbol binario de búsqueda', 'Binary search tree')}
      player={player}
      note={s.note}
      controls={
        <>
          <select value={order} onChange={(e) => setOrder(e.target.value as typeof order)} className="input w-auto py-1 text-xs">
            <option value="in">{tr('Inorden', 'Inorder')}</option>
            <option value="pre">{tr('Preorden', 'Preorder')}</option>
            <option value="post">{tr('Postorden', 'Postorder')}</option>
          </select>
          <input value={text} onChange={(e) => setText(e.target.value)} className="input w-48 py-1 font-mono text-xs" aria-label="values" />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block" style={{ width: W, maxWidth: '100%' }}>
        {edges.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)} className={s.path.includes(a) && (s.path.includes(b) || b === s.current) ? 'stroke-amber-500' : 'stroke-zinc-300 dark:stroke-zinc-600'} strokeWidth={2} />
        ))}
        {s.nodes.map((v) => {
          const cls =
            v === s.current
              ? 'fill-brand-500 stroke-brand-700'
              : s.visited.includes(v)
                ? 'fill-emerald-400 stroke-emerald-600'
                : s.path.includes(v)
                  ? 'fill-amber-300 stroke-amber-500'
                  : 'fill-white stroke-zinc-400 dark:fill-zinc-800';
          return (
            <g key={v} className="transition-all">
              <circle cx={px(v)} cy={py(v)} r={18} className={cls} strokeWidth={2} />
              <text x={px(v)} y={py(v) + 4} textAnchor="middle" className={`font-mono text-[12px] font-bold ${v === s.current ? 'fill-white' : 'fill-zinc-800 dark:fill-zinc-100'}`}>
                {v}
              </text>
            </g>
          );
        })}
      </svg>
    </VizFrame>
  );
}

/* ---------------- Grafo: BFS y DFS ---------------- */

const G_NODES: Record<string, [number, number]> = {
  A: [60, 50],
  B: [180, 30],
  C: [170, 130],
  D: [300, 60],
  E: [290, 170],
  F: [420, 40],
  G: [420, 150],
  H: [530, 100],
};
const G_EDGES: [string, string][] = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'D'],
  ['C', 'D'],
  ['C', 'E'],
  ['D', 'F'],
  ['E', 'G'],
  ['F', 'H'],
  ['G', 'H'],
  ['D', 'G'],
];
const ADJ: Record<string, string[]> = {};
for (const [a, b] of G_EDGES) {
  (ADJ[a] ??= []).push(b);
  (ADJ[b] ??= []).push(a);
}
for (const k of Object.keys(ADJ)) ADJ[k].sort();

interface GStep extends BaseStep {
  current?: string;
  visited: string[];
  frontier: string[];
  order: string[];
  dist?: Record<string, number>;
}

function graphSteps(start: string, algo: 'bfs' | 'dfs'): GStep[] {
  const steps: GStep[] = [];
  const visited = new Set([start]);
  const order: string[] = [];
  const dist: Record<string, number> = { [start]: 0 };
  const frontier = [start];
  steps.push({ visited: [...visited], frontier: [...frontier], order: [], dist: { ...dist }, note: algo === 'bfs' ? { es: `BFS desde ${start}: cola = [${start}]`, en: `BFS from ${start}: queue = [${start}]` } : { es: `DFS desde ${start}: pila = [${start}]`, en: `DFS from ${start}: stack = [${start}]` } });
  const dfsVisited = new Set<string>();
  while (frontier.length) {
    const n = algo === 'bfs' ? frontier.shift()! : frontier.pop()!;
    if (algo === 'dfs') {
      if (dfsVisited.has(n)) continue;
      dfsVisited.add(n);
    }
    order.push(n);
    const added: string[] = [];
    const neigh = algo === 'dfs' ? [...ADJ[n]].reverse() : ADJ[n];
    for (const v of neigh) {
      if (algo === 'bfs' ? !visited.has(v) : !dfsVisited.has(v)) {
        if (algo === 'bfs') {
          visited.add(v);
          dist[v] = dist[n] + 1;
        }
        frontier.push(v);
        added.push(v);
      }
    }
    const fr = algo === 'bfs' ? frontier : [...frontier].reverse();
    steps.push({
      current: n,
      visited: algo === 'bfs' ? [...visited] : [...dfsVisited],
      frontier: [...fr],
      order: [...order],
      dist: algo === 'bfs' ? { ...dist } : undefined,
      note: {
        es: `Procesar ${n}${added.length ? `, agregar vecinos ${added.join(', ')}` : ', sin vecinos nuevos'}. ${algo === 'bfs' ? 'Cola' : 'Pila (tope primero)'} = [${fr.join(', ')}]`,
        en: `Process ${n}${added.length ? `, add neighbors ${added.join(', ')}` : ', no new neighbors'}. ${algo === 'bfs' ? 'Queue' : 'Stack (top first)'} = [${fr.join(', ')}]`,
      },
    });
  }
  steps.push({
    visited: order,
    frontier: [],
    order,
    dist: algo === 'bfs' ? dist : undefined,
    note: algo === 'bfs' ? { es: `Orden BFS: ${order.join(' → ')}. Los números son la distancia mínima desde ${start}.`, en: `BFS order: ${order.join(' → ')}. Numbers are the shortest distance from ${start}.` } : { es: `Orden DFS: ${order.join(' → ')}. Va a fondo antes de regresar.`, en: `DFS order: ${order.join(' → ')}. It goes deep before backtracking.` },
  });
  return steps;
}

export function GraphViz() {
  const { tr } = useI18n();
  const [algo, setAlgo] = useState<'bfs' | 'dfs'>('bfs');
  const [start, setStart] = useState('A');
  const steps = useMemo(() => graphSteps(start, algo), [start, algo]);
  const player = usePlayer(steps, 1100);
  const s = player.step;
  return (
    <VizFrame
      title={tr('Recorridos de grafos', 'Graph traversals')}
      player={player}
      note={s.note}
      controls={
        <>
          <select value={algo} onChange={(e) => setAlgo(e.target.value as 'bfs' | 'dfs')} className="input w-auto py-1 text-xs">
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
          </select>
          <select value={start} onChange={(e) => setStart(e.target.value)} className="input w-auto py-1 text-xs" aria-label="start">
            {Object.keys(G_NODES).map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </>
      }
    >
      <svg viewBox="0 0 590 210" className="mx-auto block w-full max-w-[590px]">
        {G_EDGES.map(([a, b]) => (
          <line key={a + b} x1={G_NODES[a][0]} y1={G_NODES[a][1]} x2={G_NODES[b][0]} y2={G_NODES[b][1]} className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth={2} />
        ))}
        {Object.entries(G_NODES).map(([n, [x, y]]) => {
          const cls =
            n === s.current
              ? 'fill-brand-500 stroke-brand-700'
              : s.order.includes(n)
                ? 'fill-emerald-400 stroke-emerald-600'
                : s.frontier.includes(n)
                  ? 'fill-amber-300 stroke-amber-500'
                  : 'fill-white stroke-zinc-400 dark:fill-zinc-800';
          return (
            <g key={n}>
              <circle cx={x} cy={y} r={19} className={`${cls} transition-all`} strokeWidth={2} />
              <text x={x} y={y + 5} textAnchor="middle" className={`text-[14px] font-bold ${n === s.current ? 'fill-white' : 'fill-zinc-800 dark:fill-zinc-100'}`}>
                {n}
              </text>
              {s.dist?.[n] !== undefined && (
                <text x={x + 20} y={y - 16} className="fill-brand-600 font-mono text-[11px] font-bold dark:fill-brand-300">
                  {s.dist[n]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded-full bg-brand-500" />
          {tr('actual', 'current')}
        </span>
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded-full bg-amber-300" />
          {algo === 'bfs' ? tr('en la cola', 'in queue') : tr('en la pila', 'in stack')}
        </span>
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded-full bg-emerald-400" />
          {tr('procesado', 'processed')}
        </span>
      </div>
    </VizFrame>
  );
}
