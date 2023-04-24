import recursiveBacktracker from './recursiveBacktracker';
import wilson from './wilson';
import huntAndKill from './huntAndKill';
import random from './random';
import type Grid from './grid';

export default function generateMaze(grid: Grid) {
	const algos = [recursiveBacktracker, wilson, huntAndKill];

	return algos[random(0, algos.length - 1)](grid);
}
