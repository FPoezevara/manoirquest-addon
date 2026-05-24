import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: true
		}),
		// Derrière l'ingress HA (reverse-proxy), l'Origin du POST (host HA public) ne
		// correspond pas à l'origin interne calculée par adapter-node → SvelteKit rejette
		// les form actions en 403. On coupe le check : l'app est déjà protégée par l'auth
		// HA + le PIN, et l'origin varie selon l'accès (local / IP / Nabu Casa).
		csrf: { checkOrigin: false },
		// Le sous-chemin d'ingress HAOS n'est connu qu'au runtime (header X-Ingress-Path),
		// donc on ne peut PAS le figer dans `base` au build. On garde base='' et on
		// applique le préfixe runtime (locals.base / data.base) aux liens/redirections.
		// `relative: true` rend les URLs d'assets relatives → elles restent sous l'ingress.
		paths: {
			relative: true
		}
	}
};

export default config;
