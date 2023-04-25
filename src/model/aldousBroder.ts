import type Grid from './grid';
import random from './random';

export default function aldousBroder(grid: Grid) {
	let cell = grid.randomCell();
	let unvisited = grid.cells.length - 1;

	while (unvisited > 0) {
		const neighbour = cell.neighbours()[random(0, cell.neighbours.length - 1)];

		if (neighbour.links.size === 0) {
			cell.link(neighbour, true);
			unvisited -= 1;
		}

		cell = neighbour;
	}

	return grid;
}
