import type { Handle } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');
	event.locals.user = sessionId ? await getSessionUser(sessionId) : null;

	// Protect all routes except /login and /api/auth
	const path = event.url.pathname;
	const isPublic = path.startsWith('/login') || path.startsWith('/api/auth');

	if (!event.locals.user && !isPublic) {
		return new Response(null, {
			status: 302,
			headers: { Location: '/login' }
		});
	}

	return resolve(event);
};
