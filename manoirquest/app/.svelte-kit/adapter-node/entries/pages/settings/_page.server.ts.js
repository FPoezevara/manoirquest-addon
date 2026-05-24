import { d as listRewards, n as createReward, p as updateReward, r as deleteReward } from "../../../chunks/players.js";
import { f as updateTask, i as deleteTask, l as listCatalogue, r as createTask } from "../../../chunks/tasks.js";
import { fail } from "@sveltejs/kit";
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
//#endregion
export { actions, load };
