import { r as getSessionUser } from "../chunks/auth.js";
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
//#endregion
export { handle };
