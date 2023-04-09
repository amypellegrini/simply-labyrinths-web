import type Cell from './cell';
import Grid from './grid';
import longestPath from './longestPath';
import wilson from './wilson';

export default class MazeGame {
	maze: Grid;
	startAndEndCells: Cell[];
	cursorRow: number;
	cursorColumn: number;
	cursorX: number;
	cursorY: number;

	debug = false;

	cellSize = 30;
	columns = 5;
	rows = 5;
	level = 1;
	score = 0;
	scoreDelta = 0;
	rowsAndColumnsDelta = 3;

	visitedCells = new Map<string, number>();

	constructor() {
		this.maze = wilson(new Grid(this.rows, this.columns));
		this.startAndEndCells = longestPath(this.maze);
		this.visitedCells.set(this.startAndEndCells[0].id, 1);
		this.cursorRow = this.startAndEndCells[0].row;
		this.cursorColumn = this.startAndEndCells[0].column;

		this.cursorX = this.cursorToScreenCoordinates(this.cursorColumn);
		this.cursorY = this.cursorToScreenCoordinates(this.cursorRow);
	}

	cursorToScreenCoordinates(rowOrColumn: number) {
		return (rowOrColumn + 1) * this.cellSize - this.cellSize / 2;
	}
}
