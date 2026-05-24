import { d as deleteReward, u as updateReward, a as createReward, j as listRewards } from './players-uz-MVUuf.js';
import { d as deleteTask, i as updateTask, b as createTask, l as listCatalogue } from './tasks-Coyc2aY6.js';
import { fail } from '@sveltejs/kit';
import './auth-BBzAbgAR.js';
import 'node:sqlite';
import 'fs';
import 'path';

//#region src/routes/settings/+page.server.ts
function readDays(data) {
	return data.getAll("day").map((d) => Number(d)).filter((n) => n >= 1 && n <= 7);
}
function readAnchor(data) {
	const n = Number(data.get("anchorDay"));
	return n >= 1 && n <= 7 ? n : null;
}
var load = async () => {
	return {
		catalogue: listCatalogue(false),
		rewards: listRewards()
	};
};
var actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		try {
			createTask({
				name: String(data.get("name") ?? ""),
				emoji: String(data.get("emoji") ?? ""),
				points: Number(data.get("points")),
				difficulty: Number(data.get("difficulty")),
				kind: String(data.get("kind") ?? "weekly"),
				days: readDays(data),
				anchorDay: readAnchor(data)
			});
		} catch (e) {
			return fail(400, { error: e.message });
		}
		return { created: true };
	},
	update: async ({ request }) => {
		const data = await request.formData();
		try {
			updateTask({
				id: Number(data.get("id")),
				name: String(data.get("name") ?? ""),
				emoji: String(data.get("emoji") ?? ""),
				points: Number(data.get("points")),
				difficulty: Number(data.get("difficulty")),
				kind: String(data.get("kind") ?? "weekly"),
				days: readDays(data),
				anchorDay: readAnchor(data),
				active: data.get("active") === "on"
			});
		} catch (e) {
			return fail(400, { error: e.message });
		}
		return { updated: true };
	},
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { error: "Tâche invalide" });
		deleteTask(id);
		return { deleted: true };
	},
	createReward: async ({ request }) => {
		const data = await request.formData();
		try {
			createReward({
				name: String(data.get("name") ?? ""),
				emoji: String(data.get("emoji") ?? ""),
				description: String(data.get("description") ?? ""),
				cost: Number(data.get("cost"))
			});
		} catch (e) {
			return fail(400, { error: e.message });
		}
		return { rewardCreated: true };
	},
	updateReward: async ({ request }) => {
		const data = await request.formData();
		try {
			updateReward({
				id: Number(data.get("id")),
				name: String(data.get("name") ?? ""),
				emoji: String(data.get("emoji") ?? ""),
				description: String(data.get("description") ?? ""),
				cost: Number(data.get("cost")),
				active: data.get("active") === "on"
			});
		} catch (e) {
			return fail(400, { error: e.message });
		}
		return { rewardUpdated: true };
	},
	deleteReward: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get("id"));
		if (!id) return fail(400, { error: "Récompense invalide" });
		deleteReward(id);
		return { rewardDeleted: true };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-SEXJIqw-.js')).default;
const server_id = "src/routes/settings/+page.server.ts";
const imports = ["_app/immutable/nodes/7.DNv88gGq.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/1sAtSMT6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-BN5xhPoa.js.map
