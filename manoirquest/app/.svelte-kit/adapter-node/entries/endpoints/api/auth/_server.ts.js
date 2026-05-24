import { json } from "@sveltejs/kit";
//#region src/routes/api/auth/+server.ts
var POST = async () => json({ ok: true });
//#endregion
export { POST };
