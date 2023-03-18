<script>
	import Grid from '../grid';

	const maze = new Grid(10, 10);

	const cellSize = 30;
</script>

<h1>Simply Labyrinths</h1>
<div class="grid">
	{#each maze.cells as cell}
		<div class="cell" style="left: {cell.column * cellSize}px; top: {cell.row * cellSize}px" />
	{/each}
</div>

<style>
	h1 {
		text-align: center;
	}

	.grid {
		margin: 3rem auto;
		border: 1px solid black;
		width: 300px;
		height: 300px;
		position: relative;
	}

	.cell {
		position: absolute;
		box-sizing: border-box;
		width: 30px;
		height: 30px;
		border: 1px solid black;
	}
</style>
