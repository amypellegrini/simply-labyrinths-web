import { vi, describe } from 'vitest';
import MazeGame from './MazeGame';
import Grid from './grid';
import longestPath from './longestPath';
import wilson from './wilson';

vi.useFakeTimers();

function leftJunctionGrid() {
	const grid = new Grid(5, 5);

	let currentCell = grid.cells[0];
	let nextCell = currentCell.east;

	while (nextCell) {
		currentCell.link(nextCell, true);
		currentCell = nextCell;
		nextCell = currentCell.east;

		if (currentCell.id === '0-3' && currentCell.south) {
			currentCell.link(currentCell.south, true);
		}
	}

	return grid;
}

function southJunctionGrid() {
	const grid = new Grid(5, 5);

	let currentCell = grid.cells[0];
	let nextCell = currentCell.south;

	while (nextCell) {
		currentCell.link(nextCell, true);
		currentCell = nextCell;
		nextCell = currentCell.south;

		if (currentCell.id === '3-0' && currentCell.east) {
			currentCell.link(currentCell.east, true);
		}
	}

	return grid;
}

vi.mock('./wilson', () => {
	return {
		__esModule: true,
		default: vi.fn(() => new Grid(5, 5))
	};
});

const mockWilson = wilson as jest.MockedFunction<typeof wilson>;

describe('MazeGame', () => {
	beforeEach(() => {
		mockWilson.mockClear();
	});

	it('initializes properties correctly', () => {
		const mazeGame = new MazeGame();

		expect(mazeGame.debug).toBe(false);
		expect(mazeGame.cellSize).toBe(30);
		expect(mazeGame.rows).toBe(5);
		expect(mazeGame.columns).toBe(5);
		expect(mazeGame.maze).toBeInstanceOf(Grid);
		expect(mazeGame.maze.cells.length).toBe(25);
		expect(mazeGame.score).toBe(0);
		expect(mazeGame.scoreDelta).toBe(0);
		expect(mazeGame.level).toBe(1);
		expect(mazeGame.rowsAndColumnsDelta).toBe(3);

		expect(mazeGame.cursorRow).toBe(mazeGame.startAndEndCells[0].row);
		expect(mazeGame.cursorColumn).toBe(mazeGame.startAndEndCells[0].column);

		const expectedCursorX =
			(mazeGame.cursorColumn + 1) * mazeGame.cellSize - mazeGame.cellSize / 2;

		const expectedCursorY =
			(mazeGame.cursorRow + 1) * mazeGame.cellSize - mazeGame.cellSize / 2;

		expect(mazeGame.cursorX).toBe(expectedCursorX);
		expect(mazeGame.cursorY).toBe(expectedCursorY);

		expect(wilson).toHaveBeenCalled();
	});

	it('has a start and end cells', () => {
		const mazeGame = new MazeGame();
		const expectedStartAndEndCells = longestPath(mazeGame.maze);

		expect(mazeGame.startAndEndCells).toEqual(expectedStartAndEndCells);
	});

	it('keeps track of visited cells', () => {
		const mazeGame = new MazeGame();

		expect(mazeGame.visitedCells).toBeInstanceOf(Map);
		expect(mazeGame.visitedCells.has(mazeGame.startAndEndCells[0].id)).toBe(
			true
		);
	});

	it('converts cursor coordinates to screen coordinates', () => {
		const mazeGame = new MazeGame();

		expect(mazeGame.cursorToScreenCoordinates(0)).toBe(15);
		expect(mazeGame.cursorToScreenCoordinates(1)).toBe(45);
		expect(mazeGame.cursorToScreenCoordinates(2)).toBe(75);
		expect(mazeGame.cursorToScreenCoordinates(3)).toBe(105);
		expect(mazeGame.cursorToScreenCoordinates(4)).toBe(135);
	});

	it('moves cursor to the east until the next junction', async () => {
		const timeoutSpy = vi.spyOn(global, 'setTimeout');

		mockWilson.mockImplementation(() => leftJunctionGrid());

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('right');

		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursorColumn).toBe(3);
		expect(mazeGame.cursorRow).toBe(0);
		expect(mazeGame.cursorX).toBe(105);
		expect(mazeGame.cursorY).toBe(15);
		expect(timeoutSpy).toHaveBeenCalledTimes(2);
	});

	it('moves cursor to the south until the next junction', async () => {
		mockWilson.mockImplementation(() => southJunctionGrid());

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('down');

		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursorColumn).toBe(0);
		expect(mazeGame.cursorRow).toBe(3);
		expect(mazeGame.cursorX).toBe(15);
		expect(mazeGame.cursorY).toBe(105);
	});

	// it('levels up when cursor reaches the end cell', () => {});
});
