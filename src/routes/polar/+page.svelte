<script lang="ts">
	import PolarGrid from '../../model/PolarGrid';

	const grid = new PolarGrid(5);
	const cellSize = 10;
	const viewBoxSize = 2 * grid.rows * cellSize;
	const center = viewBoxSize / 2;
</script>

<svg style="width: 80vh;" viewBox="-5 -5 {viewBoxSize + 10} {viewBoxSize + 10}">
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

		<path
			d="M {ax} {ay}
       A {innerRadius} {innerRadius} 0 0 1 {dx} {dy}
       L {cx} {cy}
       A {outerRadius} {outerRadius} 0 0 0 {bx} {by}
       Z"
			fill="white"
			stroke="black"
		/>
	{/each}
</svg>
