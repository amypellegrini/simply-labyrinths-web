import Distances from './distances';

interface CellLink {
	cell: PolarCell;
	bidi: boolean;
}

export default class PolarCell {
	id: string;
	row: number;
	column: number;
	links: Map<string, CellLink>;
	clockwise: PolarCell;
	counterClockwise: PolarCell;
	inwards: PolarCell;
	outwards: PolarCell[] = [];

	constructor(row: number, column: number) {
		this.clockwise = this;
		this.counterClockwise = this;
		this.inwards = this;
		this.id = `${row}-${column}`;
		this.row = row;
		this.column = column;
		this.links = new Map();
	}

	link(cell: PolarCell, bidi = false) {
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

	unlink(cell: PolarCell) {
		this.links.delete(cell.id);

		if (cell.links.has(this.id)) {
			cell.unlink(this);
		}
	}

	linked(cell: PolarCell) {
		return this.links.has(cell.id);
	}

	neighbours() {
		const list: PolarCell[] = [];

		if (this.clockwise) {
			list.push(this.clockwise);
		}

		if (this.counterClockwise) {
			list.push(this.counterClockwise);
		}

		if (this.inwards) {
			list.push(this.inwards);
		}

		if (this.outwards) {
			list.push(...this.outwards);
		}

		return list;
	}

	distances(): Distances {
		const distances = new Distances(this);
		let frontier: PolarCell[] = [this];

		while (frontier.length > 0) {
			const newFrontier: PolarCell[] = [];

			frontier.forEach((cell) => {
				cell.links.forEach((linked) => {
					if (distances.cells.get(linked.cell) !== undefined) {
						return;
					}

					distances.setCellDistance(
						linked.cell,
						(distances.cells.get(cell) as number) + 1
					);
					newFrontier.push(linked.cell);
				});
			});

			frontier = newFrontier;
		}

		return distances;
	}
}
