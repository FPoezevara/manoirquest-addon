<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	let tab: 'week' | 'alltime' = 'week';
	$: list = tab === 'week' ? data.weekly : data.allTime;
	$: scoreKey = tab === 'week' ? 'weeklyPoints' : 'totalPoints';

	const medals = ['🥇','🥈','🥉'];
</script>

<svelte:head><title>ManoirQuest — Classement</title></svelte:head>

<div class="p-4 max-w-lg mx-auto">

	<!-- Tabs -->
	<div class="flex bg-gray-100 rounded-xl p-1 mb-5">
		<button on:click={() => tab='week'}
			class="flex-1 py-2 rounded-lg text-sm font-semibold transition-all
			       {tab==='week' ? 'bg-white shadow text-purple-700' : 'text-gray-500'}">
			Cette semaine
		</button>
		<button on:click={() => tab='alltime'}
			class="flex-1 py-2 rounded-lg text-sm font-semibold transition-all
			       {tab==='alltime' ? 'bg-white shadow text-purple-700' : 'text-gray-500'}">
			Tout temps
		</button>
	</div>

	<!-- Podium (top 3) -->
	{#if list.length >= 3}
		<div class="flex items-end justify-center gap-3 mb-6 px-4">
			<!-- 2nd -->
			<div class="flex flex-col items-center flex-1">
				<span class="text-4xl mb-1">{list[1].avatar}</span>
				<span class="text-sm font-semibold text-gray-700">{list[1].name}</span>
				<div class="w-full bg-gray-300 rounded-t-lg mt-2 h-16 flex items-end justify-center pb-1">
					<span class="text-white font-bold text-sm">{list[1][scoreKey]}</span>
				</div>
			</div>
			<!-- 1st -->
			<div class="flex flex-col items-center flex-1">
				<span class="text-5xl mb-1">{list[0].avatar}</span>
				<span class="text-sm font-bold text-gray-800">{list[0].name}</span>
				<div class="w-full bg-yellow-400 rounded-t-lg mt-2 h-24 flex items-end justify-center pb-1">
					<span class="text-white font-bold">{list[0][scoreKey]}</span>
				</div>
			</div>
			<!-- 3rd -->
			<div class="flex flex-col items-center flex-1">
				<span class="text-4xl mb-1">{list[2].avatar}</span>
				<span class="text-sm font-semibold text-gray-700">{list[2].name}</span>
				<div class="w-full bg-amber-600 rounded-t-lg mt-2 h-10 flex items-end justify-center pb-1">
					<span class="text-white font-bold text-sm">{list[2][scoreKey]}</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- Liste complète -->
	<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
		{#each list as player, i}
			<div class="flex items-center gap-3 px-4 py-3 {i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} {i < list.length-1 ? 'border-b border-gray-100' : ''}">
				<span class="text-lg w-7 text-center">{medals[i] ?? `${i+1}.`}</span>
				<span class="text-2xl">{player.avatar}</span>
				<div class="flex-1">
					<p class="font-semibold text-gray-800">{player.name}</p>
					<p class="text-xs text-gray-400">Niveau {player.level}</p>
				</div>
				<div class="text-right">
					<p class="font-bold text-purple-700">{player[scoreKey]} pts</p>
					{#if tab === 'week'}
						<p class="text-xs text-gray-400">Total: {player.totalPoints}</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>

</div>
