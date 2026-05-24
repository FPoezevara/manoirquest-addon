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
	const DIFFS = [
		{ v: 1, l: '★ Facile' }, { v: 2, l: '★★ Moyen' }, { v: 3, l: '★★★ Dur' }
	];

	function confirmDelete(e: Event) {
		if (!confirm('Supprimer cette tâche et tout son historique ?')) e.preventDefault();
	}
	function confirmDeleteReward(e: Event) {
		if (!confirm('Supprimer cette récompense ?')) e.preventDefault();
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
	{:else if form?.rewardCreated}
		<div class="banner banner-ok">Récompense créée.</div>
	{:else if form?.rewardUpdated}
		<div class="banner banner-ok">Récompense enregistrée.</div>
	{:else if form?.rewardDeleted}
		<div class="banner banner-ok">Récompense supprimée.</div>
	{/if}

	<!-- ═══ TÂCHES ═══════════════════════════════════════════════════════════ -->
	<h2 class="section-title">📋 Tâches</h2>

	<!-- Nouvelle tâche -->
	<form method="POST" action="?/create" class="card stack" style="gap:10px">
		<div class="card-h bare">➕ Nouvelle tâche</div>
		<div class="row">
			<input class="input" name="emoji" placeholder="✅" maxlength="2" style="width:54px; text-align:center" />
			<input class="input grow" name="name" placeholder="Nom de la tâche" required />
		</div>
		<div class="row">
			<label class="field"><span class="flabel">Points</span>
				<input class="input" type="number" name="points" value="20" min="0" step="5" style="width:80px" />
			</label>
			<label class="field"><span class="flabel">Étoiles (difficulté)</span>
				<select class="select" name="difficulty">
					{#each DIFFS as d}<option value={d.v} selected={d.v === 2}>{d.l}</option>{/each}
				</select>
			</label>
		</div>
		<div class="row">
			<label class="field grow"><span class="flabel">Fréquence</span>
				<select class="select" name="kind">
					{#each KINDS as k}<option value={k.v} selected={k.v === 'weekly'}>{k.l}</option>{/each}
				</select>
			</label>
			<label class="field"><span class="flabel">Jour habituel</span>
				<select class="select" name="anchorDay" style="width:110px">
					<option value="">—</option>
					{#each DAYS as d}<option value={d.v}>{d.l}</option>{/each}
				</select>
			</label>
		</div>
		<div>
			<span class="flabel">Jours fixes (si « jours de la semaine »)</span>
			<div class="day-row">
				{#each DAYS as d}
					<label class="day-check"><input type="checkbox" name="day" value={d.v} /><span>{d.l}</span></label>
				{/each}
			</div>
		</div>
		<button class="btn btn-accent" style="align-self:flex-start">Créer la tâche</button>
	</form>

	<h3 class="card-h bare">📚 Catalogue ({data.catalogue.length})</h3>

	{#each data.catalogue as t}
		<form method="POST" action="?/update" class="card stack" style="gap:10px; {t.active ? '' : 'opacity:.6'}">
			<input type="hidden" name="id" value={t.id} />
			<div class="row">
				<input class="input" name="emoji" value={t.emoji} maxlength="2" style="width:54px; text-align:center" />
				<input class="input grow" name="name" value={t.name} required />
			</div>
			<div class="row">
				<label class="field"><span class="flabel">Points</span>
					<input class="input" type="number" name="points" value={t.points} min="0" step="5" style="width:80px" />
				</label>
				<label class="field"><span class="flabel">Étoiles</span>
					<select class="select" name="difficulty">
						{#each DIFFS as d}<option value={d.v} selected={d.v === t.difficulty}>{d.l}</option>{/each}
					</select>
				</label>
			</div>
			<div class="row">
				<label class="field grow"><span class="flabel">Fréquence</span>
					<select class="select" name="kind">
						{#each KINDS as k}<option value={k.v} selected={k.v === t.kind}>{k.l}</option>{/each}
					</select>
				</label>
				<label class="field"><span class="flabel">Jour habituel</span>
					<select class="select" name="anchorDay" style="width:110px">
						<option value="" selected={!t.anchorDay}>—</option>
						{#each DAYS as d}<option value={d.v} selected={d.v === t.anchorDay}>{d.l}</option>{/each}
					</select>
				</label>
			</div>
			<div>
				<span class="flabel">Jours fixes</span>
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

	<!-- ═══ RÉCOMPENSES ═════════════════════════════════════════════════════ -->
	<h2 class="section-title">🎁 Récompenses</h2>

	<!-- Nouvelle récompense -->
	<form method="POST" action="?/createReward" class="card stack" style="gap:10px">
		<div class="card-h bare">➕ Nouvelle récompense</div>
		<div class="row">
			<input class="input" name="emoji" placeholder="🎁" maxlength="2" style="width:54px; text-align:center" />
			<input class="input grow" name="name" placeholder="Nom de la récompense" required />
		</div>
		<input class="input" name="description" placeholder="Description (facultatif)" />
		<label class="field"><span class="flabel">Coût (points)</span>
			<input class="input" type="number" name="cost" value="200" min="0" step="50" style="width:110px" />
		</label>
		<button class="btn btn-accent" style="align-self:flex-start">Créer la récompense</button>
	</form>

	<h3 class="card-h bare">🏆 Liste ({data.rewards.length})</h3>

	{#each data.rewards as r}
		<form method="POST" action="?/updateReward" class="card stack" style="gap:10px; {r.is_active ? '' : 'opacity:.6'}">
			<input type="hidden" name="id" value={r.id} />
			<div class="row">
				<input class="input" name="emoji" value={r.emoji} maxlength="2" style="width:54px; text-align:center" />
				<input class="input grow" name="name" value={r.name} required />
			</div>
			<input class="input" name="description" value={r.description} placeholder="Description (facultatif)" />
			<label class="field"><span class="flabel">Coût (points)</span>
				<input class="input" type="number" name="cost" value={r.cost} min="0" step="50" style="width:110px" />
			</label>
			<div class="between">
				<label class="active-toggle"><input type="checkbox" name="active" checked={!!r.is_active} /><span>Active</span></label>
				<div class="row" style="gap:8px">
					<button class="btn-undo" formaction="?/deleteReward" on:click={confirmDeleteReward}>Supprimer</button>
					<button class="btn btn-accent">Enregistrer</button>
				</div>
			</div>
		</form>
	{/each}

</div>
