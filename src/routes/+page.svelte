<script lang="ts">
	import type Grid from '../model/grid';
	import Cell from '../components/Cell.svelte';
	import MazeGame, { type Cursor } from '../model/MazeGame';

	const mazeGame = new MazeGame();

	let cursor: Cursor = mazeGame.cursor;
	let level: number = mazeGame.level;
	let score: number = mazeGame.score;
	let cellSize: number = mazeGame.cellSize;
	let columns: number = mazeGame.columns;
	let rows: number = mazeGame.rows;
	let maze: Grid = mazeGame.maze;
	let startAndEndCells = mazeGame.startAndEndCells;
	let distances = mazeGame.maze.cells[0].distances();

	mazeGame.onCursorUpdate = (updatedCursor: Cursor) => {
		score = mazeGame.score;
		cursor = updatedCursor;
	};

	mazeGame.onLevelUp = (newLevel) => {
		cellSize = mazeGame.cellSize;
		columns = mazeGame.columns;
		rows = mazeGame.rows;
		maze = mazeGame.maze;
		startAndEndCells = mazeGame.startAndEndCells;
		cursor = mazeGame.cursor;
		distances = mazeGame.maze.cells[0].distances();
		level = newLevel;
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowRight') {
			mazeGame.moveCursor('right');
		}

		if (event.key === 'ArrowLeft') {
			mazeGame.moveCursor('left');
		}

		if (event.key === 'ArrowDown') {
			mazeGame.moveCursor('down');
		}

		if (event.key === 'ArrowUp') {
			mazeGame.moveCursor('up');
		}
	};

	/**
	 * @type {number}
	 */
	let touchStartX: number;

	/**
	 * @type {number}
	 */
	let touchStartY: number;

	/**
	 * @type {number}
	 */
	let touchEndX: number;

	/**
	 * @type {number}
	 */
	let touchEndY: number;

	const minSwipeDistance = 25;

	const validateSwipe = () => {
		const deltaX = touchEndX - touchStartX;
		const deltaY = touchEndY - touchStartY;

		if (
			Math.abs(deltaX) > minSwipeDistance ||
			Math.abs(deltaY) > minSwipeDistance
		) {
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				if (deltaX > 0) {
					mazeGame.moveCursor('right');
				} else {
					mazeGame.moveCursor('left');
				}
			} else {
				if (deltaY > 0) {
					mazeGame.moveCursor('down');
				} else {
					mazeGame.moveCursor('up');
				}
			}
		}
	};

	const onTouch = (event: TouchEvent) => {
		event.preventDefault();

		switch (event.type) {
			case 'touchstart':
				touchStartX = event.touches[0].clientX;
				touchStartY = event.touches[0].clientY;
				break;
			case 'touchend':
				touchEndX = event.changedTouches[0].clientX;
				touchEndY = event.changedTouches[0].clientY;
				validateSwipe();
				break;
			default:
				break;
		}
	};
</script>

<header class="header">
	<div />
	<h1>Simply Labyrinths</h1>
	<p>Level {level}</p>
</header>

<svelte:window on:keydown={onKeyDown} />

<div class="main">
	<div class="aside" />

	<div class="main-body">
		<div class="score-info">
			<div class="aside" />
			<p class="score">{score}</p>

			{#if mazeGame.scoreDelta > 0}
				<p class="score-delta positive">
					+{mazeGame.scoreDelta}
				</p>
			{/if}
			{#if mazeGame.scoreDelta < 0}
				<p class="score-delta negative">
					{mazeGame.scoreDelta}
				</p>
			{/if}
			{#if mazeGame.scoreDelta === 0}
				<div />
			{/if}
		</div>

		<svg
			viewBox="-5 -5 {cellSize * columns + 10} {cellSize * rows + 10}"
			class="maze"
			on:touchstart={onTouch}
			on:touchend={onTouch}
		>
			<circle
				cx={(startAndEndCells[1].column + 1) * cellSize - cellSize / 2}
				cy={(startAndEndCells[1].row + 1) * cellSize - cellSize / 2}
				r="7"
				fill="#009900"
			/>

			{#each maze.cells as cell}
				<Cell {cell} {cellSize} />

				{#if mazeGame.debug}
					<text
						x={cell.column * cellSize + cellSize / 2 - 5}
						y={cell.row * cellSize + cellSize / 2 + 5}
					>
						{distances.cells.get(cell)}
					</text>
				{/if}
			{/each}

			<circle
				class="cursor"
				cx={mazeGame.cursorToScreenCoordinates(cursor.column)}
				cy={mazeGame.cursorToScreenCoordinates(cursor.row)}
				r="7"
				fill="#990000"
			/>
		</svg>
	</div>

	<div class="aside xs-mt-1">
		{#if mazeGame.level === 1}
			<p>
				Master the art of maze navigation with Simply Labyrinths, the
				captivating online maze game!
			</p>
			<p>Follow these simple steps to succeed:</p>

			<ul>
				<li>
					Move the red circle towards the green circle using your keyboard's
					arrow keys (or swipe over the maze if using a mobile device).
				</li>
				<li>
					Progress through the labyrinth while collecting points for a higher
					score.
				</li>
				<li>
					Be strategic and avoid revisiting the same spot, as this will result
					in point deductions.
				</li>
			</ul>

			<p>
				Stay focused and skillfully guide your way through the labyrinths for an
				unparalleled gaming experience!
			</p>
		{/if}
	</div>
</div>

<style>
	h1 {
		font-size: 1.8rem;
		text-align: center;
		font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
		text-transform: uppercase;
		font-weight: 600;
		margin: 0;
		margin-bottom: 1rem;
	}

	p,
	ul,
	li {
		font-size: 1rem;
		font-family: 'Roboto', Arial, Helvetica, sans-serif;
	}

	p {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	.header p {
		font-family: Arial, Helvetica, sans-serif;
		text-align: center;
		margin-bottom: 1rem;
	}

	.score-info p.negative {
		color: #990000;
	}

	.score-info p.positive {
		color: #009900;
	}

	.score-info {
		display: flex;
		justify-content: space-between;
		margin: 0 auto;
	}

	.score-info > p {
		margin: 0;
		font-family: sans-serif;
		text-align: center;
		font-size: 1.5rem;
		width: 30%;
	}

	.score-info > p:last-child {
		text-align: right;
	}

	.score-info > div {
		width: 30%;
	}

	.aside {
		width: 100%;
	}

	.xs-mt-1 {
		margin-top: 1rem;
	}

	.score-info {
		padding: 0 1rem;
	}

	.main-body {
		max-width: 80vh;
	}

	.maze {
		width: 100%;
		max-height: 80vh;
		margin: 0 auto;
		display: block;
	}

	@media (min-width: 640px) {
		.xs-mt-1 {
			margin-top: unset;
		}
	}

	@media (min-width: 1025px) {
		h1 {
			font-size: 2.5rem;
		}

		.main {
			display: flex;
			justify-content: space-between;
		}

		.score {
			margin: 0;
			font-family: sans-serif;
			text-align: center;
			font-size: 1.5rem;
		}

		.cursor {
			box-shadow: inset 3px 3px 3px rgb(33 00 00);
		}

		.score-info {
			display: flex;
			justify-content: space-between;
			margin: 0 auto;
		}

		.header {
			justify-content: space-between;
			display: flex;
		}

		.main-body {
			width: 60%;
		}

		.aside {
			margin-top: 0;
			width: 20%;
		}
	}
</style>
