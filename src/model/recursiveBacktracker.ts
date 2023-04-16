import type BaseCell from './BaseCell';
import type BaseGrid from './BaseGrid';
import random from './random';

export default function recursiveBacktracker<
	TGrid extends BaseGrid<TCell>,
	TCell extends BaseCell<TCell>
>(grid: TGrid) {
	let currentCell: BaseCell<TCell> | null = grid.randomCell();
	const stack: BaseCell<TCell>[] = [];

	while (currentCell) {
		const unvisitedNeighbors: BaseCell<TCell>[] = currentCell
			.neighbours()
			.filter((neighbour: BaseCell<TCell>) => !neighbour.links.size);

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
