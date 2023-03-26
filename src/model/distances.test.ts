import { describe, expect, it } from 'vitest';
import Cell from './cell';
import Distances from './distances';

describe('Distances', () => {
	it('accepts a root cell as a starting point', () => {
		const root = new Cell(0, 0);
		const distances = new Distances(root);

		expect(distances.root).toEqual(root);
	});

	it('records the distance from the root cell as zero', () => {
		const root = new Cell(0, 0);
		const distances = new Distances(root);

		expect(distances.cells.get(root)).toEqual(0);
	});

	it('has a method to record the distance of any cell', () => {
		const cell = new Cell(0, 1);
		const root = new Cell(0, 0);
		const distances = new Distances(root);

		distances.setCellDistance(cell, 1);

		expect(distances.cells.get(cell)).toEqual(1);
	});

	it('can get the longest distance from the root', () => {
		const root = new Cell(0, 0);
		const cell1 = new Cell(0, 1);
		const cell2 = new Cell(0, 2);
		const cell3 = new Cell(0, 3);

		const distances = new Distances(root);

		distances.setCellDistance(cell1, 1);
		distances.setCellDistance(cell2, 2);
		distances.setCellDistance(cell3, 3);

		expect(distances.max()).toEqual([cell3, 3]);
	});
});
