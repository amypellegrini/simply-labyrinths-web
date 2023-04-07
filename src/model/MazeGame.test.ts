import { vi, describe } from 'vitest';
import MazeGame from './MazeGame';
import Grid from './grid';
import longestPath from './longestPath';
import wilson from './wilson';

vi.mock('./wilson', () => {
	return {
		__esModule: true,
		default: vi.fn(() => new Grid(5, 5))
	};
});

describe('MazeGame', () => {
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
		expect(mazeGame.visitedCells.has(mazeGame.startAndEndCells[0].id)).toBe(true);
	});
});
