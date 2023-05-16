import { vi, describe } from 'vitest';
import MazeGame from './MazeGame';
import Grid from './grid';
import longestPath from './longestPath';
import generateMaze from './generateMaze';

vi.useFakeTimers();

function leftJunctionGrid(optionalGrid?: Grid) {
	const grid = optionalGrid || new Grid(5, 5);

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

function southJunctionGrid(optionalGrid?: Grid) {
	const grid = optionalGrid || new Grid(5, 5);

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

function northJunctionGrid(optionalGrid?: Grid) {
	const grid = southJunctionGrid(optionalGrid);

	grid.grid[1][1].link(grid.grid[1][0], true);

	return grid;
}

vi.mock('./generateMaze', () => {
	return {
		__esModule: true,
		default: vi.fn(() => new Grid(5, 5))
	};
});

const mockGenerateMaze = generateMaze as jest.MockedFunction<
	typeof generateMaze
>;

describe('MazeGame', () => {
	beforeEach(() => {
		mockGenerateMaze.mockClear();
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
		expect(mazeGame.cursor.row).toBe(mazeGame.startAndEndCells[0].row);
		expect(mazeGame.cursor.column).toBe(mazeGame.startAndEndCells[0].column);
		expect(mazeGame.mazePowerUps.size).toBe(0);

		expect(generateMaze).toHaveBeenCalled();
	});

	it('can be initialized to a given level', () => {
		const mazeGame = new MazeGame(2);

		expect(mazeGame.level).toBe(2);
		expect(mazeGame.rows).toBe(8);
		expect(mazeGame.columns).toBe(8);
	});

	it('has a start and end cells', () => {
		const mazeGame = new MazeGame();
		const expectedStartAndEndCells = longestPath(mazeGame.maze);

		expect(mazeGame.startAndEndCells).toEqual(expectedStartAndEndCells);
	});

	it('keeps track of visited cells', () => {
		mockGenerateMaze.mockImplementation(() => southJunctionGrid());

		const mazeGame = new MazeGame();

		expect(mazeGame.visitedCells).toBeInstanceOf(Map);
		expect(mazeGame.visitedCells.has(mazeGame.startAndEndCells[0].id)).toBe(
			true
		);

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.visitedCells.has('1-0')).toBe(true);
		expect(mazeGame.visitedCells.has('2-0')).toBe(true);
		expect(mazeGame.visitedCells.has('3-0')).toBe(true);
		expect(mazeGame.visitedCells.size).toBe(4);
	});

	it('converts cursor coordinates to screen coordinates', () => {
		const mazeGame = new MazeGame();

		expect(mazeGame.cursorToScreenCoordinates(0)).toBe(15);
		expect(mazeGame.cursorToScreenCoordinates(1)).toBe(45);
		expect(mazeGame.cursorToScreenCoordinates(2)).toBe(75);
		expect(mazeGame.cursorToScreenCoordinates(3)).toBe(105);
		expect(mazeGame.cursorToScreenCoordinates(4)).toBe(135);
	});

	it('moves cursor to the east until the next junction', () => {
		const timeoutSpy = vi.spyOn(global, 'setTimeout');

		mockGenerateMaze.mockImplementation(() => leftJunctionGrid());

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('right');

		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(3);
		expect(mazeGame.cursor.row).toBe(0);
		expect(timeoutSpy).toHaveBeenCalledTimes(2);
	});

	it('moves cursor to the east until the next wall', async () => {
		const timeoutSpy = vi.spyOn(global, 'setTimeout');

		mockGenerateMaze.mockImplementation(() => leftJunctionGrid());

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('right');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('right');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(4);
		expect(timeoutSpy).toHaveBeenCalledTimes(2);
	});

	it('moves cursor to the west until the next junction', async () => {
		mockGenerateMaze.mockImplementation(() =>
			southJunctionGrid(leftJunctionGrid())
		);
		const timeoutSpy = vi.spyOn(global, 'setTimeout');

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('left');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('up');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('left');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(0);
		expect(mazeGame.cursor.row).toBe(3);
		expect(timeoutSpy).toHaveBeenCalledTimes(10);
	});

	it('moves cursor to the south until the next junction', async () => {
		const timeoutSpy = vi.spyOn(global, 'setTimeout');
		mockGenerateMaze.mockImplementation(() => southJunctionGrid());

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(0);
		expect(mazeGame.cursor.row).toBe(3);
		expect(timeoutSpy).toHaveBeenCalledTimes(2);
	});

	it('moves cursor to the south until the next wall', async () => {
		const timeoutSpy = vi.spyOn(global, 'setTimeout');

		mockGenerateMaze.mockImplementation(() => southJunctionGrid());

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.row).toBe(4);
		expect(timeoutSpy).toHaveBeenCalledTimes(2);
	});

	it('moves cursor to the north until the next junction', async () => {
		const timeoutSpy = vi.spyOn(global, 'setTimeout');

		mockGenerateMaze.mockImplementation(() => northJunctionGrid());

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('up');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(0);
		expect(mazeGame.cursor.row).toBe(1);
		expect(timeoutSpy).toHaveBeenCalledTimes(2);
	});

	it('moves cursor north then east until the next junction', async () => {
		const timeoutSpy = vi.spyOn(global, 'setTimeout');

		mockGenerateMaze.mockImplementation(() => {
			return southJunctionGrid(leftJunctionGrid());
		});

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('left');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('up');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(3);
		expect(mazeGame.cursor.row).toBe(0);
		expect(timeoutSpy).toHaveBeenCalledTimes(5);
	});

	it('cannot move cursor right if cell to the right is a wall', () => {
		mockGenerateMaze.mockImplementation(() => {
			return southJunctionGrid();
		});

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('right');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(0);
		expect(mazeGame.cursor.row).toBe(0);
	});

	it('cannot move cursor up if cell up is a wall', () => {
		mockGenerateMaze.mockImplementation(() => {
			return northJunctionGrid();
		});

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('right');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('up');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(1);
		expect(mazeGame.cursor.row).toBe(1);
	});

	it('cannot move cursor down if cell down is a wall', () => {
		mockGenerateMaze.mockImplementation(() => {
			return leftJunctionGrid();
		});

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(0);
		expect(mazeGame.cursor.row).toBe(0);
	});

	it('cannot move cursor left if cell left is a wall', () => {
		mockGenerateMaze.mockImplementation(() => {
			const grid = leftJunctionGrid();

			grid.grid[1][1].link(grid.grid[0][1], true);

			return grid;
		});

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('right');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('left');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(1);
		expect(mazeGame.cursor.row).toBe(1);
	});

	it('cannot accept cursor movements while it is moving', () => {
		const timeoutSpy = vi.spyOn(global, 'setTimeout');
		mockGenerateMaze.mockImplementation(() => southJunctionGrid());

		const mazeGame = new MazeGame();

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(100);

		mazeGame.moveCursor('up');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.cursor.column).toBe(0);
		expect(mazeGame.cursor.row).toBe(3);
		expect(timeoutSpy).toHaveBeenCalledTimes(2);
	});

	it('levels up when cursor reaches the end cell', () => {
		mockGenerateMaze.mockImplementation(() => southJunctionGrid());
		const onLevelAppMock = vi.fn();

		const mazeGame = new MazeGame();

		mazeGame.onLevelUp = onLevelAppMock;

		mockGenerateMaze.mockImplementation(() =>
			southJunctionGrid(new Grid(8, 8))
		);

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('right');
		vi.advanceTimersByTime(10000);

		const expectedStartAndEndCells = longestPath(mazeGame.maze);

		expect(mazeGame.startAndEndCells).toEqual(expectedStartAndEndCells);
		expect(mazeGame.visitedCells.size).toBe(1);
		expect(mazeGame.level).toBe(2);
		expect(mazeGame.rows).toBe(8);
		expect(mazeGame.columns).toBe(8);
		expect(mazeGame.cursor.column).toBe(mazeGame.startAndEndCells[0].column);
		expect(mockGenerateMaze).toHaveBeenCalledTimes(2);
		expect(onLevelAppMock).toHaveBeenCalledTimes(1);
		expect(onLevelAppMock).toHaveBeenCalledWith(2);
	});

	it('keeps increasing level and grid size when levelling up', () => {
		const mazeGame = new MazeGame();

		mazeGame.levelUp();

		expect(mazeGame.level).toBe(2);
		expect(mazeGame.rows).toBe(8);
		expect(mazeGame.columns).toBe(8);

		mazeGame.levelUp();

		expect(mazeGame.level).toBe(3);
		expect(mazeGame.rows).toBe(11);
		expect(mazeGame.columns).toBe(11);

		mazeGame.levelUp();

		expect(mazeGame.level).toBe(4);
		expect(mazeGame.rows).toBe(14);
		expect(mazeGame.columns).toBe(14);
	});

	it('increases the score by 3 for every cursor movement', () => {
		mockGenerateMaze.mockImplementation(() => southJunctionGrid());

		const mazeGame = new MazeGame();

		expect(mazeGame.score).toBe(0);
		expect(mazeGame.scoreDelta).toBe(0);

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.score).toBe(9);
		expect(mazeGame.scoreDelta).toBe(3);
	});

	it('decreases the score by 5 for visiting the same place', () => {
		mockGenerateMaze.mockImplementation(() => southJunctionGrid());

		const mazeGame = new MazeGame();

		expect(mazeGame.score).toBe(0);
		expect(mazeGame.scoreDelta).toBe(0);

		mazeGame.moveCursor('down');
		vi.advanceTimersByTime(10000);

		mazeGame.moveCursor('up');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.score).toBe(-6);
		expect(mazeGame.scoreDelta).toBe(-5);
	});

	it('adds a chalk powerup in level 5', () => {
		const mazeGame = new MazeGame(5);

		const powerUpKey = mazeGame.mazePowerUps.keys().next().value;

		expect(mazeGame.mazePowerUps.get(powerUpKey)).toEqual('chalk');
	});

	it('picks the chalk powerup when the cursor visits it', () => {
		mockGenerateMaze.mockImplementation(() => {
			const grid = new Grid(1, 2);
			grid.grid[0][0].link(grid.grid[0][1], true);
			return grid;
		});

		const mazeGame = new MazeGame();

		mazeGame.mazePowerUps.set('0-1', 'chalk');

		expect(mazeGame.powerUps.chalk).toBe(0);

		mazeGame.moveCursor('right');
		vi.advanceTimersByTime(10000);

		expect(mazeGame.mazePowerUps.has('0-1')).toBe(false);
		expect(mazeGame.mazePowerUps.get('chalk')).toBe(undefined);
		expect(mazeGame.powerUps.chalk).toBe(3);
	});

	it("allows to use the chalk powerup when it's available", () => {
		mockGenerateMaze.mockImplementation(() => {
			const grid = new Grid(1, 2);
			grid.grid[0][0].link(grid.grid[0][1], true);
			return grid;
		});

		const mazeGame = new MazeGame();

		mazeGame.mazePowerUps.set('0-1', 'chalk');
		mazeGame.moveCursor('right');
		vi.advanceTimersByTime(10000);

		mazeGame.usePowerUp('chalk');

		expect(mazeGame.powerUps.chalk).toBe(2);
	});
});
