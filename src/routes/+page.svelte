<script lang="ts">
	import { onMount } from 'svelte';

	import MazeGame from '../components/mazeGame/MazeGame.svelte';

	let isClient = false;

	onMount(() => {
		isClient = true;
	});
</script>

{#if !isClient}
	<header class="header">
		<h1>Simply Labyrinths</h1>
	</header>
{/if}

{#if isClient}
	<MazeGame />
{/if}

<style>
	* {
		font-family: 'Roboto', Arial, Helvetica, sans-serif;
	}

	h1 {
		font-size: 1.8rem;
		text-align: center;
		font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
		text-transform: uppercase;
		font-weight: 600;
		margin: 0;
		margin-bottom: 1rem;
	}

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

	.header h1 {
		flex-grow: 1;
		text-align: center;
	}

	@media (min-width: 1025px) {
		h1 {
			font-size: 2.5rem;
		}

		.header {
			justify-content: space-between;
			display: flex;
		}
	}
</style>
