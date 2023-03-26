import { describe, expect, it } from 'vitest';
import Grid from './grid';
import binaryTree from './binaryTree';
import longestPath from './longestPath';

describe('longestPath', () => {
	it.each([10, 15, 20, 25, 30, 35, 40, 45])(
		'returns the start and end cells of the longest path in the maze',
		(gridSize) => {
			const maze = binaryTree(new Grid(gridSize, gridSize));

			const distances = maze.cells[0].distances();

			const [cell, distance] = distances.max();
			const [startCell, endCell] = longestPath(maze);
			const max = endCell.distances().max();

			expect(endCell).toEqual(cell);
			expect(startCell).toEqual(max[0]);
			expect(distance).toBeLessThan(max[1]);
		}
	);
});
