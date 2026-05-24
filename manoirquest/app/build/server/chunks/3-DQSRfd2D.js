import { u as uncompleteTask, h as getRecentDone } from './tasks-Coyc2aY6.js';
import { fail } from '@sveltejs/kit';
import './auth-BBzAbgAR.js';
import 'node:sqlite';
import 'fs';
import 'path';

//#region src/routes/done/+page.server.ts
var load = async () => {
	return { done: getRecentDone(100) };
};
var actions = { undo: async ({ request }) => {
	const data = await request.formData();
	const instanceId = Number(data.get("instanceId"));
	if (!instanceId) return fail(400, { error: "Tâche invalide" });
	try {
		uncompleteTask(instanceId);
	} catch (e) {
		return fail(400, { error: e.message });
	}
	return { success: true };
} };

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CQUZ9WAQ.js')).default;
const server_id = "src/routes/done/+page.server.ts";
const imports = ["_app/immutable/nodes/3.DaTTkbDF.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/1sAtSMT6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-DQSRfd2D.js.map
