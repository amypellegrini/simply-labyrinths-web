import type PolarGrid from './PolarGrid';
import type Grid from './grid';

export default function longestPath(maze: Grid | PolarGrid) {
	const distances = maze.cells[0].distances();
	const [endCell] = distances.max();

	const newDistances = endCell.distances();
	const [startCell] = newDistances.max();

	return [startCell, endCell];
}
