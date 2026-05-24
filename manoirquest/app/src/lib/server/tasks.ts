import { all, get, run } from '$lib/db';
import type { InstanceDTO, ScheduleKind } from '$lib/db/schema';
import { getWeekStart } from './auth';

// ── Utilitaires dates (YYYY-MM-DD, heure locale) ──────────────────────────────
// On reste en heure locale (pas d'UTC) pour éviter les décalages de jour le soir.
function pad(n: number): string {
	return String(n).padStart(2, '0');
}
function ymd(d: Date): string {
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function todayStr(): string {
	return ymd(new Date());
}
function parseYmd(s: string): Date {
	const [y, m, d] = s.split('-').map(Number);
	return new Date(y, m - 1, d); // minuit local
}
// 1 = lundi … 7 = dimanche
function isoWeekday(d = new Date()): number {
	const x = d.getDay();
	return x === 0 ? 7 : x;
}
function isoWeekdayOf(s: string): number {
	return isoWeekday(parseYmd(s));
}
function addDaysStr(s: string, n: number): string {
	const d = parseYmd(s);
	d.setDate(d.getDate() + n);
	return ymd(d);
}
function addMonthsStr(s: string, n: number): string {
	const d = parseYmd(s);
	d.setMonth(d.getMonth() + n);
	return ymd(d);
}
function maxStr(a: string, b: string): string {
	return a >= b ? a : b;
}
function endOfWeekStr(): string {
	return addDaysStr(getWeekStart(), 6); // dimanche de la semaine en cours
}
function endOfMonthStr(): string {
	const d = new Date();
	return ymd(new Date(d.getFullYear(), d.getMonth() + 1, 0)); // dernier jour du mois
}

export function parseDays(csv: string | null | undefined): number[] {
	return (csv ?? '').split(',').map((s) => Number(s.trim())).filter((n) => n >= 1 && n <= 7);
}
export function daysToCsv(days: number[]): string {
	return [...new Set(days)].filter((n) => n >= 1 && n <= 7).sort((a, b) => a - b).join(',');
}

// ── Calcul de la prochaine échéance datée ─────────────────────────────────────
interface SchedRow {
	id: number;
	sched_kind: ScheduleKind;
	sched_days: string;
	anchor_day: number | null;
}

// Première date >= startStr dont le jour ISO appartient à `days`.
function nextWeekdaysOccurrence(days: number[], startStr: string): string | null {
	if (!days.length) return null;
	let d = startStr;
	for (let i = 0; i < 7; i++) {
		if (days.includes(isoWeekdayOf(d))) return d;
		d = addDaysStr(d, 1);
	}
	return null;
}
// Première date >= startStr tombant sur le jour ISO `weekday`.
function nextWeekdayOnOrAfter(startStr: string, weekday: number): string {
	let d = startStr;
	for (let i = 0; i < 7; i++) {
		if (isoWeekdayOf(d) === weekday) return d;
		d = addDaysStr(d, 1);
	}
	return startStr;
}

// Échéance de la PROCHAINE occurrence d'une tâche.
//  - lastDue = null  → bootstrap (jour habituel sinon aujourd'hui)
//  - lastDue présent → roll-forward depuis la dernière échéance (conserve le jour),
//                       toujours ramené dans le futur (>= aujourd'hui).
function computeNextDue(t: SchedRow, lastDue: string | null): string | null {
	const today = todayStr();

	if (t.sched_kind === 'manual') return null; // jamais auto-généré

	if (t.sched_kind === 'weekdays') {
		const days = parseDays(t.sched_days);
		if (!days.length) return null;
		const start = lastDue ? maxStr(addDaysStr(lastDue, 1), today) : today;
		return nextWeekdaysOccurrence(days, start);
	}

	// weekly / biweekly / monthly
	if (lastDue == null) {
		return t.anchor_day ? nextWeekdayOnOrAfter(today, t.anchor_day) : today;
	}

	const step = (s: string) =>
		t.sched_kind === 'monthly' ? addMonthsStr(s, 1)
			: addDaysStr(s, t.sched_kind === 'biweekly' ? 14 : 7);

	let d = step(lastDue);
	let guard = 0;
	while (d < today && guard++ < 600) d = step(d); // ne pas planifier dans le passé
	return d;
}

// ── Génération / régénération des occurrences ─────────────────────────────────
// Invariant : au plus UNE occurrence ouverte (pending/claimed/awaiting_validation)
// par tâche active non-manuelle. Le bootstrap et le filet de sécurité passent ici ;
// la régénération immédiate à la complétion passe par scheduleNext().
function hasOpenInstance(taskId: number): boolean {
	return !!get(
		"SELECT id FROM task_instances WHERE task_id = ? AND status IN ('pending','claimed','awaiting_validation')",
		taskId
	);
}
function insertInstance(taskId: number, due: string): void {
	run(
		"INSERT INTO task_instances (task_id, due_date, week_start, status) VALUES (?, ?, ?, 'pending')",
		taskId, due, getWeekStart(parseYmd(due))
	);
}

export function generateDueInstances(): void {
	const tasks = all<SchedRow>(
		'SELECT id, sched_kind, sched_days, anchor_day FROM tasks WHERE is_active = 1'
	);
	for (const t of tasks) {
		if (t.sched_kind === 'manual') continue;
		if (hasOpenInstance(t.id)) continue;
		const last = get<{ due_date: string }>(
			'SELECT due_date FROM task_instances WHERE task_id = ? ORDER BY due_date DESC, id DESC LIMIT 1',
			t.id
		);
		const next = computeNextDue(t, last ? last.due_date : null);
		if (next) insertInstance(t.id, next);
	}
}

// Planifie l'occurrence suivante juste après une complétion (feedback immédiat).
function scheduleNext(taskId: number, fromDue: string): void {
	const t = get<SchedRow>(
		'SELECT id, sched_kind, sched_days, anchor_day FROM tasks WHERE id = ? AND is_active = 1',
		taskId
	);
	if (!t || t.sched_kind === 'manual') return;
	if (hasOpenInstance(taskId)) return;
	const next = computeNextDue(t, fromDue);
	if (next) insertInstance(taskId, next);
}

// ── Mapping ligne SQL plate → DTO ────────────────────────────────────────────
interface InstanceRow {
	id: number;
	status: string;
	points_awarded: number | null;
	validated_at: string | null;
	due_date: string;
	task_id: number;
	task_name: string;
	task_emoji: string;
	task_points: number;
	task_difficulty: number;
	task_duration_min: number;
	task_sched_kind: ScheduleKind;
	task_sched_days: string;
	task_anchor_day: number | null;
	claimer_id: number | null;
	claimer_name: string | null;
	claimer_avatar: string | null;
}

const INSTANCE_SELECT = `
	SELECT ti.id, ti.status, ti.points_awarded, ti.validated_at, ti.due_date,
	       t.id AS task_id, t.name AS task_name, t.emoji AS task_emoji,
	       t.points AS task_points, t.difficulty AS task_difficulty, t.duration_min AS task_duration_min,
	       t.sched_kind AS task_sched_kind, t.sched_days AS task_sched_days, t.anchor_day AS task_anchor_day,
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
		dueDate: r.due_date,
		task: {
			id: r.task_id,
			name: r.task_name,
			emoji: r.task_emoji,
			points: r.task_points,
			difficulty: r.task_difficulty,
			durationMin: r.task_duration_min,
			scheduleKind: r.task_sched_kind,
			scheduleDays: parseDays(r.task_sched_days),
			anchorDay: r.task_anchor_day
		},
		claimedByUser: r.claimer_id
			? { id: r.claimer_id, name: r.claimer_name ?? '', avatar: r.claimer_avatar ?? '🧑' }
			: null
	};
}

// ── Lectures ──────────────────────────────────────────────────────────────────
// Toutes les occurrences à faire (quelle que soit l'échéance) — le regroupement
// par bucket se charge de répartir aujourd'hui / cette semaine / ce mois / autres.
export function getAvailableInstances(): InstanceDTO[] {
	generateDueInstances();
	return all<InstanceRow>(
		`${INSTANCE_SELECT} WHERE ti.status = 'pending' ORDER BY ti.due_date ASC, t.points DESC, t.name ASC`
	).map(mapInstance);
}

// ── Regroupement par échéance ─────────────────────────────────────────────────
export type DueKey = 'today' | 'week' | 'month' | 'other';
export interface DueGroup { key: DueKey; label: string; items: InstanceDTO[]; }

const DUE_LABELS: Record<DueKey, string> = {
	today: "À faire aujourd'hui",
	week: 'À faire cette semaine',
	month: 'À faire ce mois-ci',
	other: 'Autres tâches'
};
const DUE_ORDER: DueKey[] = ['today', 'week', 'month', 'other'];

function bucketFor(dueDate: string, today: string, eow: string, eom: string): DueKey {
	if (!dueDate || dueDate <= today) return 'today'; // aujourd'hui + en retard
	if (dueDate <= eow) return 'week';
	if (dueDate <= eom) return 'month';
	return 'other';
}

export function getDueGroups(): DueGroup[] {
	const items = getAvailableInstances();
	const today = todayStr();
	const eow = endOfWeekStr();
	const eom = endOfMonthStr();
	const map: Record<DueKey, InstanceDTO[]> = { today: [], week: [], month: [], other: [] };
	for (const it of items) map[bucketFor(it.dueDate, today, eow, eom)].push(it);
	return DUE_ORDER.filter((k) => map[k].length).map((k) => ({ key: k, label: DUE_LABELS[k], items: map[k] }));
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
	const inst = get<{ id: number; status: string; task_id: number; due_date: string }>(
		'SELECT id, status, task_id, due_date FROM task_instances WHERE id = ?', instanceId
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

	// Régénère immédiatement la prochaine occurrence selon la fréquence (même jour).
	scheduleNext(inst.task_id, inst.due_date);
}

export function uncompleteTask(instanceId: number): void {
	const inst = get<{ id: number; status: string; task_id: number; due_date: string; claimed_by: number | null; points_awarded: number | null; week_start: string }>(
		'SELECT id, status, task_id, due_date, claimed_by, points_awarded, week_start FROM task_instances WHERE id = ?', instanceId
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

	// Supprime l'occurrence suivante auto-régénérée (pending, non réclamée) pour ne
	// pas se retrouver avec deux occurrences ouvertes. Tâches manuelles non concernées.
	const kind = get<{ sched_kind: ScheduleKind }>('SELECT sched_kind FROM tasks WHERE id = ?', inst.task_id)?.sched_kind;
	if (kind && kind !== 'manual') {
		run(
			"DELETE FROM task_instances WHERE task_id = ? AND id <> ? AND status = 'pending' AND claimed_by IS NULL AND due_date >= ?",
			inst.task_id, instanceId, inst.due_date
		);
	}
	// NB : les badges déjà débloqués ne sont pas révoqués.
}

// ── Date d'une occurrence (attribution au cas par cas) ────────────────────────
export function setInstanceDate(instanceId: number, date: string): void {
	const inst = get<{ id: number; status: string }>(
		'SELECT id, status FROM task_instances WHERE id = ?', instanceId
	);
	if (!inst) throw new Error('Tâche introuvable');
	if (inst.status === 'done') throw new Error('Tâche déjà faite');
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Date invalide');
	run('UPDATE task_instances SET due_date = ?, week_start = ? WHERE id = ?', date, getWeekStart(parseYmd(date)), instanceId);
}

// ── Ajout manuel d'une occurrence (à faire) ───────────────────────────────────
export function addInstance(taskId: number): void {
	if (!get('SELECT id FROM tasks WHERE id = ? AND is_active = 1', taskId)) throw new Error('Tâche inconnue');
	insertInstance(taskId, todayStr());
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
	kind: ScheduleKind; days: number[]; anchorDay: number | null; active: boolean;
}

export function listCatalogue(activeOnly = false): CatalogueTask[] {
	const rows = all<{
		id: number; name: string; emoji: string; points: number;
		difficulty: number; duration_min: number; sched_kind: ScheduleKind; sched_days: string; anchor_day: number | null; is_active: number;
	}>(
		`SELECT id, name, emoji, points, difficulty, duration_min, sched_kind, sched_days, anchor_day, is_active
		 FROM tasks ${activeOnly ? 'WHERE is_active = 1' : ''} ORDER BY name COLLATE NOCASE`
	);
	return rows.map((r) => ({
		id: r.id, name: r.name, emoji: r.emoji, points: r.points,
		difficulty: r.difficulty, durationMin: r.duration_min,
		kind: r.sched_kind, days: parseDays(r.sched_days), anchorDay: r.anchor_day, active: !!r.is_active
	}));
}

const VALID_KINDS: ScheduleKind[] = ['weekdays', 'weekly', 'biweekly', 'monthly', 'manual'];
function normalizeKind(k: string): ScheduleKind {
	return (VALID_KINDS as string[]).includes(k) ? (k as ScheduleKind) : 'weekly';
}
function normalizeDifficulty(d: unknown): number {
	const n = Math.round(Number(d));
	return n >= 1 && n <= 3 ? n : 1;
}
// Le jour habituel n'a de sens que pour weekly / biweekly / monthly.
function normalizeAnchor(a: unknown, kind: ScheduleKind): number | null {
	if (kind === 'weekly' || kind === 'biweekly' || kind === 'monthly') {
		const n = Math.round(Number(a));
		return n >= 1 && n <= 7 ? n : null;
	}
	return null;
}

export interface TaskInput {
	id?: number;
	name: string; emoji: string; points: number; difficulty: number;
	kind: string; days: number[]; anchorDay: number | null; active?: boolean;
}

export function createTask(input: TaskInput): void {
	const name = input.name.trim();
	if (!name) throw new Error('Le nom est obligatoire');
	const kind = normalizeKind(input.kind);
	run(
		"INSERT INTO tasks (name, emoji, points, difficulty, sched_kind, sched_days, anchor_day, recurrence) VALUES (?, ?, ?, ?, ?, ?, ?, 'manual')",
		name, input.emoji?.trim() || '✅', Math.max(0, Math.round(input.points || 0)),
		normalizeDifficulty(input.difficulty), kind, daysToCsv(input.days), normalizeAnchor(input.anchorDay, kind)
	);
}

export function updateTask(input: TaskInput & { id: number; active: boolean }): void {
	const name = input.name.trim();
	if (!name) throw new Error('Le nom est obligatoire');
	const kind = normalizeKind(input.kind);
	run(
		'UPDATE tasks SET name = ?, emoji = ?, points = ?, difficulty = ?, sched_kind = ?, sched_days = ?, anchor_day = ?, is_active = ? WHERE id = ?',
		name, input.emoji?.trim() || '✅', Math.max(0, Math.round(input.points || 0)),
		normalizeDifficulty(input.difficulty), kind, daysToCsv(input.days), normalizeAnchor(input.anchorDay, kind),
		input.active ? 1 : 0, input.id
	);
}

export function deleteTask(taskId: number): void {
	run('DELETE FROM task_instances WHERE task_id = ?', taskId);
	run('DELETE FROM tasks WHERE id = ?', taskId);
}
