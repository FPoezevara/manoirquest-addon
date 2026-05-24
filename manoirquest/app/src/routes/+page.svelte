<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: base = data.base ?? '';

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
		<p class="text-right text-sm text-gray-500 mt-1">{data.houseScore}% des tâches de la semaine faites</p>
	</div>

	<!-- Classement de la semaine -->
	<div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
		<h2 class="font-semibold text-gray-700 mb-3">🏆 Classement de la semaine</h2>
		<div class="space-y-2">
			{#each data.leaderboard as player, i}
				<div class="flex items-center gap-3 {i === 0 ? 'bg-yellow-50 rounded-xl p-2' : 'px-2 py-1'}">
					<span class="text-xl w-6 text-center">
						{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
					</span>
					<span class="text-2xl">{player.avatar}</span>
					<div class="flex-1 min-w-0">
						<span class="font-medium text-gray-800">{player.name}</span>
						{#if player.badges && player.badges.length}
							<span class="ml-1 text-sm">{player.badges.slice(0, 4).map(b => b.emoji).join('')}</span>
						{/if}
					</div>
					<span class="text-purple-700 font-bold">{player.weeklyPoints} pts</span>
					<span class="text-xs text-gray-400 w-12 text-center">Niv.{player.level}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Prochaines tâches -->
	{#if data.upcoming.length > 0}
		<div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
			<h2 class="font-semibold text-gray-700 mb-3">📋 À faire ({data.upcomingCount})</h2>
			{#each data.upcoming as inst}
				<div class="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
					<span class="text-xl">{inst.task.emoji}</span>
					<span class="flex-1 text-gray-700 truncate">{inst.task.name}</span>
					<span class="text-xs text-purple-600 font-semibold">+{inst.task.points} pts</span>
				</div>
			{/each}
			<a href="{base}/tasks" class="block text-center text-purple-600 text-sm font-medium mt-3">
				Déclarer une tâche faite →
			</a>
		</div>
	{:else}
		<div class="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
			<div class="text-4xl mb-1">🎉</div>
			<p class="font-medium text-green-700">Tout est fait pour cette semaine !</p>
		</div>
	{/if}

	<!-- Activité récente -->
	{#if data.recentDone.length > 0}
		<div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
			<h2 class="font-semibold text-gray-700 mb-3">✅ Dernières tâches faites</h2>
			{#each data.recentDone as inst}
				<div class="flex items-center gap-2 text-sm py-1.5 border-b border-gray-50 last:border-0">
					<span>{inst.claimedByUser?.avatar ?? '🧑'}</span>
					<span class="text-gray-600">{inst.claimedByUser?.name ?? '—'}</span>
					<span class="text-gray-400">a fait</span>
					<span>{inst.task.emoji}</span>
					<span class="flex-1 text-gray-700 truncate">{inst.task.name}</span>
					<span class="text-green-600 font-semibold text-xs">+{inst.pointsAwarded} pts</span>
				</div>
			{/each}
		</div>
	{/if}

</div>
