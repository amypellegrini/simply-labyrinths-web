import BaseCell from './BaseCell';

export default class PolarCell extends BaseCell<PolarCell> {
	clockwise?: PolarCell;
	counterClockwise?: PolarCell;
	inwards?: PolarCell;
	outwards: PolarCell[] = [];

	constructor(row: number, column: number) {
		super(row, column);
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
}
