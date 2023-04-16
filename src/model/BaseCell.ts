import Distances from './distances';

interface CellLink<TCell extends BaseCell<TCell>> {
	cell: BaseCell<TCell>;
	bidi: boolean;
}

export default abstract class BaseCell<TCell extends BaseCell<TCell>> {
	id: string;
	row: number;
	column: number;
	links: Map<string, CellLink<BaseCell<TCell>>> = new Map();

	constructor(row: number, column: number) {
		this.id = `${row}-${column}`;
		this.row = row;
		this.column = column;
	}

	abstract neighbours(): BaseCell<TCell>[];

	link(cell: BaseCell<TCell>, bidi = false) {
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

	unlink(cell: BaseCell<TCell>) {
		this.links.delete(cell.id);

		if (cell.links.has(this.id)) {
			cell.unlink(this);
		}
	}

	linked(cell: BaseCell<TCell>) {
		return this.links.has(cell.id);
	}

	distances() {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self: BaseCell<TCell> = this;

		const distances = new Distances(self);
		let frontier: BaseCell<TCell>[] = [self];

		while (frontier.length > 0) {
			const newFrontier: BaseCell<TCell>[] = [];

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
