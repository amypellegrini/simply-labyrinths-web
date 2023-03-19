import { describe, it, expect } from 'vitest';
import Cell from './cell';
import Grid from './grid';

describe('grid', () => {
	it('can be created with rows and columns', () => {
		const grid = new Grid(10, 5);

		expect(grid.rows).toEqual(10);
		expect(grid.columns).toEqual(5);
	});

	it('prepares the grid', () => {
		const grid = new Grid(2, 2);

		const cell1 = new Cell(0, 0);
		const cell2 = new Cell(0, 1);
		const cell3 = new Cell(1, 0);
		const cell4 = new Cell(1, 1);

		cell3.north = cell1;
		cell4.north = cell2;
		cell1.east = cell2;
		cell3.east = cell4;
		cell2.west = cell1;
		cell4.west = cell3;
		cell1.south = cell3;
		cell2.south = cell4;

		expect(grid.grid).toEqual([
			[cell1, cell2],
			[cell3, cell4]
		]);
	});

	it('configures the cells', () => {
		const grid = new Grid(2, 2);

		expect(grid.grid[1][0].north).toEqual(grid.grid[0][0]);
		expect(grid.grid[1][1].north).toEqual(grid.grid[0][1]);
		expect(grid.grid[0][0].east).toEqual(grid.grid[0][1]);
		expect(grid.grid[1][0].east).toEqual(grid.grid[1][1]);
		expect(grid.grid[0][1].west).toEqual(grid.grid[0][0]);
		expect(grid.grid[1][1].west).toEqual(grid.grid[1][0]);
		expect(grid.grid[0][0].south).toEqual(grid.grid[1][0]);
		expect(grid.grid[0][1].south).toEqual(grid.grid[1][1]);
	});

	it('provides the size of the grid', () => {
		const grid = new Grid(5, 5);
		expect(grid.size()).toEqual(25);
	});

	it('provides a random cell', () => {
		const grid = new Grid(5, 5);
		expect(grid.randomCell()).toBeInstanceOf(Cell);
	});
});
