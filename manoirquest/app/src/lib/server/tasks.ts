import { all, get, run } from '$lib/db';
import type { Task, InstanceDTO } from '$lib/db/schema';
import { getWeekStart } from './auth';

// ── Génération des instances de la semaine ───────────────────────────────────
// Une occurrence par tâche active (hors 'none') et par semaine. Si l'instance
// existe déjà pour la semaine courante, on ne la recrée pas.
export function generateWeeklyInstances(): void {
	const weekStart = getWeekStart();
	const today = new Date().toISOString().slice(0, 10);

	const tasks = all<Task>("SELECT * FROM tasks WHERE is_active = 1 AND recurrence != 'none'");
	for (const task of tasks) {
		const existing = get(
			'SELECT id FROM task_instances WHERE task_id = ? AND week_start = ?',
			task.id, weekStart
		);
		if (!existing) {
			run(
				"INSERT INTO task_instances (task_id, due_date, week_start, status) VALUES (?, ?, ?, 'pending')",
				task.id, today, weekStart
			);
		}
	}
}

// ── Mapping ligne SQL plate → DTO ────────────────────────────────────────────
interface InstanceRow {
	id: number;
	status: string;
	points_awarded: number | null;
	validated_at: string | null;
	task_id: number;
	task_name: string;
	task_emoji: string;
	task_points: number;
	task_difficulty: number;
	task_duration_min: number;
	claimer_id: number | null;
	claimer_name: string | null;
	claimer_avatar: string | null;
}

const INSTANCE_SELECT = `
	SELECT ti.id, ti.status, ti.points_awarded, ti.validated_at,
	       t.id   AS task_id,   t.name  AS task_name,  t.emoji AS task_emoji,
	       t.points AS task_points, t.difficulty AS task_difficulty, t.duration_min AS task_duration_min,
	       u.id   AS claimer_id, u.name AS claimer_name, u.avatar AS claimer_avatar
	FROM task_instances ti
	JOIN tasks t ON t.id = ti.task_id
	LEFT JOIN users u ON u.id = ti.claimed_by
`;

function mapInstance(r: InstanceRow): InstanceDTO {
	return {
		id: r.id,
		status: r.status as InstanceDTO['status'],
		pointsAwarded: r.points_awarded,
		validatedAt: r.validated_at,
		task: {
			id: r.task_id,
			name: r.task_name,
			emoji: r.task_emoji,
			points: r.task_points,
			difficulty: r.task_difficulty,
			durationMin: r.task_duration_min
		},
		claimedByUser: r.claimer_id
			? { id: r.claimer_id, name: r.claimer_name ?? '', avatar: r.claimer_avatar ?? '🧑' }
			: null
	};
}

// ── Lectures ──────────────────────────────────────────────────────────────────
export function getAvailableInstances(): InstanceDTO[] {
	generateWeeklyInstances();
	const weekStart = getWeekStart();
	return all<InstanceRow>(
		`${INSTANCE_SELECT} WHERE ti.week_start = ? AND ti.status = 'pending' ORDER BY t.points DESC, t.name ASC`,
		weekStart
	).map(mapInstance);
}

export function getRecentDone(limit = 8): InstanceDTO[] {
	return all<InstanceRow>(
		`${INSTANCE_SELECT} WHERE ti.status = 'done' ORDER BY ti.validated_at DESC LIMIT ?`,
		limit
	).map(mapInstance);
}

export function getHouseScore(): number {
	const weekStart = getWeekStart();
	const rows = all<{ status: string }>('SELECT status FROM task_instances WHERE week_start = ?', weekStart);
	if (!rows.length) return 0;
	const done = rows.filter(r => r.status === 'done').length;
	return Math.round((done / rows.length) * 100);
}

// ── Compléter une tâche (un geste : on choisit qui l'a faite) ─────────────────
export function completeTask(instanceId: number, personId: number): void {
	const inst = get<{ id: number; status: string; task_id: number }>(
		'SELECT id, status, task_id FROM task_instances WHERE id = ?', instanceId
	);
	if (!inst) throw new Error('Tâche introuvable');
	if (inst.status === 'done') throw new Error('Tâche déjà faite cette semaine');

	const person = get<{ id: number }>('SELECT id FROM users WHERE id = ?', personId);
	if (!person) throw new Error('Personne inconnue');

	const task = get<Task>('SELECT * FROM tasks WHERE id = ?', inst.task_id);
	const pts = task?.points ?? 0;

	run(
		`UPDATE task_instances
		 SET status = 'done', claimed_by = ?, claimed_at = datetime('now'),
		     validated_by = ?, validated_at = datetime('now'), points_awarded = ?
		 WHERE id = ?`,
		personId, personId, pts, instanceId
	);

	awardPoints(personId, pts);
	checkAndAwardBadges(personId);
}

function awardPoints(userId: number, pts: number): void {
	const user = get<{ total_points: number; weekly_points: number; week_start: string }>(
		'SELECT total_points, weekly_points, week_start FROM users WHERE id = ?', userId
	);
	if (!user) return;

	const weekStart = getWeekStart();
	const sameWeek = user.week_start === weekStart;
	const newWeekly = (sameWeek ? user.weekly_points : 0) + pts;
	const newTotal = user.total_points + pts;
	const newLevel = Math.floor(Math.sqrt(newTotal / 50)) + 1;

	run(
		'UPDATE users SET total_points = ?, weekly_points = ?, week_start = ?, level = ? WHERE id = ?',
		newTotal, newWeekly, weekStart, newLevel, userId
	);
}

// ── Attribution des badges (seuils atteints) ─────────────────────────────────
// Couvre total_points / weekly_points / task_count. Les badges 'streak_days',
// 'specific_task' et 'secret' sont ignorés ici (logique dédiée à venir).
export function checkAndAwardBadges(userId: number): void {
	const user = get<{ total_points: number; weekly_points: number }>(
		'SELECT total_points, weekly_points FROM users WHERE id = ?', userId
	);
	if (!user) return;

	const taskCount = get<{ n: number }>(
		"SELECT COUNT(*) AS n FROM task_instances WHERE claimed_by = ? AND status = 'done'", userId
	)?.n ?? 0;

	const badges = all<{ id: number; trigger_type: string; trigger_value: number }>(
		"SELECT id, trigger_type, trigger_value FROM badges WHERE trigger_type IN ('total_points','weekly_points','task_count')"
	);

	for (const b of badges) {
		let earned = false;
		if (b.trigger_type === 'total_points') earned = user.total_points >= b.trigger_value;
		else if (b.trigger_type === 'weekly_points') earned = user.weekly_points >= b.trigger_value;
		else if (b.trigger_type === 'task_count') earned = taskCount >= b.trigger_value;
		if (!earned) continue;

		const has = get('SELECT id FROM user_badges WHERE user_id = ? AND badge_id = ?', userId, b.id);
		if (!has) run('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', userId, b.id);
	}
}
