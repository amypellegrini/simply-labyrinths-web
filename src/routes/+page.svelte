<script>
	import binaryTree from '../binaryTree';
	import Grid from '../grid';
	import sidewinder from '../sidewinder';

	const maze = sidewinder(new Grid(10, 10));

	const cellSize = 30;

	const cursor = {
		x: 0,
		y: 0
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
	};
</script>

<h1>Simply Labyrinths</h1>

<svelte:window on:keydown={onKeyDown} />

<svg viewBox="-5 -5 310 310" width="500" style="margin: 0 auto; display: block">
	<circle
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
	{/each}
</svg>

<style>
	h1 {
		text-align: center;
	}

	svg {
		filter: drop-shadow(5px 5px 7px rgb(00 55 99));
	}
</style>
