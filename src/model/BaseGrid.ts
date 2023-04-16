import random from './random';

export default class BaseGrid<TCell> {
	cells: TCell[] = [];

	size() {
		return this.cells.length;
	}

	randomCell() {
		return this.cells[random(0, this.size())];
	}
}
