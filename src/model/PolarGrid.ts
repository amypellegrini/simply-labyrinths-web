/* eslint-disable @typescript-eslint/ban-ts-comment */
import type Cell from './cell';
import PolarCell from './PolarCell';

type Row = PolarCell[];

export default class PolarGrid {
	rows: number;
	columns: number;
	grid: Row[];
	cells: PolarCell[];

	constructor(rows: number) {
		this.rows = rows;
		this.columns = 1;
		this.cells = [];
		this.grid = this.prepareGrid();
		this.configureCells();
	}

	prepareGrid() {
		const rows: PolarCell[][] = Array.from({ length: this.rows });
		const rowHeight = 1 / this.rows;
		rows[0] = [new PolarCell(0, 0)];

		for (let rowIdx = 1; rowIdx < this.rows; rowIdx++) {
			const radius = rowIdx / this.rows;
			const circumference = 2 * Math.PI * radius;
			const previousCount = rows[rowIdx - 1] ? rows[rowIdx - 1].length : 0;
			const estimatedCellWidth = circumference / previousCount;
			const ratio = Math.round(estimatedCellWidth / rowHeight);

			const cells = previousCount * ratio;
			const row: PolarCell[] = Array.from({ length: cells });

			row.forEach((_, colIdx) => {
				const cell = new PolarCell(rowIdx, colIdx);
				row[colIdx] = cell;
				this.cells.push(cell);
				return cell;
			});

			rows[rowIdx] = row;
		}

		return rows;
	}

	isPolarCell(cell: Cell): cell is PolarCell {
		return (
			'clockwise' in cell &&
			'counterClockwise' in cell &&
			'inwards' in cell &&
			'outwards' in cell
		);
	}

	configureCells() {
		const cells = this.cells as unknown as PolarCell[];

		cells.forEach((cell: PolarCell) => {
			const row = cell.row;
			const col = cell.column;
			if (row > 0) {
				cell.clockwise = this.grid[row][col + 1];
				cell.counterClockwise = this.grid[row][col - 1];

				const ratio = this.grid[row].length / this.grid[row - 1].length;
				const parent = this.grid[row - 1][Math.floor(col / ratio)];

				parent.outwards.push(cell);

				cell.inwards = parent;
			}
		});
	}
}
