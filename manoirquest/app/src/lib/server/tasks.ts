import { all, get, run } from '$lib/db';
import type { Task, TaskInstance, User } from '$lib/db/schema';
import { getWeekStart } from './auth';

// ── Génération des instances récurrentes ────────────────────────────────────
export function generateWeeklyInstances(): void {
	const weekStart = getWeekStart();
	const today = new Date().toISOString().slice(0, 10);

	const recurring = all<Task>(
		"SELECT * FROM tasks WHERE is_active = 1 AND recurrence IN ('daily','weekly','biweekly')"
	);

	for (const task of recurring) {
		const existing = get(
			'SELECT id FROM task_instances WHERE task_id = ? AND week_start = ?',
			task.id, weekStart
		);
		if (!existing) {
			run(
				'INSERT INTO task_instances (task_id, due_date, week_start, status) VALUES (?, ?, ?, ?)',
				task.id, today, weekStart, 'pending'
			);
		}
	}
}

// ── Liste des tâches visibles pour un joueur ──────────────────────────────────
export function getTasksForUser(userId: number): TaskInstance[] {
	const weekStart = getWeekStart();
	generateWeeklyInstances();

	return all<TaskInstance>(`
		SELECT
		  ti.*,
		  t.name  AS task_name,
		  t.emoji AS task_emoji,
		  t.points AS task_points,
		  t.duration_min AS task_duration_min,
		  t.difficulty AS task_difficulty,
		  u.name   AS claimer_name,
		  u.avatar AS claimer_avatar
		FROM task_instances ti
		JOIN tasks t ON t.id = ti.task_id
		LEFT JOIN users u ON u.id = ti.claimed_by
		WHERE ti.week_start = ?
		  AND ti.status IN ('pending','claimed','awaiting_validation','refused')
		  AND (ti.assigned_to IS NULL OR ti.assigned_to = ? OR ti.claimed_by = ?)
		ORDER BY ti.created_at DESC
	`, weekStart, userId, userId);
}

// ── Tâches à valider (pour parents) ──────────────────────────────────────────
export function getPendingValidations(): TaskInstance[] {
	return all<TaskInstance>(`
		SELECT
		  ti.*,
		  t.name   AS task_name,
		  t.emoji  AS task_emoji,
		  t.points AS task_points,
		  u.name   AS claimer_name,
		  u.avatar AS claimer_avatar
		FROM task_instances ti
		JOIN tasks t ON t.id = ti.task_id
		LEFT JOIN users u ON u.id = ti.claimed_by
		WHERE ti.status = 'awaiting_validation'
		ORDER BY ti.claimed_at DESC
	`);
}

// ── Claim ─────────────────────────────────────────────────────────────────────
export function claimTask(instanceId: number, userId: number): void {
	const inst = get<TaskInstance>('SELECT * FROM task_instances WHERE id = ?', instanceId);
	if (!inst || inst.status !== 'pending') throw new Error('Tâche non disponible');
	run(
		"UPDATE task_instances SET claimed_by = ?, claimed_at = datetime('now'), status = 'claimed' WHERE id = ?",
		userId, instanceId
	);
}

// ── Déclarer terminée ─────────────────────────────────────────────────────────
export function declareTask(instanceId: number, userId: number, userRole: 'parent' | 'child'): void {
	const inst = get<TaskInstance>('SELECT * FROM task_instances WHERE id = ?', instanceId);
	if (!inst) throw new Error('Instance introuvable');
	if (inst.claimed_by !== userId && inst.assigned_to !== userId) throw new Error('Ce n\'est pas ta tâche');

	if (userRole === 'parent') {
		// Parent s'auto-valide
		const task = get<Task>('SELECT * FROM tasks WHERE id = ?', inst.task_id);
		const pts = task?.points ?? 0;
		run(
			"UPDATE task_instances SET status = 'done', validated_by = ?, validated_at = datetime('now'), points_awarded = ? WHERE id = ?",
			userId, pts, instanceId
		);
		awardPoints(userId, pts);
	} else {
		// Enfant → en attente de validation
		run("UPDATE task_instances SET status = 'awaiting_validation' WHERE id = ?", instanceId);
	}
}

// ── Valider / Refuser ─────────────────────────────────────────────────────────
export function validateTask(instanceId: number, validatorId: number, approved: boolean, reason?: string): void {
	const inst = get<TaskInstance>(
		"SELECT ti.*, t.points AS task_points FROM task_instances ti JOIN tasks t ON t.id = ti.task_id WHERE ti.id = ? AND ti.status = 'awaiting_validation'",
		instanceId
	);
	if (!inst) throw new Error('Instance introuvable ou déjà traitée');

	if (approved) {
		const pts = (inst as unknown as { task_points: number }).task_points ?? 0;
		run(
			"UPDATE task_instances SET status = 'done', validated_by = ?, validated_at = datetime('now'), points_awarded = ? WHERE id = ?",
			validatorId, pts, instanceId
		);
		if (inst.claimed_by) awardPoints(inst.claimed_by, pts);
	} else {
		run("UPDATE task_instances SET status = 'refused', refusal_reason = ? WHERE id = ?", reason ?? 'Refusé', instanceId);
	}
}

// ── Créditer des points ───────────────────────────────────────────────────────
function awardPoints(userId: number, pts: number): void {
	const user = get<User>('SELECT * FROM users WHERE id = ?', userId);
	if (!user) return;

	const weekStart = getWeekStart();
	const sameWeek = user.week_start === weekStart;
	const newWeekly = sameWeek ? user.weekly_points + pts : pts;
	const newTotal  = user.total_points + pts;
	const newLevel  = Math.floor(Math.sqrt(newTotal / 50)) + 1;

	run(
		'UPDATE users SET total_points = ?, weekly_points = ?, week_start = ?, level = ? WHERE id = ?',
		newTotal, newWeekly, weekStart, newLevel, userId
	);
}
