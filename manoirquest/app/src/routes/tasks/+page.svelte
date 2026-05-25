<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	const DAY = ['', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
	const DAY_LONG = ['', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
	const diffLabel = (d: number) => ['', '★', '★★', '★★★'][d] ?? '';
	const diffClass = (d: number) => `diff-${d}`;

	const KIND_LABEL: Record<string, string> = {
		weekdays: 'Jours fixes', weekly: '1×/sem', biweekly: '2 sem.', monthly: '1×/mois', manual: 'Ponctuel'
	};

	const today = new Date(); today.setHours(0, 0, 0, 0);
	const fmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

	function parseYmd(s: string): Date {
		const [y, m, d] = s.split('-').map(Number);
		return new Date(y, m - 1, d);
	}
	// Libellé humain de l'échéance + indicateur de retard.
	function dueLabel(s: string): { text: string; late: boolean } {
		const d = parseYmd(s); d.setHours(0, 0, 0, 0);
		const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
		if (diff < 0) return { text: `En retard (${fmt.format(d)})`, late: true };
		if (diff === 0) return { text: "Aujourd'hui", late: false };
		if (diff === 1) return { text: 'Demain', late: false };
		return { text: fmt.format(d), late: false };
	}

	// Auto-soumission du changement de date.
	function submitDate(e: Event) {
		(e.currentTarget as HTMLInputElement).form?.requestSubmit();
	}
</script>

<svelte:head><title>ManoirQuest — Tâches</title></svelte:head>

<div class="stack">

	{#if form?.error}
		<div class="banner banner-err">{form.error}</div>
	{:else if form?.success}
		<div class="banner banner-ok">Tâche validée, points attribués ! 🎉</div>
	{:else if form?.added}
		<div class="banner banner-ok">Tâche ajoutée à faire.</div>
	{:else if form?.dated}
		<div class="banner banner-ok">Date mise à jour. 📅</div>
	{:else if form?.deleted}
		<div class="banner banner-ok">Tâche retirée de la liste.</div>
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
		<section class="bucket bucket-{group.key}">
			<header class="bucket-h">
				<span class="bucket-title">{group.label}</span>
				<span class="bucket-count">{group.items.length}</span>
			</header>
			<div class="stack" style="gap:10px">
				{#each group.items as inst}
					{@const due = dueLabel(inst.dueDate)}
					<div class="task-card">
						<!-- Retirer cette occurrence (ponctuel : définitif · récurrent : sauté) -->
						<form method="POST" action="?/delete" class="task-del-form">
							<input type="hidden" name="instanceId" value={inst.id} />
							<button class="task-del" title="Retirer cette tâche" aria-label="Retirer cette tâche">×</button>
						</form>
						<div class="row" style="margin-bottom:10px">
							<span class="task-emoji">{inst.task.emoji}</span>
							<div class="grow">
								<p style="font-weight:600; margin:0">{inst.task.name}</p>
								<p class="tiny dim" style="margin:2px 0 0">
									<span class={diffClass(inst.task.difficulty)}>{diffLabel(inst.task.difficulty)}</span>
									· ~{inst.task.durationMin} min
									· <span class="pts">+{inst.task.points} pts</span>
								</p>
								<div class="meta-chips">
									<span class="due-chip" class:late={due.late}>📅 {due.text}</span>
									{#if inst.task.scheduleKind === 'weekdays' && inst.task.scheduleDays.length < 7}
										{#each inst.task.scheduleDays as d}<span class="daychip">{DAY[d]}</span>{/each}
									{:else if inst.task.anchorDay}
										<span class="daychip">{KIND_LABEL[inst.task.scheduleKind]} · {DAY_LONG[inst.task.anchorDay]}</span>
									{:else}
										<span class="kindchip">{KIND_LABEL[inst.task.scheduleKind]}</span>
									{/if}
								</div>
							</div>
						</div>

						<!-- Attribution / changement de date de l'occurrence -->
						<form method="POST" action="?/setDate" class="date-form">
							<input type="hidden" name="instanceId" value={inst.id} />
							<label class="date-label" for="due-{inst.id}">Planifier&nbsp;:</label>
							<input id="due-{inst.id}" class="input date-input" type="date" name="date"
								value={inst.dueDate} on:change={submitDate} />
							<button class="btn-mini" title="Enregistrer la date">OK</button>
						</form>

						<!-- Qui a fait la tâche -->
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
