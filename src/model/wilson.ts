import type Cell from './cell';
import type Grid from './grid';
import random from './random';

export default function wilson(grid: Grid) {
	const unvisited: Cell[] = [];

	grid.cells.forEach((cell) => {
		unvisited.push(cell);
	});

	unvisited.splice(random(0, unvisited.length - 1), 1);

	while (unvisited.length > 0) {
		let cell = unvisited[random(0, unvisited.length - 1)];

		let path = [cell];

		while (unvisited.indexOf(cell) !== -1) {
			cell = cell.neighbours()[random(0, cell.neighbours().length - 1)];

			const position = path.indexOf(cell);

			if (position !== -1) {
				path = path.slice(0, position + 1);
			} else {
				path.push(cell);
			}
		}

		for (let i = 0; i < path.length - 1; i++) {
			path[i].link(path[i + 1], true);
			unvisited.splice(unvisited.indexOf(path[i]), 1);
		}
	}

	return grid;
}
