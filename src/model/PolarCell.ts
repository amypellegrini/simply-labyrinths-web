import Cell from './cell';

export default class PolarCell extends Cell {
	clockwise: number | undefined;
	counterClockwise: number | undefined;
	inwards: PolarCell | undefined;
	outwards: PolarCell[] = [];

	constructor(row: number, column: number) {
		super(row, column);
	}
}
