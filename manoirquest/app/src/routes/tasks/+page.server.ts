import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { all, run } from '$lib/db';
import { getTasksForUser, claimTask, declareTask, validateTask } from '$lib/server/tasks';
import { getWeekStart } from '$lib/server/auth';
import type { TaskInstance } from '$lib/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;
	const instances = getTasksForUser(userId);

	const available  = instances.filter(i => i.status === 'pending' && (i.assigned_to === null || i.assigned_to === userId));
	const myClaimed  = instances.filter(i => i.claimed_by === userId && i.status === 'claimed');
	const myPending  = instances.filter(i => i.claimed_by === userId && i.status === 'awaiting_validation');
	const toValidate = locals.user!.role === 'parent'
		? instances.filter(i => i.status === 'awaiting_validation')
		: [];

	return { available, myClaimed, myPending, toValidate };
};

export const actions: Actions = {
	claim: async ({ request, locals }) => {
		const data = await request.formData();
		try { claimTask(Number(data.get('instanceId')), locals.user!.id); }
		catch (e: unknown) { return fail(400, { error: (e as Error).message }); }
	},

	declare: async ({ request, locals }) => {
		const data = await request.formData();
		try { declareTask(Number(data.get('instanceId')), locals.user!.id, locals.user!.role); }
		catch (e: unknown) { return fail(400, { error: (e as Error).message }); }
	},

	validate: async ({ request, locals }) => {
		if (locals.user!.role !== 'parent') return fail(403, { error: 'Réservé aux parents' });
		const data = await request.formData();
		try { validateTask(Number(data.get('instanceId')), locals.user!.id, data.get('approved') === 'true'); }
		catch (e: unknown) { return fail(400, { error: (e as Error).message }); }
	},

	refuse: async ({ request, locals }) => {
		if (locals.user!.role !== 'parent') return fail(403, { error: 'Réservé aux parents' });
		const data = await request.formData();
		try { validateTask(Number(data.get('instanceId')), locals.user!.id, false, 'Refusé'); }
		catch (e: unknown) { return fail(400, { error: (e as Error).message }); }
	},

	addManual: async ({ request, locals }) => {
		if (locals.user!.role !== 'parent') return fail(403, { error: 'Réservé aux parents' });
		const data = await request.formData();
		const taskId   = Number(data.get('taskId'));
		const assignTo = data.get('assignTo') ? Number(data.get('assignTo')) : null;
		run(
			'INSERT INTO task_instances (task_id, assigned_to, due_date, week_start, status) VALUES (?, ?, date("now"), ?, "pending")',
			taskId, assignTo, getWeekStart()
		);
	}
};
