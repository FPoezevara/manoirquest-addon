import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Préfixe d'ingress HA (X-Ingress-Path), connu seulement au runtime.
	// Propagé pour reconstruire des URLs absolues qui restent sous l'ingress.
	// Plus d'auth : l'app est un dashboard familial partagé, toutes les routes sont publiques.
	event.locals.base = event.request.headers.get('x-ingress-path') ?? '';
	return resolve(event);
};
