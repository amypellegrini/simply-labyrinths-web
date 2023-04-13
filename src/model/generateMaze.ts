import recursiveBacktracker from './recursiveBacktracker';
import wilson from './wilson';
import huntAndKill from './huntAndKill';
import sidewinder from './sidewinder';
import random from './random';
import type Grid from './grid';

export default function generateMaze(grid: Grid) {
	const algos = [recursiveBacktracker, wilson, huntAndKill, sidewinder];

	return algos[random(0, algos.length - 1)](grid);
}
