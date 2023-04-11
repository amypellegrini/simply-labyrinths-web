import type Cell from './cell';
import Grid from './grid';
import longestPath from './longestPath';
import wilson from './wilson';

export type Cursor = {
	row: number;
	column: number;
	x: number;
	y: number;
};

export default class MazeGame {
	private __cursorState: 'idle' | 'moving' = 'idle';

	debug = false;

	maze: Grid;
	startAndEndCells: Cell[];
	cursor: Cursor;

	cellSize = 30;
	columns = 5;
	rows = 5;
	level = 1;
	score = 0;
	scoreDelta = 0;
	rowsAndColumnsDelta = 3;

	visitedCells = new Map<string, number>();

	onCursorUpdate?: (cursor: Cursor) => void;

	constructor(onCursorUpdate?: (cursor: Cursor) => void) {
		this.maze = wilson(new Grid(this.rows, this.columns));
		this.startAndEndCells = longestPath(this.maze);
		this.visitedCells.set(this.startAndEndCells[0].id, 1);

		const { row, column } = this.startAndEndCells[0];

		this.cursor = {
			row: row,
			column: column,
			x: this.cursorToScreenCoordinates(column),
			y: this.cursorToScreenCoordinates(row)
		};

		this.onCursorUpdate = onCursorUpdate;
	}

	cursorToScreenCoordinates(rowOrColumn: number) {
		return (rowOrColumn + 1) * this.cellSize - this.cellSize / 2;
	}

	levelUp() {
		this.rows += this.rowsAndColumnsDelta;
		this.columns += this.rowsAndColumnsDelta;
		this.level += 1;

		this.maze = wilson(new Grid(this.rows, this.columns));
	}

	moveCursor(
		direction: 'right' | 'left' | 'up' | 'down',
		bypassStateCheck = false
	) {
		if (this.__cursorState === 'moving' && !bypassStateCheck) {
			return;
		}

		this.__cursorState = 'moving';

		const currentCell = this.maze.grid[this.cursor.row][this.cursor.column];

		if (
			direction === 'right' &&
			currentCell.east &&
			currentCell.linked(currentCell.east)
		) {
			this.cursor.column += 1;
			this.cursor.x = this.cursorToScreenCoordinates(this.cursor.column);
		}

		if (
			direction === 'down' &&
			currentCell.south &&
			currentCell.linked(currentCell.south)
		) {
			this.cursor.row += 1;
			this.cursor.y = this.cursorToScreenCoordinates(this.cursor.row);
		}

		if (
			direction === 'left' &&
			currentCell.west &&
			currentCell.linked(currentCell.west)
		) {
			this.cursor.column -= 1;
			this.cursor.x = this.cursorToScreenCoordinates(this.cursor.column);
		}

		if (
			direction === 'up' &&
			currentCell.north &&
			currentCell.linked(currentCell.north)
		) {
			this.cursor.row -= 1;
			this.cursor.y = this.cursorToScreenCoordinates(this.cursor.row);
		}

		const nextCell = this.maze.grid[this.cursor.row][this.cursor.column];
		this.onCursorUpdate?.(this.cursor);

		if (nextCell !== currentCell) {
			if (nextCell.links.size === 2) {
				const oppositeDirection = {
					right: 'left',
					left: 'right',
					down: 'up',
					up: 'down'
				}[direction];

				if (
					oppositeDirection !== 'up' &&
					nextCell.north &&
					nextCell.linked(nextCell.north)
				) {
					setTimeout(() => {
						this.moveCursor('up', true);
					}, 100);
				}

				if (
					oppositeDirection !== 'down' &&
					nextCell.south &&
					nextCell.linked(nextCell.south)
				) {
					setTimeout(() => {
						this.moveCursor('down', true);
					}, 100);
				}

				if (
					oppositeDirection !== 'left' &&
					nextCell.west &&
					nextCell.linked(nextCell.west)
				) {
					setTimeout(() => {
						this.moveCursor('left', true);
					}, 100);
				}

				if (
					oppositeDirection !== 'right' &&
					nextCell.east &&
					nextCell.linked(nextCell.east)
				) {
					setTimeout(() => {
						this.moveCursor('right', true);
					}, 100);
				}
			} else {
				this.__cursorState = 'idle';
			}

			if (
				this.cursor.column === this.startAndEndCells[1].column &&
				this.cursor.row === this.startAndEndCells[1].row
			) {
				this.levelUp();
			} else {
				if (!this.visitedCells.has(nextCell.id)) {
					this.visitedCells.set(nextCell.id, 1);
				}
			}
		}
	}
}
