import { redirect } from "@sveltejs/kit";
//#region src/routes/login/+page.server.ts
var load = async ({ locals }) => {
	throw redirect(307, `${locals.base}/`);
};
//#endregion
export { load };
