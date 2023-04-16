import BaseCell from './BaseCell';

export default class Cell extends BaseCell<Cell> {
	north?: BaseCell<Cell>;
	south?: BaseCell<Cell>;
	west?: BaseCell<Cell>;
	east?: BaseCell<Cell>;

	constructor(row: number, column: number) {
		super(row, column);
	}

	neighbours() {
		const list: BaseCell<Cell>[] = [];

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
}
