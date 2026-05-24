<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	const KINDS = [
		{ v: 'weekdays', l: 'Jours de la semaine' },
		{ v: 'weekly',   l: '1×/semaine' },
		{ v: 'biweekly', l: 'Toutes les 2 semaines' },
		{ v: 'monthly',  l: '1×/mois' },
		{ v: 'manual',   l: 'Manuel (à la volée)' }
	];
	const DAYS = [
		{ v: 1, l: 'Lun' }, { v: 2, l: 'Mar' }, { v: 3, l: 'Mer' }, { v: 4, l: 'Jeu' },
		{ v: 5, l: 'Ven' }, { v: 6, l: 'Sam' }, { v: 7, l: 'Dim' }
	];

	function confirmDelete(e: Event) {
		if (!confirm('Supprimer cette tâche et tout son historique ?')) e.preventDefault();
	}
</script>

<svelte:head><title>ManoirQuest — Réglages</title></svelte:head>

<div class="stack">

	{#if form?.error}
		<div class="banner banner-err">{form.error}</div>
	{:else if form?.created}
		<div class="banner banner-ok">Tâche créée.</div>
	{:else if form?.updated}
		<div class="banner banner-ok">Tâche enregistrée.</div>
	{:else if form?.deleted}
		<div class="banner banner-ok">Tâche supprimée.</div>
	{/if}

	<!-- Nouvelle tâche -->
	<form method="POST" action="?/create" class="card stack" style="gap:10px">
		<div class="card-h bare">➕ Nouvelle tâche</div>
		<div class="row">
			<input class="input" name="emoji" placeholder="✅" maxlength="2" style="width:54px; text-align:center" />
			<input class="input grow" name="name" placeholder="Nom de la tâche" required />
		</div>
		<div class="row">
			<label class="field"><span class="flabel">Points</span>
				<input class="input" type="number" name="points" value="20" min="0" step="5" style="width:90px" />
			</label>
			<label class="field grow"><span class="flabel">Fréquence</span>
				<select class="select" name="kind">
					{#each KINDS as k}<option value={k.v} selected={k.v === 'weekly'}>{k.l}</option>{/each}
				</select>
			</label>
		</div>
		<div>
			<span class="flabel">Jours (si « jours de la semaine »)</span>
			<div class="day-row">
				{#each DAYS as d}
					<label class="day-check"><input type="checkbox" name="day" value={d.v} /><span>{d.l}</span></label>
				{/each}
			</div>
		</div>
		<button class="btn btn-accent" style="align-self:flex-start">Créer la tâche</button>
	</form>

	<h2 class="card-h bare">📚 Catalogue ({data.catalogue.length})</h2>

	{#each data.catalogue as t}
		<form method="POST" action="?/update" class="card stack" style="gap:10px; {t.active ? '' : 'opacity:.6'}">
			<input type="hidden" name="id" value={t.id} />
			<div class="row">
				<input class="input" name="emoji" value={t.emoji} maxlength="2" style="width:54px; text-align:center" />
				<input class="input grow" name="name" value={t.name} required />
			</div>
			<div class="row">
				<label class="field"><span class="flabel">Points</span>
					<input class="input" type="number" name="points" value={t.points} min="0" step="5" style="width:90px" />
				</label>
				<label class="field grow"><span class="flabel">Fréquence</span>
					<select class="select" name="kind">
						{#each KINDS as k}<option value={k.v} selected={k.v === t.kind}>{k.l}</option>{/each}
					</select>
				</label>
			</div>
			<div>
				<span class="flabel">Jours</span>
				<div class="day-row">
					{#each DAYS as d}
						<label class="day-check"><input type="checkbox" name="day" value={d.v} checked={t.days.includes(d.v)} /><span>{d.l}</span></label>
					{/each}
				</div>
			</div>
			<div class="between">
				<label class="active-toggle"><input type="checkbox" name="active" checked={t.active} /><span>Active</span></label>
				<div class="row" style="gap:8px">
					<button class="btn-undo" formaction="?/delete" on:click={confirmDelete}>Supprimer</button>
					<button class="btn btn-accent">Enregistrer</button>
				</div>
			</div>
		</form>
	{/each}

</div>
