<script>
	import Grid from '../model/grid';
	import wilson from '../model/wilson';
	import longestPath from '../model/longestPath';

	const debug = false;
	const cellSize = 30;

	let rows = 5;
	let columns = 5;
	let maze = wilson(new Grid(rows, columns));
	let startAndEnd = longestPath(maze);
	let visitedCells = new Map();
	let level = 1;
	let score = 0;
	let scoreDelta = 0;

	visitedCells.set(startAndEnd[0].id, 1);

	const cursor = {
		x: startAndEnd[0].column,
		y: startAndEnd[0].row
	};

	let distances = maze.cells[0].distances();

	const reset = () => {
		rows += 5;
		columns += 5;
		maze = wilson(new Grid(rows, columns));
		startAndEnd = longestPath(maze);
		visitedCells = new Map();
		level += 1;

		visitedCells.set(startAndEnd[0].id, 1);

		cursor.x = startAndEnd[0].column;
		cursor.y = startAndEnd[0].row;

		distances = maze.cells[0].distances();
	};

	const onKeyDown = (/** @type {KeyboardEvent} */ event) => {
		const cell = maze.grid[cursor.y][cursor.x];

		if (event.key === 'ArrowRight' && cell.east && cell.linked(cell.east)) {
			cursor.x += 1;
		}

		if (event.key === 'ArrowLeft' && cell.west && cell.linked(cell.west)) {
			cursor.x -= 1;
		}

		if (event.key === 'ArrowDown' && cell.south && cell.linked(cell.south)) {
			cursor.y += 1;
		}

		if (event.key === 'ArrowUp' && cell.north && cell.linked(cell.north)) {
			cursor.y -= 1;
		}

		const newCell = maze.grid[cursor.y][cursor.x];

		if (cell !== newCell) {
			if (visitedCells.has(newCell.id)) {
				scoreDelta = -5;
			} else {
				visitedCells.set(newCell.id, 1);
				scoreDelta = 3;
			}

			score += scoreDelta;
		}

		if (cursor.x === startAndEnd[1].column && cursor.y === startAndEnd[1].row) {
			reset();
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

			{#if scoreDelta > 0}
				<p class="score-delta positive">
					+{scoreDelta}
				</p>
			{/if}
			{#if scoreDelta < 0}
				<p class="score-delta negative">
					{scoreDelta}
				</p>
			{/if}
			{#if scoreDelta === 0}
				<div />
			{/if}
		</div>

		<svg
			viewBox="-5 -5 {cellSize * columns + 10} {cellSize * rows + 10}"
			class="maze"
			style="margin: 0 auto; display: block"
		>
			<circle
				class="cursor"
				cx={(cursor.x + 1) * cellSize - cellSize / 2}
				cy={(cursor.y + 1) * cellSize - cellSize / 2}
				r="7"
				fill="#990000"
			/>
			{#each maze.cells as cell}
				{#if !cell.north || (cell.north && !cell.linked(cell.north))}
					<line
						x1={cell.column * cellSize}
						y1={cell.row * cellSize}
						x2={cell.column * cellSize + cellSize}
						y2={cell.row * cellSize}
						stroke="black"
						stroke-width="3"
						stroke-linecap="square"
					/>
				{/if}
				{#if !cell.east || (cell.east && !cell.linked(cell.east))}
					<line
						stroke-width="3"
						x1={cell.column * cellSize + cellSize}
						y1={cell.row * cellSize}
						x2={cell.column * cellSize + cellSize}
						y2={cell.row * cellSize + cellSize}
						stroke="black"
						stroke-linecap="square"
					/>
				{/if}
				{#if !cell.west || (cell.west && !cell.linked(cell.west))}
					<line
						stroke-width="3"
						x1={cell.column * cellSize}
						y1={cell.row * cellSize}
						x2={cell.column * cellSize}
						y2={cell.row * cellSize + cellSize}
						stroke="black"
						stroke-linecap="square"
					/>
				{/if}
				{#if !cell.south || (cell.south && !cell.linked(cell.south))}
					<line
						stroke-width="3"
						x1={cell.column * cellSize}
						y1={cell.row * cellSize + cellSize}
						x2={cell.column * cellSize + cellSize}
						y2={cell.row * cellSize + cellSize}
						stroke="black"
						stroke-linecap="square"
					/>
				{/if}
				{#if cell.id === startAndEnd[1].id}
					<circle
						cx={(cell.column + 1) * cellSize - cellSize / 2}
						cy={(cell.row + 1) * cellSize - cellSize / 2}
						r="7"
						fill="#009900"
					/>
				{/if}
				{#if debug}
					<text
						x={cell.column * cellSize + cellSize / 2 - 5}
						y={cell.row * cellSize + cellSize / 2 + 5}
					>
						{distances.cells.get(cell)}
					</text>
				{/if}
			{/each}
		</svg>
	</div>
	<div class="aside xs-mt-1">
		<p>
			Master the art of maze navigation with Simply Labyrinths, the captivating online maze game!
		</p>
		<p>Follow these simple steps to succeed:</p>

		<ul>
			<li>Move the red circle towards the green circle using your keyboard's arrow keys.</li>
			<li>Progress through the labyrinth while collecting points for a higher score.</li>
			<li>
				Be strategic and avoid revisiting the same spot, as this will result in point deductions.
			</li>
		</ul>

		<p>
			Stay focused and skillfully guide your way through the labyrinths for an unparalleled gaming
			experience!
		</p>
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

		.maze {
			width: 100%;
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
