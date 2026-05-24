import { n as deleteSession } from "../../../../chunks/auth.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/auth/+server.ts
var POST = async ({ cookies }) => {
	const sessionId = cookies.get("session");
	if (sessionId) {
		await deleteSession(sessionId);
		cookies.delete("session", { path: "/" });
	}
	return json({ ok: true });
};
//#endregion
export { POST };
