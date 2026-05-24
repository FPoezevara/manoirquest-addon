import { t as all } from "../../../chunks/db.js";
import { a as verifyPin, t as createSession } from "../../../chunks/auth.js";
import { fail, redirect } from "@sveltejs/kit";
//#region src/routes/login/+page.server.ts
var load = async ({ locals }) => {
	if (locals.user) throw redirect(302, `${locals.base}/`);
	return { players: all("SELECT id, name, avatar, role FROM users ORDER BY id") };
};
var actions = { login: async ({ request, cookies, locals }) => {
	const data = await request.formData();
	const userId = Number(data.get("userId"));
	const pin = String(data.get("pin") ?? "");
	if (!userId || pin.length !== 4 || !/^\d{4}$/.test(pin)) return fail(400, { error: "PIN invalide (4 chiffres requis)" });
	const user = verifyPin(userId, pin);
	if (!user) return fail(401, {
		error: "PIN incorrect. Réessaie !",
		userId
	});
	const sessionId = createSession(user.id);
	cookies.set("session", sessionId, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		maxAge: 72 * 3600,
		secure: false
	});
	throw redirect(302, `${locals.base}/`);
} };
//#endregion
export { actions, load };
