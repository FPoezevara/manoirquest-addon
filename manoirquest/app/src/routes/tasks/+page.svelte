<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	const diffLabel = (d: number) => ['', '★', '★★', '★★★'][d] ?? '';
	const diffColor = (d: number) => ['', 'text-green-600', 'text-yellow-600', 'text-red-600'][d] ?? '';
</script>

<svelte:head><title>ManoirQuest — Tâches</title></svelte:head>

<div class="p-4 space-y-4 max-w-lg mx-auto">

	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2 text-sm">
			{form.error}
		</div>
	{:else if form?.success}
		<div class="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2 text-sm">
			Tâche validée, points attribués ! 🎉
		</div>
	{/if}

	<section>
		<h2 class="font-bold text-gray-700 mb-1">
			📋 Tâches à faire
			{#if data.available.length > 0}
				<span class="text-sm font-normal text-gray-400">({data.available.length})</span>
			{/if}
		</h2>
		<p class="text-xs text-gray-400 mb-3">Touche l'avatar de la personne qui a fait la tâche.</p>

		{#if data.available.length === 0}
			<div class="text-center py-10 text-gray-400">
				<div class="text-5xl mb-2">🎉</div>
				<p class="font-medium">Toutes les tâches de la semaine sont faites !</p>
			</div>
		{:else}
			{#each data.available as inst}
				<div class="bg-white border border-gray-100 rounded-2xl p-4 mb-2 shadow-sm">
					<div class="flex items-center gap-3 mb-3">
						<span class="text-3xl">{inst.task.emoji}</span>
						<div class="flex-1 min-w-0">
							<p class="font-semibold text-gray-800">{inst.task.name}</p>
							<p class="text-xs text-gray-500 mt-0.5">
								<span class={diffColor(inst.task.difficulty)}>{diffLabel(inst.task.difficulty)}</span>
								· ~{inst.task.durationMin} min
								· <span class="text-purple-600 font-semibold">+{inst.task.points} pts</span>
							</p>
						</div>
					</div>
					<form method="POST" action="?/complete" class="flex gap-2">
						<input type="hidden" name="instanceId" value={inst.id} />
						{#each data.players as p}
							<button
								name="userId"
								value={p.id}
								title="Fait par {p.name}"
								class="flex-1 flex flex-col items-center gap-0.5 bg-gray-50 hover:bg-purple-50 border border-gray-200
								       rounded-xl py-2 active:scale-95 transition-all"
							>
								<span class="text-2xl">{p.avatar}</span>
								<span class="text-[11px] text-gray-600">{p.name}</span>
							</button>
						{/each}
					</form>
				</div>
			{/each}
		{/if}
	</section>

	{#if data.recentDone.length > 0}
		<section>
			<h2 class="font-bold text-gray-700 mb-2">✅ Dernières faites</h2>
			<div class="bg-white border border-gray-100 rounded-2xl overflow-hidden">
				{#each data.recentDone as inst}
					<div class="flex items-center gap-2 text-sm px-4 py-2 border-b border-gray-50 last:border-0">
						<span>{inst.claimedByUser?.avatar ?? '🧑'}</span>
						<span class="text-gray-600">{inst.claimedByUser?.name ?? '—'}</span>
						<span>{inst.task.emoji}</span>
						<span class="flex-1 text-gray-700 truncate">{inst.task.name}</span>
						<span class="text-green-600 font-semibold text-xs">+{inst.pointsAwarded}</span>
					</div>
				{/each}
			</div>
		</section>
	{/if}

</div>
