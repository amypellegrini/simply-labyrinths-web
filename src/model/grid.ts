import BaseGrid from './BaseGrid';
import Cell from './cell';

type Row = Cell[];

export default class Grid extends BaseGrid<Cell> {
	rows: number;
	columns: number;
	grid: Row[];

	constructor(rows: number, columns: number) {
		super();

		this.rows = rows;
		this.columns = columns;
		this.grid = this.prepareGrid();
		this.configureCells();
	}

	prepareGrid() {
		const grid = Array.from({ length: this.rows });

		return grid.map((_, rowIdx) => {
			const row = Array.from({ length: this.columns });

			return row.map((_, colIdx) => {
				const cell = new Cell(rowIdx, colIdx);
				this.cells.push(cell);
				return cell;
			});
		});
	}

	configureCells() {
		this.cells.forEach((cell) => {
			if (this.grid[cell.row - 1]) {
				cell.north = this.grid[cell.row - 1][cell.column];
			}

			if (this.grid[cell.row + 1]) {
				cell.south = this.grid[cell.row + 1][cell.column];
			}

			if (this.grid[cell.row][cell.column + 1]) {
				cell.east = this.grid[cell.row][cell.column + 1];
			}

			if (this.grid[cell.row][cell.column - 1]) {
				cell.west = this.grid[cell.row][cell.column - 1];
			}
		});
	}
}
