<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	$: base = data.base ?? '';
</script>

<svelte:head><title>ManoirQuest — Profil</title></svelte:head>

<div class="p-4 space-y-5 max-w-lg mx-auto">

	<!-- Sélecteur de personne (remplace le login) -->
	<div class="flex gap-2">
		{#each data.players as p}
			<a
				href="{base}/profile?u={p.id}"
				class="flex-1 flex flex-col items-center gap-0.5 rounded-xl py-2 border transition-all
				       {p.id === data.selectedId ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200'}"
			>
				<span class="text-2xl">{p.avatar}</span>
				<span class="text-[11px] font-medium">{p.name}</span>
			</a>
		{/each}
	</div>

	{#if data.player}
		<!-- Carte joueur -->
		<div class="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl p-5 text-white">
			<div class="flex items-center gap-4 mb-4">
				<span class="text-6xl">{data.player.avatar}</span>
				<div>
					<h1 class="text-2xl font-bold">{data.player.name}</h1>
					<p class="text-purple-200 text-sm">Niveau {data.progress.level}</p>
				</div>
				<div class="ml-auto text-right">
					<p class="text-3xl font-bold">{data.player.totalPoints}</p>
					<p class="text-purple-200 text-xs">points totaux</p>
				</div>
			</div>
			<div>
				<div class="flex justify-between text-xs text-purple-200 mb-1">
					<span>Niveau {data.progress.level}</span>
					<span>{data.progress.nextLevelPts - data.player.totalPoints} pts → niveau suivant</span>
				</div>
				<div class="bg-purple-900/50 rounded-full h-2">
					<div class="bg-yellow-400 h-2 rounded-full transition-all" style="width:{data.progress.progressPct}%"></div>
				</div>
			</div>
		</div>

		<!-- Badges -->
		<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
			<h2 class="font-bold text-gray-700 mb-3">🏅 Badges ({data.badges.length})</h2>
			{#if data.badges.length === 0}
				<p class="text-gray-400 text-sm text-center py-4">Aucun badge pour l'instant — fais des tâches pour en débloquer !</p>
			{:else}
				<div class="grid grid-cols-3 gap-3">
					{#each data.badges as b}
						<div class="flex flex-col items-center text-center p-2 bg-purple-50 rounded-xl" title={b.description}>
							<span class="text-3xl">{b.emoji}</span>
							<span class="text-xs font-medium text-gray-700 mt-1">{b.name}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Récompenses -->
		<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
			<h2 class="font-bold text-gray-700 mb-1">🎁 Récompenses</h2>
			<p class="text-xs text-gray-400 mb-3">{data.player.name} a <strong class="text-purple-700">{data.player.totalPoints} pts</strong></p>

			{#if form?.error}
				<div class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 text-sm mb-3">{form.error}</div>
			{:else if form?.success}
				<div class="bg-green-50 border border-green-200 text-green-700 rounded-xl px-3 py-2 text-sm mb-3">Récompense réclamée ! 🎉</div>
			{/if}

			{#each data.rewards as reward}
				{@const canAfford = data.player.totalPoints >= reward.cost}
				<div class="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
					<span class="text-2xl">{reward.emoji}</span>
					<div class="flex-1 min-w-0">
						<p class="font-medium text-gray-800 text-sm">{reward.name}</p>
						<p class="text-xs text-purple-600 font-semibold">{reward.cost} pts</p>
					</div>
					<form method="POST" action="?/claimReward">
						<input type="hidden" name="rewardId" value={reward.id} />
						<input type="hidden" name="userId" value={data.selectedId} />
						<button
							disabled={!canAfford}
							class="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all
							       {canAfford ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}"
						>
							{canAfford ? 'Réclamer' : 'Insuffisant'}
						</button>
					</form>
				</div>
			{/each}
		</div>

		<!-- Réclamations -->
		{#if data.claims.length > 0}
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
				<h2 class="font-bold text-gray-700 mb-2">📜 Récompenses réclamées</h2>
				{#each data.claims as claim}
					<div class="flex items-center gap-2 py-1 text-sm">
						<span>{claim.reward_emoji}</span>
						<span class="text-gray-700">{claim.reward_name}</span>
						<span class="text-xs text-gray-400 ml-auto">{claim.reward_cost} pts</span>
					</div>
				{/each}
			</div>
		{/if}
	{/if}

</div>
