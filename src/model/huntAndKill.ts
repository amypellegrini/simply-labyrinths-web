import type Cell from './cell';
import type Grid from './grid';
import random from './random';

export default function huntAndKill(grid: Grid) {
	let currentCell: Cell | null = grid.randomCell();

	while (currentCell) {
		const unvisitedNeighbors: Cell[] = currentCell
			.neighbours()
			.filter((neighbour: Cell) => !neighbour.links.size);

		if (unvisitedNeighbors.length) {
			const neighbor =
				unvisitedNeighbors[random(0, unvisitedNeighbors.length - 1)];
			currentCell.link(neighbor, true);
			currentCell = neighbor;
		} else {
			currentCell = null;

			for (const cell of grid.cells) {
				const visitedNeighbors = cell
					.neighbours()
					.filter((neighbor) => neighbor.links.size);

				if (!cell.links.size && visitedNeighbors.length) {
					currentCell = cell;
					const neighbor =
						visitedNeighbors[random(0, visitedNeighbors.length - 1)];
					currentCell.link(neighbor, true);
					break;
				}
			}
		}
	}

	return grid;
}
