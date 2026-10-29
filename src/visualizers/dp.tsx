import { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { Cell, VizFrame, parseNumbers, usePlayer, type BaseStep } from './Player';

interface DPStep extends BaseStep {
  dp: (number | null)[];
  current?: number;
  from?: number;
}

/** Cambio de monedas: dp[x] = mínimo de monedas para formar x */
function coinSteps(coins: number[], amount: number): DPStep[] {
  const INF = Infinity;
  const dp: number[] = [0, ...Array(amount).fill(INF)];
  const show = () => dp.map((v) => (v === INF ? null : v));
  const steps: DPStep[] = [{ dp: show(), current: 0, note: { es: `dp[0] = 0 (cero monedas para formar 0). El resto empieza en ∞.`, en: `dp[0] = 0 (zero coins make 0). Everything else starts at ∞.` } }];
  for (let x = 1; x <= amount; x++) {
    for (const c of coins) {
      if (c > x) continue;
      const cand = dp[x - c] + 1;
      const better = cand < dp[x];
      if (better) dp[x] = cand;
      steps.push({
        dp: show(),
        current: x,
        from: x - c,
        note: {
          es: `dp[${x}] con moneda ${c}: dp[${x - c}] + 1 = ${cand === INF ? '∞' : cand}${better ? ' → ¡mejor!' : ''}`,
          en: `dp[${x}] with coin ${c}: dp[${x - c}] + 1 = ${cand === INF ? '∞' : cand}${better ? ' → better!' : ''}`,
        },
      });
    }
  }
  steps.push({
    dp: show(),
    current: amount,
    note: dp[amount] === INF ? { es: `No se puede formar ${amount} → −1`, en: `${amount} cannot be made → −1` } : { es: `Respuesta: dp[${amount}] = ${dp[amount]} monedas. Complejidad O(cantidad × monedas).`, en: `Answer: dp[${amount}] = ${dp[amount]} coins. Complexity O(amount × coins).` },
  });
  return steps;
}

export function DPViz() {
  const { tr } = useI18n();
  const [coinsText, setCoinsText] = useState('1, 3, 4');
  const [amount, setAmount] = useState(6);
  const coins = useMemo(() => [...new Set(parseNumbers(coinsText, 5).filter((c) => c > 0 && Number.isInteger(c)))], [coinsText]);
  const amt = Math.min(15, Math.max(1, Math.floor(amount) || 1));
  const steps = useMemo(() => coinSteps(coins.length ? coins : [1], amt), [coins, amt]);
  const player = usePlayer(steps, 800);
  const s = player.step;
  return (
    <VizFrame
      title={tr('Programación dinámica: cambio de monedas', 'Dynamic programming: coin change')}
      player={player}
      note={s.note}
      controls={
        <>
          <label className="flex items-center gap-1 text-xs">
            {tr('monedas', 'coins')}
            <input value={coinsText} onChange={(e) => setCoinsText(e.target.value)} className="input w-24 py-1 font-mono text-xs" />
          </label>
          <label className="flex items-center gap-1 text-xs">
            {tr('cantidad', 'amount')}
            <input type="number" min={1} max={15} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="input w-16 py-1 font-mono text-xs" />
          </label>
        </>
      }
    >
      <div className="flex min-w-max justify-center gap-1.5">
        {s.dp.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="mb-1 font-mono text-[10px] text-zinc-500">{i}</span>
            <Cell value={v === null ? '∞' : v} tone={i === s.current ? 'active' : i === s.from ? 'compare' : v !== null ? 'done' : 'default'} />
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-zinc-500">
        {tr('Arriba: x · Celdas: dp[x] = mínimo de monedas', 'Top: x · Cells: dp[x] = minimum coins')} · {tr('greedy fallaría con [1,3,4] y 6', 'greedy would fail with [1,3,4] and 6')}
      </p>
    </VizFrame>
  );
}
