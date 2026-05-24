import { g as getSessionUser } from './auth-B82FvBEF.js';
import './db-DoQKVq8x.js';
import 'node:sqlite';
import 'fs';
import 'path';
import 'crypto';

//#region src/hooks.server.ts
var handle = async ({ event, resolve }) => {
	event.locals.base = event.request.headers.get("x-ingress-path") ?? "";
	const sessionId = event.cookies.get("session");
	event.locals.user = sessionId ? await getSessionUser(sessionId) : null;
	const path = event.url.pathname;
	const isPublic = path.startsWith("/login") || path.startsWith("/api/auth");
	if (!event.locals.user && !isPublic) return new Response(null, {
		status: 302,
		headers: { Location: `${event.locals.base}/login` }
	});
	return resolve(event);
};

export { handle };
//# sourceMappingURL=hooks.server-BlS-4AsG.js.map
