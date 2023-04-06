import type Cell from './cell';
import Grid from './grid';
import longestPath from './longestPath';

export default class MazeGame {
	debug = false;
	cellSize = 30;
	columns = 5;
	rows = 5;
	level = 1;
	score = 0;
	scoreDelta = 0;
	visitedCells = new Map<string, number>();
	maze = new Grid(this.rows, this.columns);
	startAndEndCells = longestPath(this.maze);

	constructor() {
		this.visitedCells.set(this.startAndEndCells[0].id, 1);
	}
}
