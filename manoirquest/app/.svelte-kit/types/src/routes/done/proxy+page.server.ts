// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getRecentDone, uncompleteTask } from '$lib/server/tasks';

export const load = async () => {
	return { done: getRecentDone(100) };
};

export const actions = {
	// Annuler une tâche faite → repasse en « à faire » et retire les points.
	undo: async ({ request }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		const instanceId = Number(data.get('instanceId'));
		if (!instanceId) return fail(400, { error: 'Tâche invalide' });
		try {
			uncompleteTask(instanceId);
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { success: true };
	}
};
;null as any as PageServerLoad;;null as any as Actions;