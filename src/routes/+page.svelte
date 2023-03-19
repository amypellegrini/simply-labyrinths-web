<script>
	import binaryTree from '../binaryTree';
	import Grid from '../grid';
	import sidewinder from '../sidewinder';

	const maze = sidewinder(new Grid(10, 10));

	const cellSize = 30;
</script>

<h1>Simply Labyrinths</h1>
<svg viewBox="-5 -5 310 310" width="500" style="margin: 0 auto; display: block">
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
