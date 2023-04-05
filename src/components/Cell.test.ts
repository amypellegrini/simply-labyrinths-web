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

	test('north wall properties', () => {
		const cell = new CellModel(0, 0);

		render(Cell, { cell, cellSize: 10 });

		const northWall = screen.getByTestId('cell-wall-north');

		expect(northWall).toHaveAttribute('stroke', 'black');
		expect(northWall).toHaveAttribute('stroke-width', '3');
		expect(northWall).toHaveAttribute('stroke-linecap', 'square');
		expect(northWall).toHaveAttribute('x1', '0');
		expect(northWall.tagName).toBe('line');
	});
});
