import type { Handle } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// Préfixe d'ingress HA : connu seulement au runtime (header X-Ingress-Path).
	// HA strippe ce préfixe avant de forwarder, donc event.url.pathname est déjà "nu".
	// On le propage pour reconstruire des URLs absolues qui restent sous l'ingress.
	event.locals.base = event.request.headers.get('x-ingress-path') ?? '';

	const sessionId = event.cookies.get('session');
	event.locals.user = sessionId ? await getSessionUser(sessionId) : null;

	// Protect all routes except /login and /api/auth
	const path = event.url.pathname;
	const isPublic = path.startsWith('/login') || path.startsWith('/api/auth');

	if (!event.locals.user && !isPublic) {
		return new Response(null, {
			status: 302,
			headers: { Location: `${event.locals.base}/login` }
		});
	}

	return resolve(event);
};
