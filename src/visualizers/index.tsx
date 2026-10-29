import type { VisualizerId } from '../types';
import { SortingViz } from './sorting';
import { BinarySearchViz, SlidingWindowViz, StackQueueViz } from './arrays';
import { BSTViz, GraphViz } from './trees';
import { DPViz } from './dp';

const MAP: Record<VisualizerId, () => JSX.Element> = {
  sorting: SortingViz,
  'binary-search': BinarySearchViz,
  'sliding-window': SlidingWindowViz,
  'stack-queue': StackQueueViz,
  bst: BSTViz,
  graph: GraphViz,
  dp: DPViz,
};

export function Visualizer({ id }: { id: VisualizerId }) {
  const C = MAP[id];
  return <C />;
}
