<script lang="ts">
	import type Cell from '../model/cell';

	export let cell: Cell;
	export let cellSize = 30;
</script>

{#if !cell.north || (cell.north && !cell.linked(cell.north))}
	<line
		data-testid="cell-wall-north"
		x1={0}
		stroke="black"
		stroke-width="3"
		stroke-linecap="square"
	/>
{/if}

{#if !cell.east || (cell.east && !cell.linked(cell.east))}
	<line data-testid="cell-wall" stroke="black" stroke-width="3" stroke-linecap="square" />
{/if}

{#if !cell.east || (cell.west && !cell.linked(cell.west))}
	<line data-testid="cell-wall" stroke="black" stroke-width="3" stroke-linecap="square" />
{/if}

{#if !cell.south || (cell.south && !cell.linked(cell.south))}
	<line data-testid="cell-wall" stroke="black" stroke-width="3" stroke-linecap="square" />
{/if}
