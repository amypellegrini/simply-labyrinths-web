import type Grid from './grid';
import random from './random';

export default function binaryTree(grid: Grid) {
	grid.cells.forEach((cell) => {
		const neighbours = [];

		if (cell.north) {
			neighbours.push(cell.north);
		}

		if (cell.east) {
			neighbours.push(cell.east);
		}

		const neighbour = neighbours[random(0, neighbours.length - 1)];

		if (neighbour) {
			cell.link(neighbour, true);
		}
	});

	return grid;
}
