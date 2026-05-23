<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;
</script>

<svelte:head><title>ManoirQuest — Profil</title></svelte:head>

<div class="p-4 space-y-5 max-w-lg mx-auto">

	<!-- Carte joueur -->
	<div class="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl p-5 text-white">
		<div class="flex items-center gap-4 mb-4">
			<span class="text-6xl">{data.user?.avatar}</span>
			<div>
				<h1 class="text-2xl font-bold">{data.user?.name}</h1>
				<p class="text-purple-200 text-sm">Niveau {data.user?.level}</p>
			</div>
			<div class="ml-auto text-right">
				<p class="text-3xl font-bold">{data.user?.totalPoints}</p>
				<p class="text-purple-200 text-xs">points totaux</p>
			</div>
		</div>
		<!-- Barre de progression vers le prochain niveau -->
		<div>
			<div class="flex justify-between text-xs text-purple-200 mb-1">
				<span>Niveau {data.user?.level}</span>
				{#if data.nextLevelPts}
					<span>{data.nextLevelPts - (data.user?.totalPoints ?? 0)} pts pour le niveau suivant</span>
				{:else}
					<span>Niveau max !</span>
				{/if}
			</div>
			<div class="bg-purple-900/50 rounded-full h-2">
				<div class="bg-yellow-400 h-2 rounded-full transition-all" style="width:{data.progressPct}%"></div>
			</div>
		</div>
	</div>

	<!-- Badges -->
	<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
		<h2 class="font-bold text-gray-700 mb-3">🏅 Badges ({data.earnedBadges.length})</h2>
		{#if data.earnedBadges.length === 0}
			<p class="text-gray-400 text-sm text-center py-4">Aucun badge pour l'instant — commence à faire des tâches !</p>
		{:else}
			<div class="grid grid-cols-3 gap-3">
				{#each data.earnedBadges as ub}
					<div class="flex flex-col items-center text-center p-2 bg-purple-50 rounded-xl">
						<span class="text-3xl">{ub.badge?.emoji}</span>
						<span class="text-xs font-medium text-gray-700 mt-1">{ub.badge?.name}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Récompenses disponibles -->
	<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
		<h2 class="font-bold text-gray-700 mb-1">🎁 Récompenses</h2>
		<p class="text-xs text-gray-400 mb-3">Tu as <strong class="text-purple-700">{data.user?.totalPoints} pts</strong></p>

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 text-sm mb-3">{form.error}</div>
		{/if}

		{#each data.availableRewards as reward}
			{@const canAfford = (data.user?.totalPoints ?? 0) >= reward.cost}
			<div class="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
				<span class="text-2xl">{reward.emoji}</span>
				<div class="flex-1">
					<p class="font-medium text-gray-800 text-sm">{reward.name}</p>
					<p class="text-xs text-purple-600 font-semibold">{reward.cost} pts</p>
				</div>
				<form method="POST" action="?/claimReward">
					<input type="hidden" name="rewardId" value={reward.id} />
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

	<!-- Réclamations en attente -->
	{#if data.myClaims.filter(c => c.status === 'pending').length > 0}
		<div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
			<h2 class="font-bold text-yellow-700 mb-2">⏳ Récompenses en attente de validation</h2>
			{#each data.myClaims.filter(c => c.status === 'pending') as claim}
				<div class="flex items-center gap-2 py-1">
					<span>{claim.reward?.emoji}</span>
					<span class="text-sm">{claim.reward?.name}</span>
					<span class="text-xs text-yellow-600 ml-auto">En attente…</span>
				</div>
			{/each}
		</div>
	{/if}

</div>
