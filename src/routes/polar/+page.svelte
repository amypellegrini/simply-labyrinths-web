<script lang="ts">
	import PolarGrid from '../../model/PolarGrid';
	import longestPath from '../../model/longestPath';
	import recursiveBacktracker from '../../model/recursiveBacktracker';

	const grid = recursiveBacktracker(new PolarGrid(5));
	const cellSize = 10;
	const viewBoxSize = 2 * grid.rows * cellSize;
	const center = viewBoxSize / 2;

	const startAndEndCells = longestPath(grid);
</script>

<svg style="width: 80vh;" viewBox="-5 -5 {viewBoxSize + 10} {viewBoxSize + 10}">
	<circle
		cx={center}
		cy={center}
		r={grid.rows * cellSize}
		fill="none"
		stroke="black"
	/>
	{#each grid.cells as cell}
		{@const theta = (2 * Math.PI) / grid.grid[cell.row].length}
		{@const innerRadius = cell.row * cellSize}
		{@const outerRadius = (cell.row + 1) * cellSize}
		{@const thetaCounterClockWise = theta * cell.column}
		{@const thetaClockWise = theta * (cell.column + 1)}
		{@const ax = center + innerRadius * Math.cos(thetaCounterClockWise)}
		{@const ay = center + innerRadius * Math.sin(thetaCounterClockWise)}
		{@const bx = center + outerRadius * Math.cos(thetaCounterClockWise)}
		{@const by = center + outerRadius * Math.sin(thetaCounterClockWise)}
		{@const cx = center + outerRadius * Math.cos(thetaClockWise)}
		{@const cy = center + outerRadius * Math.sin(thetaClockWise)}
		{@const dx = center + innerRadius * Math.cos(thetaClockWise)}
		{@const dy = center + innerRadius * Math.sin(thetaClockWise)}

		{#if !cell.inwards || (cell.inwards && !cell.linked(cell.inwards))}
			<path
				d="M {ax},{ay}
		A {innerRadius} {innerRadius} 0 0 1 {dx},{dy}"
				stroke="black"
				stroke-width="1"
				fill="none"
				stroke-linecap="square"
			/>
		{/if}

		{#if !cell.clockwise || (cell.clockwise && !cell.linked(cell.clockwise))}
			<line
				x1={dx}
				y1={dy}
				x2={cx}
				y2={cy}
				stroke="black"
				stroke-linecap="square"
			/>
		{/if}
	{/each}
</svg>
