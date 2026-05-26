<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	$: base = data.base ?? '';
</script>

<svelte:head><title>ManoirQuest — Profil</title></svelte:head>

<div class="stack">

	<!-- Sélecteur de personne (remplace le login) -->
	<div class="people">
		{#each data.players as p}
			<a href="{base}/profile?u={p.id}" class="person" class:sel={p.id === data.selectedId}>
				<span class="av">{p.avatar}</span>
				<span>{p.name}</span>
			</a>
		{/each}
	</div>

	{#if data.player}
		<!-- Carte joueur -->
		<div class="hero">
			<div class="row" style="margin-bottom:16px">
				<span class="big">{data.player.avatar}</span>
				<div>
					<div class="name">{data.player.name}</div>
					<div class="tiny dim">Niveau {data.progress.level}</div>
				</div>
				<div style="margin-left:auto; text-align:right">
					<div class="total">{data.player.totalPoints}</div>
					<div class="tiny dim">points totaux</div>
				</div>
			</div>
			<div class="between tiny dim" style="margin-bottom:5px">
				<span>Niveau {data.progress.level}</span>
				<span>{data.progress.nextLevelPts - data.player.totalPoints} pts → niveau suivant</span>
			</div>
			<div class="progress"><span style="width:{data.progress.progressPct}%"></span></div>

			<!-- Solde dépensable : distinct des points totaux (qui pilotent le niveau, jamais débités) -->
			<div class="between" style="margin-top:14px; align-items:baseline">
				<span class="tiny dim">💳 Solde dépensable</span>
				<span class="pts" style="font-weight:700; font-size:18px">{data.player.availablePoints} pts</span>
			</div>
		</div>

		<!-- Badges -->
		<div class="card">
			<h2 class="card-h">🏅 Badges ({data.badges.length})</h2>
			{#if data.badges.length === 0}
				<p class="small dim center" style="padding:14px 0; margin:0">Aucun badge pour l'instant — fais des tâches pour en débloquer !</p>
			{:else}
				<div class="badge-grid">
					{#each data.badges as b}
						<div class="badge" title={b.description}>
							<span class="em">{b.emoji}</span>
							<span class="nm">{b.name}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Récompenses -->
		<div class="card">
			<h2 class="card-h bare">🎁 Récompenses</h2>
			<p class="tiny dim" style="margin:0 0 12px">Solde dépensable de {data.player.name} : <span class="pts">{data.player.availablePoints} pts</span></p>

			{#if form?.error}
				<div class="banner banner-err" style="margin-bottom:12px">{form.error}</div>
			{:else if form?.success}
				<div class="banner banner-ok" style="margin-bottom:12px">Récompense réclamée ! 🎉</div>
			{/if}

			{#each data.rewards as reward}
				{@const canAfford = data.player.availablePoints >= reward.cost}
				<div class="list-row">
					<span style="font-size:22px">{reward.emoji}</span>
					<div class="grow">
						<p class="small" style="font-weight:500; margin:0">{reward.name}</p>
						<p class="pts tiny" style="margin:0">{reward.cost} pts</p>
					</div>
					<form method="POST" action="?/claimReward">
						<input type="hidden" name="rewardId" value={reward.id} />
						<input type="hidden" name="userId" value={data.selectedId} />
						<button class="btn {canAfford ? 'btn-accent' : 'btn-off'}" disabled={!canAfford}>
							{canAfford ? 'Réclamer' : 'Insuffisant'}
						</button>
					</form>
				</div>
			{/each}
		</div>

		<!-- Réclamations -->
		{#if data.claims.length > 0}
			<div class="card">
				<h2 class="card-h">📜 Récompenses réclamées</h2>
				{#each data.claims as claim}
					<div class="list-row small">
						<span>{claim.reward_emoji}</span>
						<span class="grow muted">{claim.reward_name}</span>
						<span class="lvl">{claim.reward_cost} pts</span>
					</div>
				{/each}
			</div>
		{/if}
	{/if}

</div>
