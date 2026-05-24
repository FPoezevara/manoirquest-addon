import { s as setInstanceDate, a as addInstance, c as completeTask, l as listCatalogue, e as getDueGroups } from './tasks-Coyc2aY6.js';
import { fail } from '@sveltejs/kit';
import './auth-BBzAbgAR.js';
import 'node:sqlite';
import 'fs';
import 'path';

//#region src/routes/tasks/+page.server.ts
var load = async () => {
	return {
		groups: getDueGroups(),
		catalogue: listCatalogue(true)
	};
};
var actions = {
	complete: async ({ request }) => {
		const data = await request.formData();
		const instanceId = Number(data.get("instanceId"));
		const userId = Number(data.get("userId"));
		if (!instanceId || !userId) return fail(400, { error: "Choisis qui a fait la tâche" });
		try {
			completeTask(instanceId, userId);
		} catch (e) {
			return fail(400, { error: e.message });
		}
		return { success: true };
	},
	add: async ({ request }) => {
		const data = await request.formData();
		const taskId = Number(data.get("taskId"));
		if (!taskId) return fail(400, { error: "Choisis une tâche à ajouter" });
		try {
			addInstance(taskId);
		} catch (e) {
			return fail(400, { error: e.message });
		}
		return { added: true };
	},
	setDate: async ({ request }) => {
		const data = await request.formData();
		const instanceId = Number(data.get("instanceId"));
		const date = String(data.get("date") ?? "");
		if (!instanceId || !date) return fail(400, { error: "Date invalide" });
		try {
			setInstanceDate(instanceId, date);
		} catch (e) {
			return fail(400, { error: e.message });
		}
		return { dated: true };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CFBUjaVV.js')).default;
const server_id = "src/routes/tasks/+page.server.ts";
const imports = ["_app/immutable/nodes/8.CGobRoWL.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/1sAtSMT6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-C7KG1Kns.js.map
