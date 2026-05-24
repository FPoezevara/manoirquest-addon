import { r as run } from "../../../chunks/db.js";
import { i as getWeekStart } from "../../../chunks/auth.js";
import { a as getTasksForUser, n as declareTask, o as validateTask, t as claimTask } from "../../../chunks/tasks.js";
import { fail } from "@sveltejs/kit";
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
//#endregion
export { actions, load };
