import Distances from './distances';

interface CellLink {
	cell: Cell;
	bidi: boolean;
}

export default class Cell {
	id: string;
	row: number;
	column: number;
	links: Map<string, CellLink>;
	north?: Cell;
	south?: Cell;
	west?: Cell;
	east?: Cell;

	constructor(row: number, column: number) {
		this.id = `${row}-${column}`;
		this.row = row;
		this.column = column;
		this.links = new Map();
	}

	link(cell: Cell, bidi = false) {
		if (!this.links.has(cell.id)) {
			this.links.set(cell.id, {
				cell,
				bidi
			});

			if (bidi) {
				cell.link(this, true);
			}
		}
	}

	unlink(cell: Cell) {
		this.links.delete(cell.id);

		if (cell.links.has(this.id)) {
			cell.unlink(this);
		}
	}

	linked(cell: Cell) {
		return this.links.has(cell.id);
	}

	neighbours() {
		const list: Cell[] = [];

		if (this.north) {
			list.push(this.north);
		}

		if (this.south) {
			list.push(this.south);
		}

		if (this.east) {
			list.push(this.east);
		}

		if (this.west) {
			list.push(this.west);
		}

		return list;
	}

	distances() {
		const distances = new Distances(this);
		let frontier: Cell[] = [this];

		while (frontier.length > 0) {
			const newFrontier: Cell[] = [];

			frontier.forEach((cell) => {
				cell.links.forEach((linked) => {
					if (distances.cells.get(linked.cell) !== undefined) {
						return;
					}

					distances.setCellDistance(linked.cell, (distances.cells.get(cell) as number) + 1);
					newFrontier.push(linked.cell);
				});
			});

			frontier = newFrontier;
		}

		return distances;
	}
}
