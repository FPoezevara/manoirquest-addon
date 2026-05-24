<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	const diffLabel = (d: number) => ['', '★', '★★', '★★★'][d] ?? '';
	const diffClass = (d: number) => `diff-${d}`;
</script>

<svelte:head><title>ManoirQuest — Tâches</title></svelte:head>

<div class="stack">

	{#if form?.error}
		<div class="banner banner-err">{form.error}</div>
	{:else if form?.success}
		<div class="banner banner-ok">Tâche validée, points attribués ! 🎉</div>
	{/if}

	<div>
		<h2 class="card-h bare">📋 Tâches à faire {#if data.available.length > 0}<span class="dim" style="font-weight:400">({data.available.length})</span>{/if}</h2>
		<p class="tiny dim" style="margin:0 0 12px">Touche l'avatar de la personne qui a fait la tâche.</p>

		{#if data.available.length === 0}
			<div class="empty">
				<div class="em">🎉</div>
				<p style="font-weight:500; margin:6px 0 0">Toutes les tâches de la semaine sont faites !</p>
			</div>
		{:else}
			<div class="stack" style="gap:10px">
				{#each data.available as inst}
					<div class="task-card">
						<div class="row" style="margin-bottom:12px">
							<span class="task-emoji">{inst.task.emoji}</span>
							<div class="grow">
								<p style="font-weight:600; margin:0">{inst.task.name}</p>
								<p class="tiny dim" style="margin:2px 0 0">
									<span class={diffClass(inst.task.difficulty)}>{diffLabel(inst.task.difficulty)}</span>
									· ~{inst.task.durationMin} min
									· <span class="pts">+{inst.task.points} pts</span>
								</p>
							</div>
						</div>
						<form method="POST" action="?/complete" class="picker">
							<input type="hidden" name="instanceId" value={inst.id} />
							{#each data.players as p}
								<button class="pick" name="userId" value={p.id} title="Fait par {p.name}">
									<span class="av">{p.avatar}</span>
									<span>{p.name}</span>
								</button>
							{/each}
						</form>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	{#if data.recentDone.length > 0}
		<div class="card">
			<h2 class="card-h">✅ Dernières faites</h2>
			{#each data.recentDone as inst}
				<div class="list-row small">
					<span>{inst.claimedByUser?.avatar ?? '🧑'}</span>
					<span class="muted">{inst.claimedByUser?.name ?? '—'}</span>
					<span>{inst.task.emoji}</span>
					<span class="grow truncate">{inst.task.name}</span>
					<span class="pts-pos tiny">+{inst.pointsAwarded}</span>
				</div>
			{/each}
		</div>
	{/if}

</div>
