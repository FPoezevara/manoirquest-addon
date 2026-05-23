<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	let selectedPlayer: { id: number; name: string; avatar: string } | null = null;
	let pin = '';
	let pinInputs: HTMLInputElement[] = [];

	function selectPlayer(p: typeof data.players[0]) {
		selectedPlayer = p;
		pin = '';
		setTimeout(() => pinInputs[0]?.focus(), 50);
	}

	function addDigit(d: string) {
		if (pin.length < 4) pin += d;
	}

	function deleteDigit() {
		pin = pin.slice(0, -1);
	}

	$: pinDots = Array.from({ length: 4 }, (_, i) => i < pin.length);
</script>

<svelte:head><title>ManoirQuest — Connexion</title></svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center p-4">

	{#if !selectedPlayer}
		<!-- Sélection joueur -->
		<div class="text-center mb-8">
			<div class="text-5xl mb-2">🏠</div>
			<h1 class="text-3xl font-bold text-white">ManoirQuest</h1>
			<p class="text-purple-200 mt-1">Qui joue ?</p>
		</div>

		<div class="grid grid-cols-2 gap-4 w-full max-w-sm">
			{#each data.players as player}
				<button
					on:click={() => selectPlayer(player)}
					class="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-2xl p-5
					       flex flex-col items-center gap-2 transition-all active:scale-95"
				>
					<span class="text-5xl">{player.avatar}</span>
					<span class="text-white font-semibold text-lg">{player.name}</span>
					{#if player.role === 'parent'}
						<span class="text-xs text-yellow-300">👑 Parent</span>
					{/if}
				</button>
			{/each}
		</div>

	{:else}
		<!-- Saisie PIN -->
		<button on:click={() => selectedPlayer = null} class="text-purple-300 mb-6 text-sm flex items-center gap-1">
			← Retour
		</button>

		<div class="text-center mb-6">
			<span class="text-6xl">{selectedPlayer.avatar}</span>
			<h2 class="text-2xl font-bold text-white mt-2">Salut {selectedPlayer.name} !</h2>
			<p class="text-purple-200 text-sm mt-1">Entre ton PIN à 4 chiffres</p>
		</div>

		{#if form?.error}
			<div class="bg-red-500/20 border border-red-400/50 text-red-200 rounded-xl px-4 py-2 mb-4 text-sm">
				{form.error}
			</div>
		{/if}

		<!-- Points PIN -->
		<div class="flex gap-4 mb-6">
			{#each pinDots as filled}
				<div class="w-4 h-4 rounded-full transition-all {filled ? 'bg-white scale-110' : 'bg-white/30'}"></div>
			{/each}
		</div>

		<!-- Clavier numérique -->
		<form method="POST" action="?/login" id="pin-form">
			<input type="hidden" name="userId" value={selectedPlayer.id} />
			<input type="hidden" name="pin" bind:value={pin} />
		</form>

		<div class="grid grid-cols-3 gap-3 w-full max-w-xs">
			{#each ['1','2','3','4','5','6','7','8','9','','0','⌫'] as key}
				{#if key === ''}
					<div></div>
				{:else if key === '⌫'}
					<button on:click={deleteDigit}
						class="bg-white/10 hover:bg-white/20 text-white text-2xl rounded-2xl h-16
						       flex items-center justify-center active:scale-95 transition-all">
						{key}
					</button>
				{:else}
					<button on:click={() => addDigit(key)}
						class="bg-white/10 hover:bg-white/20 text-white text-2xl font-semibold rounded-2xl h-16
						       flex items-center justify-center active:scale-95 transition-all">
						{key}
					</button>
				{/if}
			{/each}
		</div>

		<!-- Auto-submit quand PIN complet -->
		{#if pin.length === 4}
			<script>document.getElementById('pin-form')?.submit();</script>
		{/if}
	{/if}
</div>
