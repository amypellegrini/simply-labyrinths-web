import type Cell from './cell';

export default class Distances {
	root: Cell;
	cells: Map<Cell, number>;

	constructor(root: Cell) {
		this.root = root;
		this.cells = new Map();

		this.cells.set(this.root, 0);
	}

	setCellDistance(cell: Cell, distance: number) {
		this.cells.set(cell, distance);
	}

	max(): [Cell, number] {
		let maxCell = this.root;
		let maxDistance = 0;

		this.cells.forEach((distance, cell) => {
			if (distance > maxDistance) {
				maxCell = cell;
				maxDistance = distance;
			}
		});

		return [maxCell, maxDistance];
	}
}
