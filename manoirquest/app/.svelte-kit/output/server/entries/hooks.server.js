//#region src/hooks.server.ts
var handle = async ({ event, resolve }) => {
	event.locals.base = event.request.headers.get("x-ingress-path") ?? "";
	return resolve(event);
};
//#endregion
export { handle };
