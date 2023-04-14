import Grid from './grid';
import PolarCell from './PolarCell';

export default class PolarGrid extends Grid {
	constructor(rows: number) {
		super(rows, 1);
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

	configureCells() {
		console.log('configureCells');
	}
}
