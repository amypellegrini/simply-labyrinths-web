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

	moveCursor(direction: 'right' | 'left' | 'up' | 'down') {
		const currentCell = this.maze.grid[this.cursorRow][this.cursorColumn];

		if (direction === 'right' && currentCell.east) {
			this.cursorColumn += 1;
			this.cursorX = this.cursorToScreenCoordinates(this.cursorColumn);
		}

		if (direction === 'down' && currentCell.south) {
			this.cursorRow += 1;
			this.cursorY = this.cursorToScreenCoordinates(this.cursorRow);
		}

		if (direction === 'left' && currentCell.west) {
			this.cursorColumn -= 1;
			this.cursorX = this.cursorToScreenCoordinates(this.cursorColumn);
		}

		if (direction === 'up' && currentCell.north) {
			this.cursorRow -= 1;
			this.cursorY = this.cursorToScreenCoordinates(this.cursorRow);
		}

		const nextCell = this.maze.grid[this.cursorRow][this.cursorColumn];

		if (nextCell !== currentCell && nextCell.links.size === 2) {
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
					this.moveCursor('up');
				}, 100);
			}

			if (
				oppositeDirection !== 'down' &&
				nextCell.south &&
				nextCell.linked(nextCell.south)
			) {
				setTimeout(() => {
					this.moveCursor('down');
				}, 100);
			}

			if (
				oppositeDirection !== 'left' &&
				nextCell.west &&
				nextCell.linked(nextCell.west)
			) {
				setTimeout(() => {
					this.moveCursor('left');
				}, 100);
			}

			if (
				oppositeDirection !== 'right' &&
				nextCell.east &&
				nextCell.linked(nextCell.east)
			) {
				setTimeout(() => {
					this.moveCursor('right');
				}, 100);
			}
		}
	}
}
