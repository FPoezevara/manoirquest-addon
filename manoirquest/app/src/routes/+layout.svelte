<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	export let data: LayoutData;

	$: base = data.base ?? '';
	$: current = $page.url.pathname.replace(base, '') || '/';

	const navItems = [
		{ href: '/',            icon: '🏠', label: 'Maison'     },
		{ href: '/tasks',       icon: '📋', label: 'Tâches'     },
		{ href: '/done',        icon: '✅', label: 'Faites'     },
		{ href: '/leaderboard', icon: '🏆', label: 'Classement' },
		{ href: '/profile',     icon: '👤', label: 'Profil'     },
	];
</script>

<!-- Fond d'écran auto-hébergé : calque fixe plein écran. On construit l'URL avec
     `base` (préfixe d'ingress runtime), comme les liens de nav → correct sous HAOS. -->
<div class="app-bg" style="background-image: url('{base}/background.jpg')" aria-hidden="true"></div>

<div class="app">
	<header class="app-header">
		<span class="logo">🏠</span>
		<span class="title">ManoirQuest</span>
		<a href="{base}/settings" class="gear" class:active={current === '/settings'} aria-label="Réglages des tâches" title="Réglages">⚙️</a>
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
