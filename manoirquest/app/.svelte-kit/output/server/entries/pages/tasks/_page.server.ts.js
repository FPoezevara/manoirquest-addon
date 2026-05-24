import { l as listCatalogue, n as completeTask, o as getDueGroups, t as addInstance, u as setInstanceDate } from "../../../chunks/tasks.js";
import { fail } from "@sveltejs/kit";
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
//#endregion
export { actions, load };
