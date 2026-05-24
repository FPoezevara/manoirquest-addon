<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: base = data.base ?? '';

	$: houseFill = data.houseScore >= 75 ? '#30d158'
		: data.houseScore >= 40 ? '#ffd60a'
		: '#ff453a';
	$: houseEmoji = data.houseScore >= 75 ? '✨' : data.houseScore >= 40 ? '🧹' : '😱';
</script>

<svelte:head><title>ManoirQuest — Maison</title></svelte:head>

<div class="stack">

	<!-- Jauge Maison -->
	<div class="card">
		<div class="between" style="margin-bottom:8px">
			<span class="card-h bare" style="margin:0">🏠 Propreté de la maison</span>
			<span style="font-size:22px">{houseEmoji}</span>
		</div>
		<div class="gauge"><span style="width:{data.houseScore}%; background:{houseFill}"></span></div>
		<p class="tiny dim" style="text-align:right; margin:6px 0 0">{data.houseScore}% des tâches de la semaine faites</p>
	</div>

	<!-- Classement de la semaine -->
	<div class="card">
		<h2 class="card-h">🏆 Classement de la semaine</h2>
		{#each data.leaderboard as player, i}
			<div class="list-row">
				<span class="rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
				<span class="avatar" style="font-size:24px">{player.avatar}</span>
				<div class="grow">
					<span style="font-weight:500">{player.name}</span>
					{#if player.badges && player.badges.length}
						<span class="chips">{player.badges.slice(0, 4).map(b => b.emoji).join('')}</span>
					{/if}
				</div>
				<span class="pts">{player.weeklyPoints} pts</span>
				<span class="lvl" style="width:48px; text-align:right">Niv.{player.level}</span>
			</div>
		{/each}
	</div>

	<!-- Prochaines tâches -->
	{#if data.upcoming.length > 0}
		<div class="card">
			<h2 class="card-h">📋 À faire ({data.upcomingCount})</h2>
			{#each data.upcoming as inst}
				<div class="list-row">
					<span style="font-size:20px">{inst.task.emoji}</span>
					<span class="grow truncate">{inst.task.name}</span>
					<span class="pts tiny">+{inst.task.points} pts</span>
				</div>
			{/each}
			<a href="{base}/tasks" class="small" style="display:block; text-align:center; color:var(--accent); font-weight:600; margin-top:12px; text-decoration:none">
				Déclarer une tâche faite →
			</a>
		</div>
	{:else}
		<div class="card center">
			<div style="font-size:40px">🎉</div>
			<p style="font-weight:600; color:var(--green); margin:6px 0 0">Tout est fait pour cette semaine !</p>
		</div>
	{/if}

	<!-- Activité récente -->
	{#if data.recentDone.length > 0}
		<div class="card">
			<h2 class="card-h">✅ Dernières tâches faites</h2>
			{#each data.recentDone as inst}
				<div class="list-row small">
					<span>{inst.claimedByUser?.avatar ?? '🧑'}</span>
					<span class="muted">{inst.claimedByUser?.name ?? '—'}</span>
					<span class="dim">a fait</span>
					<span>{inst.task.emoji}</span>
					<span class="grow truncate">{inst.task.name}</span>
					<span class="pts-pos tiny">+{inst.pointsAwarded}</span>
				</div>
			{/each}
		</div>
	{/if}

</div>
