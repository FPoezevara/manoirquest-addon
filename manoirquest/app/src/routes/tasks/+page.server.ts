import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getAvailableInstances, getRecentDone, completeTask } from '$lib/server/tasks';

export const load: PageServerLoad = async () => {
	return {
		available: getAvailableInstances(),
		recentDone: getRecentDone(8)
	};
};

export const actions: Actions = {
	// Un geste : on choisit qui a fait la tâche → points attribués immédiatement.
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
	}
};
