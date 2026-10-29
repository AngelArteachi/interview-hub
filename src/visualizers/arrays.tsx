import { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { Cell, VizFrame, parseNumbers, usePlayer, type BaseStep } from './Player';

/* ---------------- Búsqueda binaria ---------------- */

interface BSStep extends BaseStep {
  lo: number;
  hi: number;
  mid: number;
  found?: number;
}

function binarySteps(arr: number[], target: number): BSStep[] {
  const steps: BSStep[] = [{ lo: 0, hi: arr.length - 1, mid: -1, note: { es: `Buscamos ${target}. lo = 0, hi = ${arr.length - 1}.`, en: `Searching for ${target}. lo = 0, hi = ${arr.length - 1}.` } }];
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) {
      steps.push({ lo, hi, mid, found: mid, note: { es: `arr[${mid}] = ${arr[mid]} = objetivo. ¡Encontrado en ${steps.length} pasos!`, en: `arr[${mid}] = ${arr[mid]} = target. Found in ${steps.length} steps!` } });
      return steps;
    }
    if (arr[mid] < target) {
      steps.push({ lo, hi, mid, note: { es: `arr[${mid}] = ${arr[mid]} < ${target} → descartar la mitad izquierda (lo = ${mid + 1}).`, en: `arr[${mid}] = ${arr[mid]} < ${target} → discard the left half (lo = ${mid + 1}).` } });
      lo = mid + 1;
    } else {
      steps.push({ lo, hi, mid, note: { es: `arr[${mid}] = ${arr[mid]} > ${target} → descartar la mitad derecha (hi = ${mid - 1}).`, en: `arr[${mid}] = ${arr[mid]} > ${target} → discard the right half (hi = ${mid - 1}).` } });
      hi = mid - 1;
    }
  }
  steps.push({ lo, hi, mid: -1, note: { es: `lo > hi: ${target} no está en el arreglo.`, en: `lo > hi: ${target} is not in the array.` } });
  return steps;
}

export function BinarySearchViz() {
  const { tr } = useI18n();
  const [text, setText] = useState('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
  const [target, setTarget] = useState(23);
  const arr = useMemo(() => [...new Set(parseNumbers(text, 14))].sort((a, b) => a - b), [text]);
  const steps = useMemo(() => binarySteps(arr, target), [arr, target]);
  const player = usePlayer(steps, 1300);
  const s = player.step;
  return (
    <VizFrame
      title={tr('Búsqueda binaria', 'Binary search')}
      player={player}
      note={s.note}
      controls={
        <>
          <input value={text} onChange={(e) => setText(e.target.value)} className="input w-48 py-1 font-mono text-xs" aria-label="array" />
          <label className="flex items-center gap-1 text-xs">
            {tr('objetivo', 'target')}
            <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="input w-16 py-1 font-mono text-xs" />
          </label>
        </>
      }
    >
      <div className="flex min-w-max justify-center gap-1.5">
        {arr.map((v, i) => {
          const out = i < s.lo || i > s.hi;
          const tone = s.found === i ? 'found' : i === s.mid ? 'compare' : out ? 'muted' : 'default';
          const label = [i === s.lo && 'lo', i === s.mid && 'mid', i === s.hi && 'hi'].filter(Boolean).join('/');
          return <Cell key={i} value={v} tone={tone} label={label} />;
        })}
      </div>
    </VizFrame>
  );
}

/* ---------------- Ventana deslizante ---------------- */

interface SWStep extends BaseStep {
  left: number;
  right: number;
  window: string[];
  best: number;
  dup?: number;
}

function windowSteps(s: string): SWStep[] {
  const steps: SWStep[] = [];
  const seen = new Set<string>();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    while (seen.has(c)) {
      steps.push({ left, right, window: [...seen], best, dup: right, note: { es: `"${c}" ya está en la ventana → sacar "${s[left]}" y mover izq.`, en: `"${c}" is already in the window → remove "${s[left]}" and move left.` } });
      seen.delete(s[left]);
      left++;
    }
    seen.add(c);
    const prevBest = best;
    best = Math.max(best, right - left + 1);
    steps.push({
      left,
      right,
      window: [...seen],
      best,
      note:
        best > prevBest
          ? { es: `Agregar "${c}". Ventana "${s.slice(left, right + 1)}" → nueva mejor longitud: ${best}.`, en: `Add "${c}". Window "${s.slice(left, right + 1)}" → new best length: ${best}.` }
          : { es: `Agregar "${c}". Ventana "${s.slice(left, right + 1)}" (mejor: ${best}).`, en: `Add "${c}". Window "${s.slice(left, right + 1)}" (best: ${best}).` },
    });
  }
  steps.push({ left, right: s.length - 1, window: [...seen], best, note: { es: `Fin. Subcadena más larga sin repetir: ${best}. Cada carácter entró y salió una vez → O(n).`, en: `Done. Longest substring without repeats: ${best}. Each char entered and left once → O(n).` } });
  return steps;
}

export function SlidingWindowViz() {
  const { tr } = useI18n();
  const [text, setText] = useState('abcabcbb');
  const str = text.slice(0, 16) || 'a';
  const steps = useMemo(() => windowSteps(str), [str]);
  const player = usePlayer(steps, 1100);
  const s = player.step;
  return (
    <VizFrame
      title={tr('Ventana deslizante: subcadena más larga sin repetir', 'Sliding window: longest substring without repeats')}
      player={player}
      note={s.note}
      controls={<input value={text} onChange={(e) => setText(e.target.value)} className="input w-40 py-1 font-mono text-xs" aria-label="string" />}
    >
      <div className="flex min-w-max justify-center gap-1.5">
        {str.split('').map((c, i) => {
          const inWin = i >= s.left && i <= s.right;
          const tone = s.dup === i ? 'compare' : inWin ? 'active' : i > s.right ? 'default' : 'muted';
          const label = [i === s.left && 'izq', i === s.right && 'der'].filter(Boolean).join('/');
          return <Cell key={i} value={c} tone={tone} label={tr(label, label.replace('izq', 'L').replace('der', 'R'))} />;
        })}
      </div>
      <div className="mt-3 flex justify-center gap-6 text-sm">
        <span>
          set = <span className="font-mono">{`{${s.window.join(', ')}}`}</span>
        </span>
        <span>
          {tr('mejor', 'best')} = <b className="font-mono">{s.best}</b>
        </span>
      </div>
    </VizFrame>
  );
}

/* ---------------- Pila y cola ---------------- */

interface SQStep extends BaseStep {
  items: number[];
  highlight?: number;
  out: number[];
}

function sqSteps(values: number[], mode: 'stack' | 'queue'): SQStep[] {
  const steps: SQStep[] = [{ items: [], out: [], note: { es: mode === 'stack' ? 'Pila vacía. Haremos push de cada valor y luego pop hasta vaciarla.' : 'Cola vacía. Haremos enqueue de cada valor y luego dequeue hasta vaciarla.', en: mode === 'stack' ? 'Empty stack. We push each value, then pop until empty.' : 'Empty queue. We enqueue each value, then dequeue until empty.' } }];
  const items: number[] = [];
  const out: number[] = [];
  for (const v of values) {
    items.push(v);
    steps.push({ items: [...items], highlight: items.length - 1, out: [...out], note: mode === 'stack' ? { es: `push(${v}) → entra arriba`, en: `push(${v}) → goes on top` } : { es: `enqueue(${v}) → entra al final`, en: `enqueue(${v}) → joins the back` } });
  }
  while (items.length) {
    const v = mode === 'stack' ? items.pop()! : items.shift()!;
    out.push(v);
    steps.push({ items: [...items], out: [...out], note: mode === 'stack' ? { es: `pop() → ${v} (el último que entró)`, en: `pop() → ${v} (the last one in)` } : { es: `dequeue() → ${v} (el primero que entró)`, en: `dequeue() → ${v} (the first one in)` } });
  }
  steps.push({ items: [], out: [...out], note: mode === 'stack' ? { es: `Orden de salida: ${out.join(', ')} → invertido (LIFO).`, en: `Output order: ${out.join(', ')} → reversed (LIFO).` } : { es: `Orden de salida: ${out.join(', ')} → mismo orden (FIFO).`, en: `Output order: ${out.join(', ')} → same order (FIFO).` } });
  return steps;
}

export function StackQueueViz() {
  const { tr } = useI18n();
  const [mode, setMode] = useState<'stack' | 'queue'>('stack');
  const [text, setText] = useState('1, 2, 3, 4');
  const values = useMemo(() => parseNumbers(text, 7), [text]);
  const steps = useMemo(() => sqSteps(values.length ? values : [1, 2, 3], mode), [values, mode]);
  const player = usePlayer(steps, 900);
  const s = player.step;
  return (
    <VizFrame
      title={tr('Pila (LIFO) vs cola (FIFO)', 'Stack (LIFO) vs queue (FIFO)')}
      player={player}
      note={s.note}
      controls={
        <>
          <select value={mode} onChange={(e) => setMode(e.target.value as 'stack' | 'queue')} className="input w-auto py-1 text-xs">
            <option value="stack">{tr('Pila', 'Stack')}</option>
            <option value="queue">{tr('Cola', 'Queue')}</option>
          </select>
          <input value={text} onChange={(e) => setText(e.target.value)} className="input w-32 py-1 font-mono text-xs" aria-label="values" />
        </>
      }
    >
      <div className="flex min-h-[200px] min-w-max items-center justify-center gap-10">
        {mode === 'stack' ? (
          <div className="flex h-[200px] w-20 flex-col-reverse items-center gap-1 rounded-b-xl border-2 border-t-0 border-zinc-400 p-1.5">
            {s.items.map((v, i) => (
              <Cell key={i} value={v} tone={i === s.highlight ? 'active' : 'default'} />
            ))}
          </div>
        ) : (
          <div className="flex h-16 min-w-[300px] items-center gap-1 border-y-2 border-zinc-400 px-2">
            <span className="mr-1 text-[10px] text-zinc-500">{tr('frente', 'front')}</span>
            {s.items.map((v, i) => (
              <Cell key={i} value={v} tone={i === s.highlight ? 'active' : 'default'} />
            ))}
          </div>
        )}
        <div>
          <div className="label">{tr('Salida', 'Output')}</div>
          <div className="flex gap-1">
            {s.out.map((v, i) => (
              <Cell key={i} value={v} tone="done" />
            ))}
          </div>
        </div>
      </div>
    </VizFrame>
  );
}
