<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	// "2026-05-24 10:30:00" (UTC) → "24/05 · 10:30"
	function fmt(ts: string | null): string {
		if (!ts) return '';
		const m = ts.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
		return m ? `${m[3]}/${m[2]} · ${m[4]}:${m[5]}` : ts;
	}
</script>

<svelte:head><title>ManoirQuest — Faites</title></svelte:head>

<div class="stack">

	{#if form?.success}
		<div class="banner banner-ok">Tâche annulée, points retirés.</div>
	{:else if form?.error}
		<div class="banner banner-err">{form.error}</div>
	{/if}

	<h2 class="card-h bare">✅ Tâches faites</h2>

	{#if data.done.length === 0}
		<div class="empty">
			<div class="em">📭</div>
			<p style="font-weight:500; margin:6px 0 0">Aucune tâche enregistrée pour l'instant.</p>
		</div>
	{:else}
		<div class="stack" style="gap:8px">
			{#each data.done as inst}
				<div class="done-row">
					<span class="avatar" style="font-size:24px">{inst.claimedByUser?.avatar ?? '🧑'}</span>
					<div class="grow">
						<p class="small" style="margin:0; font-weight:500">
							<span>{inst.task.emoji}</span> {inst.task.name}
						</p>
						<p class="tiny dim" style="margin:1px 0 0">
							{inst.claimedByUser?.name ?? '—'} · {fmt(inst.validatedAt)}
						</p>
					</div>
					<span class="pts-pos tiny" style="white-space:nowrap">+{inst.pointsAwarded}</span>
					<form method="POST" action="?/undo">
						<input type="hidden" name="instanceId" value={inst.id} />
						<button class="btn-undo" title="Annuler (retire les points)">Annuler</button>
					</form>
				</div>
			{/each}
		</div>
	{/if}

</div>
