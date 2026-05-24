import { d as deleteSession } from './auth-B82FvBEF.js';
import { json } from '@sveltejs/kit';
import './db-DoQKVq8x.js';
import 'node:sqlite';
import 'fs';
import 'path';
import 'crypto';

//#region src/routes/api/auth/+server.ts
var POST = async ({ cookies }) => {
	const sessionId = cookies.get("session");
	if (sessionId) {
		await deleteSession(sessionId);
		cookies.delete("session", { path: "/" });
	}
	return json({ ok: true });
};

export { POST };
//# sourceMappingURL=_server.ts-DMj39SOo.js.map
