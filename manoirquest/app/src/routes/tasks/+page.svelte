<script lang="ts">
	import type { PageData, ActionData } from './$types';
	export let data: PageData;
	export let form: ActionData;

	const diffLabel = (d: number) => ['', '★', '★★', '★★★'][d] ?? '?';
	const diffColor = (d: number) => ['', 'text-green-600', 'text-yellow-600', 'text-red-600'][d] ?? '';
</script>

<svelte:head><title>ManoirQuest — Tâches</title></svelte:head>

<div class="p-4 space-y-5 max-w-lg mx-auto">

	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2 text-sm">
			{form.error}
		</div>
	{/if}

	<!-- À valider (parents) -->
	{#if data.toValidate.length > 0}
		<section>
			<h2 class="font-bold text-orange-600 mb-2">⏳ À valider ({data.toValidate.length})</h2>
			{#each data.toValidate as inst}
				<div class="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-2">
					<div class="flex items-start gap-3 mb-3">
						<span class="text-3xl">{inst.task?.emoji}</span>
						<div class="flex-1">
							<p class="font-semibold">{inst.task?.name}</p>
							<p class="text-sm text-gray-500">
								par {inst.claimedByUser?.avatar} {inst.claimedByUser?.name}
								· +{inst.task?.points} pts
							</p>
						</div>
					</div>
					<div class="flex gap-2">
						<form method="POST" action="?/validate" class="flex-1">
							<input type="hidden" name="instanceId" value={inst.id} />
							<input type="hidden" name="approved" value="true" />
							<button class="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-2.5 font-semibold transition-colors">
								✓ Valider
							</button>
						</form>
						<form method="POST" action="?/refuse" class="flex-1">
							<input type="hidden" name="instanceId" value={inst.id} />
							<button class="w-full bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-xl py-2.5 font-semibold transition-colors">
								✗ Refuser
							</button>
						</form>
					</div>
				</div>
			{/each}
		</section>
	{/if}

	<!-- En cours (réclamées, pas encore déclarées) -->
	{#if data.myClaimed.length > 0}
		<section>
			<h2 class="font-bold text-purple-700 mb-2">🔄 En cours ({data.myClaimed.length})</h2>
			{#each data.myClaimed as inst}
				<div class="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-2 flex items-center gap-3">
					<span class="text-3xl">{inst.task?.emoji}</span>
					<div class="flex-1">
						<p class="font-semibold">{inst.task?.name}</p>
						<p class="text-xs text-purple-500">Durée ~{inst.task?.durationMin} min · +{inst.task?.points} pts</p>
					</div>
					<form method="POST" action="?/declare">
						<input type="hidden" name="instanceId" value={inst.id} />
						<button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
							Terminé !
						</button>
					</form>
				</div>
			{/each}
		</section>
	{/if}

	<!-- En attente de validation -->
	{#if data.myPending.length > 0}
		<section>
			<h2 class="font-bold text-yellow-600 mb-2">⏳ En attente de validation</h2>
			{#each data.myPending as inst}
				<div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-2 flex items-center gap-3 opacity-75">
					<span class="text-3xl">{inst.task?.emoji}</span>
					<div class="flex-1">
						<p class="font-semibold">{inst.task?.name}</p>
						<p class="text-xs text-yellow-600">En attente qu'un parent valide…</p>
					</div>
					<span class="text-yellow-500 text-xl">⏳</span>
				</div>
			{/each}
		</section>
	{/if}

	<!-- Tâches disponibles -->
	<section>
		<h2 class="font-bold text-gray-700 mb-2">
			📋 Disponibles
			{#if data.available.length > 0}
				<span class="text-sm font-normal text-gray-400">({data.available.length})</span>
			{/if}
		</h2>

		{#if data.available.length === 0}
			<div class="text-center py-10 text-gray-400">
				<div class="text-5xl mb-2">🎉</div>
				<p class="font-medium">Toutes les tâches sont prises !</p>
				<p class="text-sm">Reviens plus tard.</p>
			</div>
		{:else}
			{#each data.available as inst}
				<div class="bg-white border border-gray-100 rounded-2xl p-4 mb-2 shadow-sm flex items-center gap-3">
					<span class="text-3xl">{inst.task?.emoji}</span>
					<div class="flex-1">
						<p class="font-semibold text-gray-800">{inst.task?.name}</p>
						<p class="text-xs text-gray-500 mt-0.5">
							<span class="{diffColor(inst.task?.difficulty ?? 1)}">{diffLabel(inst.task?.difficulty ?? 1)}</span>
							· ~{inst.task?.durationMin} min
							· <span class="text-purple-600 font-semibold">+{inst.task?.points} pts</span>
						</p>
					</div>
					<form method="POST" action="?/claim">
						<input type="hidden" name="instanceId" value={inst.id} />
						<button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors active:scale-95">
							Je prends !
						</button>
					</form>
				</div>
			{/each}
		{/if}
	</section>

</div>
