import type { PageServerLoad } from './$types';
import { all, get, run } from '$lib/db';
import type { User, TaskInstance } from '$lib/db/schema';
import { getWeekStart } from '$lib/server/auth';
import { generateWeeklyInstances, getPendingValidations } from '$lib/server/tasks';

export const load: PageServerLoad = async ({ locals }) => {
	generateWeeklyInstances();

	const weekStart = getWeekStart();

	// Reset weekly score si nouvelle semaine
	const allUsers = all<User>('SELECT * FROM users');
	for (const u of allUsers) {
		if (u.week_start !== weekStart) {
			run('UPDATE users SET weekly_points = 0, week_start = ? WHERE id = ?', weekStart, u.id);
			u.weekly_points = 0;
			u.week_start = weekStart;
		}
	}

	const leaderboard = [...allUsers].sort((a, b) => b.weekly_points - a.weekly_points);

	// Tâches urgentes de la semaine (pending / claimed)
	const urgent = all<TaskInstance & { task_name: string; task_emoji: string; task_points: number }>(`
		SELECT ti.*, t.name AS task_name, t.emoji AS task_emoji, t.points AS task_points
		FROM task_instances ti
		JOIN tasks t ON t.id = ti.task_id
		WHERE ti.week_start = ? AND ti.status IN ('pending','claimed')
		ORDER BY ti.due_date ASC LIMIT 5
	`, weekStart);

	// Tâches à valider (parents uniquement)
	const pendingValidation = locals.user?.role === 'parent' ? getPendingValidations() : [];

	// Jauge maison
	const allThisWeek = all<{ status: string }>('SELECT status FROM task_instances WHERE week_start = ?', weekStart);
	const doneCount  = allThisWeek.filter(t => t.status === 'done').length;
	const houseScore = allThisWeek.length ? Math.round((doneCount / allThisWeek.length) * 100) : 0;

	// Activité récente
	const recentDone = all<TaskInstance>(`
		SELECT ti.*, t.name AS task_name, t.emoji AS task_emoji,
		       u.name AS claimer_name, u.avatar AS claimer_avatar
		FROM task_instances ti
		JOIN tasks t ON t.id = ti.task_id
		LEFT JOIN users u ON u.id = ti.claimed_by
		WHERE ti.status = 'done'
		ORDER BY ti.validated_at DESC LIMIT 6
	`);

	return { leaderboard, urgent, pendingValidation, houseScore, recentDone };
};
