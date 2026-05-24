// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getDueGroups, completeTask, addInstance, setInstanceDate, listCatalogue } from '$lib/server/tasks';

export const load = async () => {
	return {
		groups: getDueGroups(),
		catalogue: listCatalogue(true) // tâches actives, pour l'ajout manuel
	};
};

export const actions = {
	// Un geste : on choisit qui a fait la tâche → points immédiats.
	complete: async ({ request }: import('./$types').RequestEvent) => {
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
	add: async ({ request }: import('./$types').RequestEvent) => {
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
	setDate: async ({ request }: import('./$types').RequestEvent) => {
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
	}
};
;null as any as PageServerLoad;;null as any as Actions;