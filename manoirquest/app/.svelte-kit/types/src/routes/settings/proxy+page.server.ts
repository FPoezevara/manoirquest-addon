// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { listCatalogue, createTask, updateTask, deleteTask } from '$lib/server/tasks';
import { listRewards, createReward, updateReward, deleteReward } from '$lib/server/players';

function readDays(data: FormData): number[] {
	return data.getAll('day').map((d) => Number(d)).filter((n) => n >= 1 && n <= 7);
}
function readAnchor(data: FormData): number | null {
	const n = Number(data.get('anchorDay'));
	return n >= 1 && n <= 7 ? n : null;
}

export const load = async () => {
	return {
		catalogue: listCatalogue(false),
		rewards: listRewards()
	};
};

export const actions = {
	// ── Tâches ──────────────────────────────────────────────────────────────
	create: async ({ request }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		try {
			createTask({
				name: String(data.get('name') ?? ''),
				emoji: String(data.get('emoji') ?? ''),
				points: Number(data.get('points')),
				difficulty: Number(data.get('difficulty')),
				kind: String(data.get('kind') ?? 'weekly'),
				days: readDays(data),
				anchorDay: readAnchor(data)
			});
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { created: true };
	},

	update: async ({ request }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		try {
			updateTask({
				id: Number(data.get('id')),
				name: String(data.get('name') ?? ''),
				emoji: String(data.get('emoji') ?? ''),
				points: Number(data.get('points')),
				difficulty: Number(data.get('difficulty')),
				kind: String(data.get('kind') ?? 'weekly'),
				days: readDays(data),
				anchorDay: readAnchor(data),
				active: data.get('active') === 'on'
			});
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { updated: true };
	},

	delete: async ({ request }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Tâche invalide' });
		deleteTask(id);
		return { deleted: true };
	},

	// ── Récompenses ───────────────────────────────────────────────────────────
	createReward: async ({ request }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		try {
			createReward({
				name: String(data.get('name') ?? ''),
				emoji: String(data.get('emoji') ?? ''),
				description: String(data.get('description') ?? ''),
				cost: Number(data.get('cost'))
			});
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { rewardCreated: true };
	},

	updateReward: async ({ request }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		try {
			updateReward({
				id: Number(data.get('id')),
				name: String(data.get('name') ?? ''),
				emoji: String(data.get('emoji') ?? ''),
				description: String(data.get('description') ?? ''),
				cost: Number(data.get('cost')),
				active: data.get('active') === 'on'
			});
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { rewardUpdated: true };
	},

	deleteReward: async ({ request }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Récompense invalide' });
		deleteReward(id);
		return { rewardDeleted: true };
	}
};
;null as any as PageServerLoad;;null as any as Actions;