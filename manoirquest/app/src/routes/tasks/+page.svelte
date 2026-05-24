<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	const DAY = ['', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
	const diffLabel = (d: number) => ['', '★', '★★', '★★★'][d] ?? '';
	const diffClass = (d: number) => `diff-${d}`;
</script>

<svelte:head><title>ManoirQuest — Tâches</title></svelte:head>

<div class="stack">

	{#if form?.error}
		<div class="banner banner-err">{form.error}</div>
	{:else if form?.success}
		<div class="banner banner-ok">Tâche validée, points attribués ! 🎉</div>
	{:else if form?.added}
		<div class="banner banner-ok">Tâche ajoutée à faire.</div>
	{/if}

	<!-- Ajout manuel d'une occurrence -->
	<form method="POST" action="?/add" class="card add-form">
		<span class="add-plus">＋</span>
		<select name="taskId" class="select grow" aria-label="Tâche à ajouter">
			<option value="" selected disabled>Ajouter une tâche à faire…</option>
			{#each data.catalogue as t}
				<option value={t.id}>{t.emoji} {t.name}</option>
			{/each}
		</select>
		<button class="btn btn-accent">Ajouter</button>
	</form>

	{#if data.groups.length === 0}
		<div class="empty">
			<div class="em">🎉</div>
			<p style="font-weight:500; margin:6px 0 0">Rien à faire pour le moment !</p>
		</div>
	{/if}

	{#each data.groups as group}
		<section>
			<div class="group-h">{group.label} <span class="dim">· {group.items.length}</span></div>
			<div class="stack" style="gap:10px">
				{#each group.items as inst}
					<div class="task-card">
						<div class="row" style="margin-bottom:10px">
							<span class="task-emoji">{inst.task.emoji}</span>
							<div class="grow">
								<p style="font-weight:600; margin:0">{inst.task.name}</p>
								<p class="tiny dim" style="margin:2px 0 0">
									<span class={diffClass(inst.task.difficulty)}>{diffLabel(inst.task.difficulty)}</span>
									· ~{inst.task.durationMin} min
									· <span class="pts">+{inst.task.points} pts</span>
								</p>
								{#if group.key === 'weekdays'}
									<div class="daychips">
										{#each inst.task.scheduleDays as d}<span class="daychip">{DAY[d]}</span>{/each}
									</div>
								{/if}
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
		</section>
	{/each}

</div>
