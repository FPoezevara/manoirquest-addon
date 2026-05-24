import { all, get, run } from '$lib/db';
import type { InstanceDTO, ScheduleKind } from '$lib/db/schema';
import { getWeekStart } from './auth';

// ── Utilitaires dates / jours ────────────────────────────────────────────────
function todayStr(): string {
	return new Date().toISOString().slice(0, 10);
}
// 1 = lundi … 7 = dimanche
function isoWeekday(d = new Date()): number {
	const x = d.getDay();
	return x === 0 ? 7 : x;
}
export function parseDays(csv: string | null | undefined): number[] {
	return (csv ?? '').split(',').map((s) => Number(s.trim())).filter((n) => n >= 1 && n <= 7);
}
export function daysToCsv(days: number[]): string {
	return [...new Set(days)].filter((n) => n >= 1 && n <= 7).sort((a, b) => a - b).join(',');
}

// ── Génération datée des occurrences dues ────────────────────────────────────
// weekdays : une occurrence le(s) jour(s) coché(s) — déduplication par jour.
// weekly   : une par semaine. biweekly : ~1 toutes les 2 semaines. monthly : 1/mois.
// manual   : jamais auto-générée (uniquement via ajout manuel).
export function generateDueInstances(): void {
	const today = todayStr();
	const weekday = isoWeekday();
	const weekStart = getWeekStart();
	const month = today.slice(0, 7);

	const tasks = all<{ id: number; sched_kind: ScheduleKind; sched_days: string }>(
		'SELECT id, sched_kind, sched_days FROM tasks WHERE is_active = 1'
	);

	const insert = (taskId: number) =>
		run(
			"INSERT INTO task_instances (task_id, due_date, week_start, status) VALUES (?, ?, ?, 'pending')",
			taskId, today, weekStart
		);

	for (const t of tasks) {
		if (t.sched_kind === 'manual') continue;

		if (t.sched_kind === 'weekdays') {
			if (!parseDays(t.sched_days).includes(weekday)) continue;
			if (!get('SELECT id FROM task_instances WHERE task_id = ? AND due_date = ?', t.id, today)) insert(t.id);
		} else if (t.sched_kind === 'weekly') {
			if (!get('SELECT id FROM task_instances WHERE task_id = ? AND week_start = ?', t.id, weekStart)) insert(t.id);
		} else if (t.sched_kind === 'biweekly') {
			if (!get("SELECT id FROM task_instances WHERE task_id = ? AND due_date >= date('now','-13 days')", t.id)) insert(t.id);
		} else if (t.sched_kind === 'monthly') {
			if (!get('SELECT id FROM task_instances WHERE task_id = ? AND substr(due_date,1,7) = ?', t.id, month)) insert(t.id);
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
	task_sched_kind: ScheduleKind;
	task_sched_days: string;
	claimer_id: number | null;
	claimer_name: string | null;
	claimer_avatar: string | null;
}

const INSTANCE_SELECT = `
	SELECT ti.id, ti.status, ti.points_awarded, ti.validated_at,
	       t.id AS task_id, t.name AS task_name, t.emoji AS task_emoji,
	       t.points AS task_points, t.difficulty AS task_difficulty, t.duration_min AS task_duration_min,
	       t.sched_kind AS task_sched_kind, t.sched_days AS task_sched_days,
	       u.id AS claimer_id, u.name AS claimer_name, u.avatar AS claimer_avatar
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
			durationMin: r.task_duration_min,
			scheduleKind: r.task_sched_kind,
			scheduleDays: parseDays(r.task_sched_days)
		},
		claimedByUser: r.claimer_id
			? { id: r.claimer_id, name: r.claimer_name ?? '', avatar: r.claimer_avatar ?? '🧑' }
			: null
	};
}

// ── Lectures ──────────────────────────────────────────────────────────────────
export function getAvailableInstances(): InstanceDTO[] {
	generateDueInstances();
	return all<InstanceRow>(
		`${INSTANCE_SELECT} WHERE ti.status = 'pending' AND ti.due_date <= ? ORDER BY t.points DESC, t.name ASC`,
		todayStr()
	).map(mapInstance);
}

export interface TaskGroup { key: string; label: string; items: InstanceDTO[]; }

const GROUP_ORDER = ['daily', 'weekdays', 'weekly', 'biweekly', 'monthly', 'manual'] as const;
const GROUP_LABELS: Record<string, string> = {
	daily: 'Quotidien',
	weekdays: 'Jours fixes',
	weekly: 'Hebdomadaire',
	biweekly: 'Toutes les 2 semaines',
	monthly: 'Mensuel',
	manual: 'Ponctuel'
};
function groupKey(inst: InstanceDTO): string {
	const k = inst.task.scheduleKind;
	if (k === 'weekdays') return inst.task.scheduleDays.length >= 7 ? 'daily' : 'weekdays';
	return k;
}

export function getAvailableGroups(): TaskGroup[] {
	const items = getAvailableInstances();
	const map = new Map<string, InstanceDTO[]>();
	for (const it of items) {
		const g = groupKey(it);
		if (!map.has(g)) map.set(g, []);
		map.get(g)!.push(it);
	}
	return GROUP_ORDER.filter((k) => map.has(k)).map((k) => ({ key: k, label: GROUP_LABELS[k], items: map.get(k)! }));
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
	const done = rows.filter((r) => r.status === 'done').length;
	return Math.round((done / rows.length) * 100);
}

// ── Compléter / annuler ───────────────────────────────────────────────────────
export function completeTask(instanceId: number, personId: number): void {
	const inst = get<{ id: number; status: string; task_id: number }>(
		'SELECT id, status, task_id FROM task_instances WHERE id = ?', instanceId
	);
	if (!inst) throw new Error('Tâche introuvable');
	if (inst.status === 'done') throw new Error('Tâche déjà faite');

	if (!get('SELECT id FROM users WHERE id = ?', personId)) throw new Error('Personne inconnue');

	const task = get<{ points: number }>('SELECT points FROM tasks WHERE id = ?', inst.task_id);
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

export function uncompleteTask(instanceId: number): void {
	const inst = get<{ id: number; status: string; claimed_by: number | null; points_awarded: number | null; week_start: string }>(
		'SELECT id, status, claimed_by, points_awarded, week_start FROM task_instances WHERE id = ?', instanceId
	);
	if (!inst) throw new Error('Tâche introuvable');
	if (inst.status !== 'done') throw new Error("Cette tâche n'est pas marquée comme faite");

	if (inst.claimed_by) removePoints(inst.claimed_by, inst.points_awarded ?? 0, inst.week_start);

	run(
		`UPDATE task_instances
		 SET status = 'pending', claimed_by = NULL, claimed_at = NULL,
		     validated_by = NULL, validated_at = NULL, points_awarded = NULL
		 WHERE id = ?`,
		instanceId
	);
	// NB : les badges déjà débloqués ne sont pas révoqués.
}

// ── Ajout manuel d'une occurrence (à faire maintenant) ───────────────────────
export function addInstance(taskId: number): void {
	if (!get('SELECT id FROM tasks WHERE id = ? AND is_active = 1', taskId)) throw new Error('Tâche inconnue');
	run(
		"INSERT INTO task_instances (task_id, due_date, week_start, status) VALUES (?, ?, ?, 'pending')",
		taskId, todayStr(), getWeekStart()
	);
}

// ── Points ──────────────────────────────────────────────────────────────────
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
	run('UPDATE users SET total_points = ?, weekly_points = ?, week_start = ?, level = ? WHERE id = ?',
		newTotal, newWeekly, weekStart, newLevel, userId);
}

function removePoints(userId: number, pts: number, instWeekStart: string): void {
	const user = get<{ total_points: number; weekly_points: number; week_start: string }>(
		'SELECT total_points, weekly_points, week_start FROM users WHERE id = ?', userId
	);
	if (!user) return;
	const weekStart = getWeekStart();
	const newTotal = Math.max(0, user.total_points - pts);
	// On ne retire du score hebdo que si l'occurrence appartient à la semaine en cours.
	const newWeekly = (instWeekStart === weekStart && user.week_start === weekStart)
		? Math.max(0, user.weekly_points - pts)
		: user.weekly_points;
	const newLevel = Math.floor(Math.sqrt(newTotal / 50)) + 1;
	run('UPDATE users SET total_points = ?, weekly_points = ?, level = ? WHERE id = ?',
		newTotal, newWeekly, newLevel, userId);
}

// ── Badges (seuils atteints) ─────────────────────────────────────────────────
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
		if (!get('SELECT id FROM user_badges WHERE user_id = ? AND badge_id = ?', userId, b.id))
			run('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', userId, b.id);
	}
}

// ── Catalogue / CRUD ──────────────────────────────────────────────────────────
export interface CatalogueTask {
	id: number; name: string; emoji: string; points: number;
	difficulty: number; durationMin: number;
	kind: ScheduleKind; days: number[]; active: boolean;
}

export function listCatalogue(activeOnly = false): CatalogueTask[] {
	const rows = all<{
		id: number; name: string; emoji: string; points: number;
		difficulty: number; duration_min: number; sched_kind: ScheduleKind; sched_days: string; is_active: number;
	}>(
		`SELECT id, name, emoji, points, difficulty, duration_min, sched_kind, sched_days, is_active
		 FROM tasks ${activeOnly ? 'WHERE is_active = 1' : ''} ORDER BY name COLLATE NOCASE`
	);
	return rows.map((r) => ({
		id: r.id, name: r.name, emoji: r.emoji, points: r.points,
		difficulty: r.difficulty, durationMin: r.duration_min,
		kind: r.sched_kind, days: parseDays(r.sched_days), active: !!r.is_active
	}));
}

const VALID_KINDS: ScheduleKind[] = ['weekdays', 'weekly', 'biweekly', 'monthly', 'manual'];
function normalizeKind(k: string): ScheduleKind {
	return (VALID_KINDS as string[]).includes(k) ? (k as ScheduleKind) : 'weekly';
}

export function createTask(input: { name: string; emoji: string; points: number; kind: string; days: number[] }): void {
	const name = input.name.trim();
	if (!name) throw new Error('Le nom est obligatoire');
	const kind = normalizeKind(input.kind);
	run(
		"INSERT INTO tasks (name, emoji, points, sched_kind, sched_days, recurrence) VALUES (?, ?, ?, ?, ?, 'manual')",
		name, input.emoji?.trim() || '✅', Math.max(0, Math.round(input.points || 0)), kind, daysToCsv(input.days)
	);
}

export function updateTask(input: { id: number; name: string; emoji: string; points: number; kind: string; days: number[]; active: boolean }): void {
	const name = input.name.trim();
	if (!name) throw new Error('Le nom est obligatoire');
	const kind = normalizeKind(input.kind);
	run(
		'UPDATE tasks SET name = ?, emoji = ?, points = ?, sched_kind = ?, sched_days = ?, is_active = ? WHERE id = ?',
		name, input.emoji?.trim() || '✅', Math.max(0, Math.round(input.points || 0)), kind, daysToCsv(input.days),
		input.active ? 1 : 0, input.id
	);
}

export function deleteTask(taskId: number): void {
	run('DELETE FROM task_instances WHERE task_id = ?', taskId);
	run('DELETE FROM tasks WHERE id = ?', taskId);
}
