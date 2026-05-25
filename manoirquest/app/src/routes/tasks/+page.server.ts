import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getDueGroups, completeTask, addInstance, setInstanceDate, listCatalogue, deleteInstance } from '$lib/server/tasks';

export const load: PageServerLoad = async () => {
	return {
		groups: getDueGroups(),
		catalogue: listCatalogue(true) // tâches actives, pour l'ajout manuel
	};
};

export const actions: Actions = {
	// Un geste : on choisit qui a fait la tâche → points immédiats.
	complete: async ({ request }) => {
		const data = await request.formData();
		const instanceId = Number(data.get('instanceId'));
		const userId = Number(data.get('userId'));
		if (!instanceId || !userId) return fail(400, { error: 'Choisis qui a fait la tâche' });
		try {
			completeTask(instanceId, userId);
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { success: true };
	},

	// Ajout manuel d'une occurrence d'une tâche du catalogue.
	add: async ({ request }) => {
		const data = await request.formData();
		const taskId = Number(data.get('taskId'));
		if (!taskId) return fail(400, { error: 'Choisis une tâche à ajouter' });
		try {
			addInstance(taskId);
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { added: true };
	},

	// Attribution / changement de la date d'échéance d'une occurrence.
	setDate: async ({ request }) => {
		const data = await request.formData();
		const instanceId = Number(data.get('instanceId'));
		const date = String(data.get('date') ?? '');
		if (!instanceId || !date) return fail(400, { error: 'Date invalide' });
		try {
			setInstanceDate(instanceId, date);
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { dated: true };
	},

	// Retirer une occurrence de la liste « à faire ».
	// Ponctuel : disparaît. Récurrent : sautée → replanifiée à la prochaine échéance.
	delete: async ({ request }) => {
		const data = await request.formData();
		const instanceId = Number(data.get('instanceId'));
		if (!instanceId) return fail(400, { error: 'Occurrence invalide' });
		try {
			deleteInstance(instanceId);
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { deleted: true };
	}
};
