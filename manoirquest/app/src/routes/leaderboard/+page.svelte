<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	let tab: 'week' | 'alltime' = 'week';
	$: list = tab === 'week' ? data.weekly : data.allTime;
	$: scoreKey = (tab === 'week' ? 'weeklyPoints' : 'totalPoints') as 'weeklyPoints' | 'totalPoints';

	const medals = ['🥇', '🥈', '🥉'];
</script>

<svelte:head><title>ManoirQuest — Classement</title></svelte:head>

<div class="seg">
	<button class:on={tab === 'week'} on:click={() => tab = 'week'}>Cette semaine</button>
	<button class:on={tab === 'alltime'} on:click={() => tab = 'alltime'}>Tout temps</button>
</div>

{#if list.length >= 3}
	<div class="podium">
		<div class="podium-col">
			<span class="av">{list[1].avatar}</span>
			<span class="nm">{list[1].name}</span>
			<div class="podium-bar silver">{list[1][scoreKey]}</div>
		</div>
		<div class="podium-col">
			<span class="av" style="font-size:48px">{list[0].avatar}</span>
			<span class="nm">{list[0].name}</span>
			<div class="podium-bar gold">{list[0][scoreKey]}</div>
		</div>
		<div class="podium-col">
			<span class="av">{list[2].avatar}</span>
			<span class="nm">{list[2].name}</span>
			<div class="podium-bar bronze">{list[2][scoreKey]}</div>
		</div>
	</div>
{/if}

<div class="card" style="padding:4px 16px">
	{#each list as player, i}
		<div class="list-row">
			<span class="rank">{medals[i] ?? `${i + 1}.`}</span>
			<span class="avatar" style="font-size:24px">{player.avatar}</span>
			<div class="grow">
				<p style="font-weight:600; margin:0">{player.name}</p>
				<p class="lvl" style="margin:0">
					Niveau {player.level}
					{#if player.badges && player.badges.length}· <span class="chips">{player.badges.map(b => b.emoji).join('')}</span>{/if}
				</p>
			</div>
			<div style="text-align:right">
				<p class="pts" style="margin:0">{player[scoreKey]} pts</p>
				{#if tab === 'week'}<p class="lvl" style="margin:0">Total : {player.totalPoints}</p>{/if}
			</div>
		</div>
	{/each}
</div>
