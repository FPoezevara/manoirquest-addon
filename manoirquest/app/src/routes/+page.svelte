<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: houseColor = data.houseScore >= 75 ? 'bg-green-500'
		: data.houseScore >= 40 ? 'bg-yellow-400'
		: 'bg-red-400';

	$: houseEmoji = data.houseScore >= 75 ? '✨' : data.houseScore >= 40 ? '🧹' : '😱';
</script>

<svelte:head><title>ManoirQuest — Maison</title></svelte:head>

<div class="p-4 space-y-5 max-w-lg mx-auto">

	<!-- Jauge Maison -->
	<div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
		<div class="flex items-center justify-between mb-2">
			<span class="font-semibold text-gray-700">🏠 Propreté de la maison</span>
			<span class="text-2xl">{houseEmoji}</span>
		</div>
		<div class="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
			<div class="{houseColor} h-4 rounded-full transition-all duration-700" style="width:{data.houseScore}%"></div>
		</div>
		<p class="text-right text-sm text-gray-500 mt-1">{data.houseScore}%</p>
	</div>

	<!-- Leaderboard semaine -->
	<div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
		<h2 class="font-semibold text-gray-700 mb-3">🏆 Classement de la semaine</h2>
		<div class="space-y-2">
			{#each data.leaderboard as player, i}
				<div class="flex items-center gap-3 {i === 0 ? 'bg-yellow-50 rounded-xl p-2' : 'px-2 py-1'}">
					<span class="text-xl w-6 text-center">
						{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}
					</span>
					<span class="text-2xl">{player.avatar}</span>
					<span class="flex-1 font-medium text-gray-800">{player.name}</span>
					<span class="text-purple-700 font-bold">{player.weeklyPoints} pts</span>
					<span class="text-xs text-gray-400 w-10 text-center">Niv.{player.level}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- À valider (parents) -->
	{#if data.pendingValidation.length > 0}
		<div class="bg-orange-50 border border-orange-200 rounded-2xl p-4">
			<h2 class="font-semibold text-orange-700 mb-2">⏳ À valider ({data.pendingValidation.length})</h2>
			{#each data.pendingValidation as inst}
				<div class="flex items-center justify-between bg-white rounded-xl p-3 mb-2 shadow-sm">
					<div>
						<span class="text-lg mr-1">{inst.task?.emoji}</span>
						<span class="font-medium">{inst.task?.name}</span>
						<span class="text-xs text-gray-500 block">
							par {inst.claimedByUser?.avatar} {inst.claimedByUser?.name}
						</span>
					</div>
					<div class="flex gap-2">
						<form method="POST" action="/tasks?/validate">
							<input type="hidden" name="instanceId" value={inst.id} />
							<input type="hidden" name="approved" value="true" />
							<button class="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium">✓</button>
						</form>
						<form method="POST" action="/tasks?/refuse">
							<input type="hidden" name="instanceId" value={inst.id} />
							<button class="bg-red-400 text-white px-3 py-1.5 rounded-lg text-sm font-medium">✗</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Tâches urgentes -->
	{#if data.urgent.length > 0}
		<div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
			<h2 class="font-semibold text-gray-700 mb-3">📋 Tâches en attente</h2>
			{#each data.urgent as inst}
				<div class="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
					<span class="text-xl">{inst.task?.emoji}</span>
					<span class="flex-1 text-gray-700">{inst.task?.name}</span>
					<span class="text-xs text-purple-600 font-semibold">+{inst.task?.points}pts</span>
				</div>
			{/each}
			<a href="/tasks" class="block text-center text-purple-600 text-sm font-medium mt-3">
				Voir toutes les tâches →
			</a>
		</div>
	{/if}

	<!-- Activité récente -->
	{#if data.recentDone.length > 0}
		<div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
			<h2 class="font-semibold text-gray-700 mb-3">✅ Activité récente</h2>
			{#each data.recentDone as inst}
				<div class="flex items-center gap-2 text-sm py-1.5 border-b border-gray-50 last:border-0">
					<span>{inst.claimedByUser?.avatar}</span>
					<span class="text-gray-600">{inst.claimedByUser?.name}</span>
					<span class="text-gray-400">a fait</span>
					<span>{inst.task?.emoji}</span>
					<span class="flex-1 text-gray-700 truncate">{inst.task?.name}</span>
					<span class="text-green-600 font-semibold text-xs">+{inst.pointsAwarded}pts</span>
				</div>
			{/each}
		</div>
	{/if}

</div>
