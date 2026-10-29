import { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { VizFrame, parseNumbers, usePlayer, type BaseStep } from './Player';

interface SortStep extends BaseStep {
  arr: number[];
  compare: number[];
  sorted: number[];
  range?: [number, number];
  pivot?: number;
}

type Algo = 'bubble' | 'merge' | 'quick';

function bubble(input: number[]): SortStep[] {
  const a = [...input];
  const steps: SortStep[] = [{ arr: [...a], compare: [], sorted: [], note: { es: 'Arreglo inicial. Bubble sort compara vecinos y los intercambia si están desordenados.', en: 'Initial array. Bubble sort compares neighbors and swaps them if out of order.' } }];
  const sorted: number[] = [];
  for (let end = a.length - 1; end > 0; end--) {
    for (let j = 0; j < end; j++) {
      const swap = a[j] > a[j + 1];
      steps.push({
        arr: [...a],
        compare: [j, j + 1],
        sorted: [...sorted],
        note: swap
          ? { es: `${a[j]} > ${a[j + 1]} → intercambiar`, en: `${a[j]} > ${a[j + 1]} → swap` }
          : { es: `${a[j]} ≤ ${a[j + 1]} → se quedan`, en: `${a[j]} ≤ ${a[j + 1]} → keep` },
      });
      if (swap) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
    sorted.push(end);
    steps.push({ arr: [...a], compare: [], sorted: [...sorted], note: { es: `El mayor "burbujea" hasta la posición ${end}.`, en: `The largest "bubbles up" to position ${end}.` } });
  }
  steps.push({ arr: [...a], compare: [], sorted: a.map((_, i) => i), note: { es: '¡Ordenado! O(n²) comparaciones.', en: 'Sorted! O(n²) comparisons.' } });
  return steps;
}

function merge(input: number[]): SortStep[] {
  const a = [...input];
  const steps: SortStep[] = [{ arr: [...a], compare: [], sorted: [], note: { es: 'Merge sort: divide a la mitad recursivamente y luego mezcla las mitades ordenadas.', en: 'Merge sort: split in half recursively, then merge the sorted halves.' } }];
  const rec = (lo: number, hi: number) => {
    if (hi - lo < 1) return;
    const mid = Math.floor((lo + hi) / 2);
    rec(lo, mid);
    rec(mid + 1, hi);
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    steps.push({ arr: [...a], compare: [], sorted: [], range: [lo, hi], note: { es: `Mezclar [${left.join(', ')}] y [${right.join(', ')}]`, en: `Merge [${left.join(', ')}] and [${right.join(', ')}]` } });
    let i = 0;
    let j = 0;
    let k = lo;
    while (i < left.length || j < right.length) {
      if (j >= right.length || (i < left.length && left[i] <= right[j])) a[k++] = left[i++];
      else a[k++] = right[j++];
      steps.push({ arr: [...a], compare: [k - 1], sorted: [], range: [lo, hi], note: { es: `Colocar ${a[k - 1]} en la posición ${k - 1}`, en: `Place ${a[k - 1]} at position ${k - 1}` } });
    }
  };
  rec(0, a.length - 1);
  steps.push({ arr: [...a], compare: [], sorted: a.map((_, i) => i), note: { es: '¡Ordenado! Siempre O(n log n).', en: 'Sorted! Always O(n log n).' } });
  return steps;
}

function quick(input: number[]): SortStep[] {
  const a = [...input];
  const steps: SortStep[] = [{ arr: [...a], compare: [], sorted: [], note: { es: 'Quick sort: elige un pivote (aquí el último) y deja menores a la izquierda y mayores a la derecha.', en: 'Quick sort: pick a pivot (here the last one) and put smaller left, larger right.' } }];
  const sorted: number[] = [];
  const rec = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) {
      sorted.push(lo);
      return;
    }
    const p = a[hi];
    let i = lo;
    steps.push({ arr: [...a], compare: [], sorted: [...sorted], pivot: hi, range: [lo, hi], note: { es: `Pivote = ${p}`, en: `Pivot = ${p}` } });
    for (let j = lo; j < hi; j++) {
      const less = a[j] < p;
      steps.push({ arr: [...a], compare: [j], sorted: [...sorted], pivot: hi, range: [lo, hi], note: less ? { es: `${a[j]} < ${p} → a la zona izquierda`, en: `${a[j]} < ${p} → to the left zone` } : { es: `${a[j]} ≥ ${p} → se queda`, en: `${a[j]} ≥ ${p} → stays` } });
      if (less) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    sorted.push(i);
    steps.push({ arr: [...a], compare: [], sorted: [...sorted], range: [lo, hi], note: { es: `El pivote ${p} queda en su lugar final (${i}).`, en: `Pivot ${p} lands in its final place (${i}).` } });
    rec(lo, i - 1);
    rec(i + 1, hi);
  };
  rec(0, a.length - 1);
  steps.push({ arr: [...a], compare: [], sorted: a.map((_, i) => i), note: { es: '¡Ordenado! O(n log n) en promedio.', en: 'Sorted! O(n log n) on average.' } });
  return steps;
}

export function SortingViz() {
  const { tr } = useI18n();
  const [algo, setAlgo] = useState<Algo>('bubble');
  const [text, setText] = useState('38, 27, 43, 3, 9, 82, 10');
  const nums = useMemo(() => parseNumbers(text, 10), [text]);
  const steps = useMemo(() => (algo === 'bubble' ? bubble : algo === 'merge' ? merge : quick)(nums.length ? nums : [3, 1, 2]), [algo, nums]);
  const player = usePlayer(steps, 700);
  const s = player.step;
  const max = Math.max(...s.arr, 1);

  return (
    <VizFrame
      title={tr('Algoritmos de ordenamiento', 'Sorting algorithms')}
      player={player}
      note={s.note}
      controls={
        <>
          <select value={algo} onChange={(e) => setAlgo(e.target.value as Algo)} className="input w-auto py-1 text-xs">
            <option value="bubble">Bubble sort</option>
            <option value="merge">Merge sort</option>
            <option value="quick">Quick sort</option>
          </select>
          <input value={text} onChange={(e) => setText(e.target.value)} className="input w-44 py-1 font-mono text-xs" aria-label="array" />
        </>
      }
    >
      <div className="flex h-48 min-w-max items-end justify-center gap-2">
        {s.arr.map((v, i) => {
          const inRange = !s.range || (i >= s.range[0] && i <= s.range[1]);
          const cls = s.sorted.includes(i)
            ? 'bg-emerald-500'
            : s.pivot === i
              ? 'bg-rose-500'
              : s.compare.includes(i)
                ? 'bg-amber-400'
                : inRange
                  ? 'bg-brand-400'
                  : 'bg-zinc-300 dark:bg-zinc-700';
          return (
            <div key={i} className="flex w-9 flex-col items-center gap-1">
              <span className="font-mono text-xs">{v}</span>
              <div className={`w-full rounded-t-md transition-all duration-300 ${cls}`} style={{ height: `${Math.max(6, (v / max) * 150)}px` }} />
            </div>
          );
        })}
      </div>
    </VizFrame>
  );
}
