import { c as getRecentDone, d as uncompleteTask } from "../../../chunks/tasks.js";
import { fail } from "@sveltejs/kit";
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
//#endregion
export { actions, load };
