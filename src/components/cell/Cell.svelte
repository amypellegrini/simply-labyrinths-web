<script lang="ts">
	import type Cell from '../../model/cell';

	export let cell: Cell;
	export let cellSize = 30;
</script>

{#if !cell.north || (cell.north && !cell.linked(cell.north))}
	<line
		data-testid="cell-wall-north"
		x1={cell.column * cellSize}
		y1={cell.row * cellSize}
		x2={cell.column * cellSize + cellSize}
		y2={cell.row * cellSize}
		stroke="black"
		stroke-width="3"
		stroke-linecap="square"
	/>
{/if}

{#if !cell.west || (cell.west && !cell.linked(cell.west))}
	<line
		data-testid="cell-wall-west"
		stroke="black"
		stroke-width="3"
		x1={cell.column * cellSize}
		y1={cell.row * cellSize}
		x2={cell.column * cellSize}
		y2={cell.row * cellSize + cellSize}
		stroke-linecap="square"
	/>
{/if}

{#if !cell.east || (cell.east && !cell.linked(cell.east))}
	<line
		data-testid="cell-wall-east"
		stroke="black"
		stroke-width="3"
		x1={cell.column * cellSize + cellSize}
		y1={cell.row * cellSize}
		x2={cell.column * cellSize + cellSize}
		y2={cell.row * cellSize + cellSize}
		stroke-linecap="square"
	/>
{/if}

{#if !cell.south || (cell.south && !cell.linked(cell.south))}
	<line
		data-testid="cell-wall-south"
		stroke="black"
		stroke-width="3"
		x1={cell.column * cellSize}
		y1={cell.row * cellSize + cellSize}
		y2={cell.row * cellSize + cellSize}
		x2={cell.column * cellSize + cellSize}
		stroke-linecap="square"
	/>
{/if}
