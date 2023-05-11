import type Cell from './cell';
import generateMaze from './generateMaze';
import Grid from './grid';
import longestPath from './longestPath';

export type Cursor = {
	row: number;
	column: number;
};

type Direction = 'right' | 'left' | 'up' | 'down';

export default class MazeGame {
	private __cursorState: 'idle' | 'moving' = 'idle';

	debug = false;

	columns = 5;
	rows = 5;

	maze: Grid = generateMaze(new Grid(this.rows, this.columns));
	startAndEndCells: Cell[] = longestPath(this.maze);
	cursor: Cursor;

	cellSize = 30;

	level = 1;
	score = 0;
	scoreDelta = 0;
	rowsAndColumnsDelta = 3;

	visitedCells: Map<string, number> = new Map<string, number>();

	onCursorUpdate?: (cursor: Cursor) => void;
	onLevelUp?: (level: number) => void;

	mazePowerUps: Map<string, string> = new Map<string, string>();
	powerUps = {
		chalk: 0
	};

	constructor(level = 1) {
		const { row, column } = this.startAndEndCells[0];

		this.visitedCells.set(this.startAndEndCells[0].id, 1);

		this.cursor = {
			row: row,
			column: column
		};

		if (level && level > 1) {
			this.level = level;
			this.rows = 5 + (level - 1) * this.rowsAndColumnsDelta;
			this.columns = 5 + (level - 1) * this.rowsAndColumnsDelta;
			this.__initLevel();
		}
	}

	private __initLevel() {
		this.maze = generateMaze(new Grid(this.rows, this.columns));

		this.startAndEndCells = longestPath(this.maze);
		this.visitedCells = new Map<string, number>();
		this.visitedCells.set(this.startAndEndCells[0].id, 1);

		const { row, column } = this.startAndEndCells[0];

		if (this.level === 5) {
			const cell = this.maze.randomCell();
			this.mazePowerUps.set(cell.id, 'chalk');
		}

		this.cursor = {
			row: row,
			column: column
		};
	}

	cursorToScreenCoordinates(rowOrColumn: number) {
		return (rowOrColumn + 1) * this.cellSize - this.cellSize / 2;
	}

	levelUp() {
		this.rows += this.rowsAndColumnsDelta;
		this.columns += this.rowsAndColumnsDelta;
		this.level += 1;

		this.__initLevel();

		this.onLevelUp?.(this.level);
	}

	private __navigationConfig: {
		[key: string]: {
			isLinked: (cell: Cell) => boolean;
			cursorUpdate: { property: 'row' | 'column'; value: number };
		};
	} = {
		right: {
			isLinked: (cell: Cell) => (cell.east && cell.linked(cell.east)) || false,
			cursorUpdate: {
				property: 'column',
				value: 1
			}
		},
		left: {
			isLinked: (cell: Cell) => (cell.west && cell.linked(cell.west)) || false,
			cursorUpdate: {
				property: 'column',
				value: -1
			}
		},
		up: {
			isLinked: (cell: Cell) =>
				(cell.north && cell.linked(cell.north)) || false,
			cursorUpdate: {
				property: 'row',
				value: -1
			}
		},
		down: {
			isLinked: (cell: Cell) =>
				(cell.south && cell.linked(cell.south)) || false,
			cursorUpdate: {
				property: 'row',
				value: 1
			}
		}
	};

	private __handleCursorMovement(direction: Direction, currentCell: Cell) {
		const { isLinked, cursorUpdate } = this.__navigationConfig[direction];

		if (isLinked(currentCell)) {
			this.cursor[cursorUpdate.property] += cursorUpdate.value;
		}
	}

	moveCursor(direction: Direction, bypassStateCheck = false) {
		if (this.__cursorState === 'moving' && !bypassStateCheck) {
			return;
		}

		const currentCell = this.maze.grid[this.cursor.row][this.cursor.column];

		this.__handleCursorMovement(direction, currentCell);

		const nextCell = this.maze.grid[this.cursor.row][this.cursor.column];

		if (nextCell !== currentCell) {
			this.__cursorState = 'moving';

			if (this.mazePowerUps.has(nextCell.id)) {
				this.mazePowerUps.delete(nextCell.id);
				this.powerUps.chalk += 3;
			}

			if (this.visitedCells.has(nextCell.id)) {
				this.scoreDelta = -5;
			} else {
				this.scoreDelta = 3;
			}

			this.score += this.scoreDelta;

			this.onCursorUpdate?.(this.cursor);

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
				setTimeout(() => {
					this.levelUp();
				}, 350);
			} else {
				if (!this.visitedCells.has(nextCell.id)) {
					this.visitedCells.set(nextCell.id, 1);
				}
			}
		}
	}
}
