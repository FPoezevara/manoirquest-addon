import { a as all } from './db-DoQKVq8x.js';
import { v as verifyPin, c as createSession } from './auth-B82FvBEF.js';
import { fail, redirect } from '@sveltejs/kit';
import 'node:sqlite';
import 'fs';
import 'path';
import 'crypto';

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

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CyKRHVel.js')).default;
const server_id = "src/routes/login/+page.server.ts";
const imports = ["_app/immutable/nodes/4.B1yMGA0B.js","_app/immutable/chunks/DUZ7yc7H.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/CKzn0cD3.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-Y1rWWYZG.js.map
