import type Cell from './cell';
import type Grid from './grid';
import random from './random';

export default function recursiveBacktracker(grid: Grid) {
	let currentCell: Cell | null = grid.randomCell();
	const stack: Cell[] = [];

	while (currentCell) {
		const unvisitedNeighbors: Cell[] = currentCell
			.neighbours()
			.filter((neighbour: Cell) => !neighbour.links.size);

		if (unvisitedNeighbors.length) {
			stack.push(currentCell);
			const neighbor =
				unvisitedNeighbors[random(0, unvisitedNeighbors.length - 1)];
			currentCell.link(neighbor, true);
			currentCell = neighbor;
		} else {
			currentCell = stack.pop() || null;
		}
	}

	return grid;
}
