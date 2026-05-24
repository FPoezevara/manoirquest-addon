import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getRecentDone, uncompleteTask } from '$lib/server/tasks';

export const load: PageServerLoad = async () => {
	return { done: getRecentDone(100) };
};

export const actions: Actions = {
	// Annuler une tâche faite → repasse en « à faire » et retire les points.
	undo: async ({ request }) => {
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
