<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	export let data: LayoutData;

	// Préfixe d'ingress runtime (vide hors ingress)
	$: base = data.base ?? '';
	// Chemin courant débarrassé du préfixe, pour l'état actif de la nav.
	$: current = $page.url.pathname.replace(base, '') || '/';

	const navItems = [
		{ href: '/',            icon: '🏠', label: 'Maison'     },
		{ href: '/tasks',       icon: '📋', label: 'Tâches'     },
		{ href: '/leaderboard', icon: '🏆', label: 'Classement' },
		{ href: '/profile',     icon: '👤', label: 'Profil'     },
	];
</script>

<div class="app">
	<header class="app-header">
		<span class="logo">🏠</span>
		<span class="title">ManoirQuest</span>
		<span class="sub">Tableau familial</span>
	</header>

	<main class="app-main">
		<slot />
	</main>

	<nav class="tabbar">
		{#each navItems as item}
			{@const active = current === item.href}
			<a href={base + item.href} class="tab" class:active>
				<span class="ic">{item.icon}</span>
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>
</div>
