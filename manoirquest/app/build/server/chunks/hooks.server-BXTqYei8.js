//#region src/hooks.server.ts
var handle = async ({ event, resolve }) => {
	event.locals.base = event.request.headers.get("x-ingress-path") ?? "";
	return resolve(event);
};

export { handle };
//# sourceMappingURL=hooks.server-BXTqYei8.js.map
