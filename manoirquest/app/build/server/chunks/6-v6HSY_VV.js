import { r as run } from './db-DoQKVq8x.js';
import { a as getWeekStart } from './auth-B82FvBEF.js';
import { v as validateTask, d as declareTask, c as claimTask, b as getTasksForUser } from './tasks-CPnLy6J4.js';
import { fail } from '@sveltejs/kit';
import 'node:sqlite';
import 'fs';
import 'path';
import 'crypto';

//#region src/routes/tasks/+page.server.ts
var load = async ({ locals }) => {
	const userId = locals.user.id;
	const instances = getTasksForUser(userId);
	return {
		available: instances.filter((i) => i.status === "pending" && (i.assigned_to === null || i.assigned_to === userId)),
		myClaimed: instances.filter((i) => i.claimed_by === userId && i.status === "claimed"),
		myPending: instances.filter((i) => i.claimed_by === userId && i.status === "awaiting_validation"),
		toValidate: locals.user.role === "parent" ? instances.filter((i) => i.status === "awaiting_validation") : []
	};
};
var actions = {
	claim: async ({ request, locals }) => {
		const data = await request.formData();
		try {
			claimTask(Number(data.get("instanceId")), locals.user.id);
		} catch (e) {
			return fail(400, { error: e.message });
		}
	},
	declare: async ({ request, locals }) => {
		const data = await request.formData();
		try {
			declareTask(Number(data.get("instanceId")), locals.user.id, locals.user.role);
		} catch (e) {
			return fail(400, { error: e.message });
		}
	},
	validate: async ({ request, locals }) => {
		if (locals.user.role !== "parent") return fail(403, { error: "Réservé aux parents" });
		const data = await request.formData();
		try {
			validateTask(Number(data.get("instanceId")), locals.user.id, data.get("approved") === "true");
		} catch (e) {
			return fail(400, { error: e.message });
		}
	},
	refuse: async ({ request, locals }) => {
		if (locals.user.role !== "parent") return fail(403, { error: "Réservé aux parents" });
		const data = await request.formData();
		try {
			validateTask(Number(data.get("instanceId")), locals.user.id, false, "Refusé");
		} catch (e) {
			return fail(400, { error: e.message });
		}
	},
	addManual: async ({ request, locals }) => {
		if (locals.user.role !== "parent") return fail(403, { error: "Réservé aux parents" });
		const data = await request.formData();
		run("INSERT INTO task_instances (task_id, assigned_to, due_date, week_start, status) VALUES (?, ?, date(\"now\"), ?, \"pending\")", Number(data.get("taskId")), data.get("assignTo") ? Number(data.get("assignTo")) : null, getWeekStart());
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DoAE3wM2.js')).default;
const server_id = "src/routes/tasks/+page.server.ts";
const imports = ["_app/immutable/nodes/6._E7ONWD1.js","_app/immutable/chunks/DUZ7yc7H.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/CKzn0cD3.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-v6HSY_VV.js.map
