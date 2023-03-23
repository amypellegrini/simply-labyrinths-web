<script>
	import Grid from '../grid';
	import sidewinder from '../sidewinder';
	import longestPath from '../longestPath';

	const debug = false;
	const rows = 30;
	const columns = 30;
	const maze = sidewinder(new Grid(rows, columns));
	const startAndEnd = longestPath(maze);
	const cellSize = 30;
	const visitedCells = new Map();

	let score = 0;
	let scoreDelta = 0;

	visitedCells.set(startAndEnd[0].id, 1);

	const cursor = {
		x: startAndEnd[0].column,
		y: startAndEnd[0].row
	};

	const distances = maze.cells[0].distances();

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
	};
</script>

<h1>Simply Labyrinths</h1>

<svelte:window on:keydown={onKeyDown} />

<div class="score-info">
	<p />
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
		<p />
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

<style>
	h1 {
		font-size: 2.5rem;
		text-align: center;
		font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
		text-transform: uppercase;
		font-weight: 600;
		margin: 0;
		margin-bottom: 1rem;
	}

	svg {
		filter: drop-shadow(5px 5px 7px rgb(00 55 99));
	}

	.maze {
		height: 80vh;
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
		width: 75vh;
		margin: 0 auto;
	}

	.score-info p {
		margin: 0;
		font-family: sans-serif;
		text-align: center;
		font-size: 1.5rem;
	}

	.score-info p.negative {
		color: #990000;
	}

	.score-info p.positive {
		color: #009900;
	}
</style>
