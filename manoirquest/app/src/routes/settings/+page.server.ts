import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { listCatalogue, createTask, updateTask, deleteTask } from '$lib/server/tasks';

function readDays(data: FormData): number[] {
	return data.getAll('day').map((d) => Number(d)).filter((n) => n >= 1 && n <= 7);
}

export const load: PageServerLoad = async () => {
	return { catalogue: listCatalogue(false) };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		try {
			createTask({
				name: String(data.get('name') ?? ''),
				emoji: String(data.get('emoji') ?? ''),
				points: Number(data.get('points')),
				kind: String(data.get('kind') ?? 'weekly'),
				days: readDays(data)
			});
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { created: true };
	},

	update: async ({ request }) => {
		const data = await request.formData();
		try {
			updateTask({
				id: Number(data.get('id')),
				name: String(data.get('name') ?? ''),
				emoji: String(data.get('emoji') ?? ''),
				points: Number(data.get('points')),
				kind: String(data.get('kind') ?? 'weekly'),
				days: readDays(data),
				active: data.get('active') === 'on'
			});
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { updated: true };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Tâche invalide' });
		deleteTask(id);
		return { deleted: true };
	}
};
