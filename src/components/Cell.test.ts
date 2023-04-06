import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/svelte';

import { default as CellModel } from '../model/cell';
import Cell from './Cell.svelte';

describe('Cell', () => {
	it('renders all walls when cell has no neighbours', () => {
		const cell = new CellModel(0, 0);

		render(Cell, { cell });
		expect(screen.queryAllByTestId(/cell-wall/).length).toBe(4);
	});

	it('renders no walls if all walls are linked', () => {
		const cell = new CellModel(0, 0);

		const cellNorth = new CellModel(0, 1);
		const cellSouth = new CellModel(0, -1);
		const cellEast = new CellModel(1, 0);
		const cellWest = new CellModel(-1, 0);

		cell.north = cellNorth;
		cell.south = cellSouth;
		cell.east = cellEast;
		cell.west = cellWest;

		cell.link(cell.north);
		cell.link(cell.south);
		cell.link(cell.east);
		cell.link(cell.west);

		render(Cell, { cell });

		expect(cell.links.size).toBe(4);
		expect(screen.queryAllByTestId(/cell-wall/).length).toBe(0);
	});

	test.each([
		[0, 0, '0', '0', '10', '0'],
		[0, 1, '10', '0', '20', '0'],
		[1, 0, '0', '10', '10', '10'],
		[1, 1, '10', '10', '20', '10']
	])('north wall properties', (rows, columns, x1, y1, x2, y2) => {
		const cell = new CellModel(rows, columns);

		render(Cell, { cell, cellSize: 10 });

		const northWall = screen.getByTestId('cell-wall-north');

		expect(northWall).toHaveAttribute('stroke', 'black');
		expect(northWall).toHaveAttribute('stroke-width', '3');
		expect(northWall).toHaveAttribute('stroke-linecap', 'square');
		expect(northWall).toHaveAttribute('x1', x1);
		expect(northWall).toHaveAttribute('y1', y1);
		expect(northWall).toHaveAttribute('x2', x2);
		expect(northWall).toHaveAttribute('y2', y2);
		expect(northWall.tagName).toBe('line');
	});

	test.each([
		[0, 0, '0', '10', '10', '10'],
		[0, 1, '10', '10', '20', '10'],
		[1, 0, '0', '20', '10', '20'],
		[1, 1, '10', '20', '20', '20']
	])('south wall properties', (rows, columns, x1, y1, x2, y2) => {
		const cell = new CellModel(rows, columns);

		render(Cell, { cell, cellSize: 10 });

		const southWall = screen.getByTestId('cell-wall-south');

		expect(southWall).toHaveAttribute('stroke', 'black');
		expect(southWall).toHaveAttribute('stroke-width', '3');
		expect(southWall).toHaveAttribute('stroke-linecap', 'square');
		expect(southWall).toHaveAttribute('x1', x1);
		expect(southWall).toHaveAttribute('y1', y1);
		expect(southWall).toHaveAttribute('x2', x2);
		expect(southWall).toHaveAttribute('y2', y2);
		expect(southWall.tagName).toBe('line');
	});

	test.each([
		[0, 0, '10', '0', '10', '10'],
		[1, 0, '10', '10', '10', '20'],
		[0, 1, '20', '0', '20', '10'],
		[1, 1, '20', '10', '20', '20']
	])(`east wall properties`, (rows, columns, x1, y1, x2, y2) => {
		const cell = new CellModel(rows, columns);

		render(Cell, { cell, cellSize: 10 });

		const eastWall = screen.getByTestId('cell-wall-east');

		expect(eastWall).toHaveAttribute('stroke', 'black');
		expect(eastWall).toHaveAttribute('stroke-width', '3');
		expect(eastWall).toHaveAttribute('stroke-linecap', 'square');
		expect(eastWall).toHaveAttribute('x1', x1);
		expect(eastWall).toHaveAttribute('y1', y1);
		expect(eastWall).toHaveAttribute('x2', x2);
		expect(eastWall).toHaveAttribute('y2', y2);
		expect(eastWall.tagName).toBe('line');
	});

	test.each([
		[0, 0, '0', '0', '0', '10'],
		[1, 0, '0', '10', '0', '20'],
		[0, 1, '10', '0', '10', '10'],
		[1, 1, '10', '10', '10', '20']
	])(`west wall properties`, (rows, columns, x1, y1, x2, y2) => {
		const cell = new CellModel(rows, columns);

		render(Cell, { cell, cellSize: 10 });

		const westWall = screen.getByTestId('cell-wall-west');

		expect(westWall).toHaveAttribute('stroke', 'black');
		expect(westWall).toHaveAttribute('stroke-width', '3');
		expect(westWall).toHaveAttribute('stroke-linecap', 'square');
		expect(westWall).toHaveAttribute('x1', x1);
		expect(westWall).toHaveAttribute('y1', y1);
		expect(westWall).toHaveAttribute('x2', x2);
		expect(westWall).toHaveAttribute('y2', y2);
		expect(westWall.tagName).toBe('line');
	});
});
