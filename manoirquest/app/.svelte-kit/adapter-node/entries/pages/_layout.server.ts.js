//#region src/routes/+layout.server.ts
var load = async ({ locals }) => {
	return {
		user: locals.user,
		base: locals.base
	};
};
//#endregion
export { load };
