import type Cell from './cell';
import type Grid from './grid';
import random from './random';

export default function sidewinder(grid: Grid) {
	grid.grid.forEach((row) => {
		let run: Cell[] = [];

		row.forEach((cell) => {
			run.push(cell);

			console.log(run);

			const atEasternBoundary = !cell.east;
			const atNorthernBoundary = !cell.north;

			const shouldCloseOut = atEasternBoundary || (!atNorthernBoundary && random(0, 2) === 0);

			if (shouldCloseOut) {
				const member = run[random(0, run.length - 1)];

				if (member.north) {
					member.link(member.north, true);
					run = [];
				}
			} else {
				if (cell.east) {
					cell.link(cell.east, true);
				}
			}
		});
	});

	return grid;
}
