<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	export let data: LayoutData;

	const navItems = [
		{ href: '/',            icon: '🏠', label: 'Maison'     },
		{ href: '/tasks',       icon: '📋', label: 'Tâches'     },
		{ href: '/leaderboard', icon: '🏆', label: 'Classement' },
		{ href: '/profile',     icon: '👤', label: 'Profil'     },
	];

	async function logout() {
		await fetch('/api/auth', { method: 'POST' });
		window.location.href = '/login';
	}
</script>

{#if data.user}
<div class="flex flex-col min-h-screen bg-gray-50">
	<!-- Top bar -->
	<header class="bg-purple-700 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-10">
		<div class="flex items-center gap-2">
			<span class="text-xl">🏠</span>
			<span class="font-bold text-lg">ManoirQuest</span>
		</div>
		<div class="flex items-center gap-3">
			<span class="text-sm bg-purple-600 px-2 py-1 rounded-full">
				{data.user.avatar} {data.user.name}
			</span>
			<button on:click={logout} class="text-purple-200 text-xs hover:text-white">Quitter</button>
		</div>
	</header>

	<!-- Content -->
	<main class="flex-1 pb-20 overflow-y-auto">
		<slot />
	</main>

	<!-- Bottom nav -->
	<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 safe-area-bottom">
		<div class="flex">
			{#each navItems as item}
				{@const active = $page.url.pathname === item.href}
				<a
					href={item.href}
					class="flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors
					       {active ? 'text-purple-700 font-semibold' : 'text-gray-500'}"
				>
					<span class="text-xl">{item.icon}</span>
					<span>{item.label}</span>
					{#if active}
						<span class="absolute bottom-0 w-8 h-0.5 bg-purple-600 rounded-t-full"></span>
					{/if}
				</a>
			{/each}
		</div>
	</nav>
</div>
{:else}
<slot />
{/if}

<style>
	:global(body) { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
	.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
</style>
