import type Cell from './cell';

export default class Distances<TCell> {
	root: TCell;
	cells: Map<TCell, number>;

	constructor(root: TCell) {
		this.root = root;
		this.cells = new Map();

		this.cells.set(this.root, 0);
	}

	setCellDistance(cell: TCell, distance: number) {
		this.cells.set(cell, distance);
	}

	max(): [TCell, number] {
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
