import { i as run, n as all, r as get, t as getWeekStart } from "./auth.js";
//#region src/lib/server/tasks.ts
function pad(n) {
	return String(n).padStart(2, "0");
}
function ymd(d) {
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function todayStr() {
	return ymd(/* @__PURE__ */ new Date());
}
function parseYmd(s) {
	const [y, m, d] = s.split("-").map(Number);
	return new Date(y, m - 1, d);
}
function isoWeekday(d = /* @__PURE__ */ new Date()) {
	const x = d.getDay();
	return x === 0 ? 7 : x;
}
function isoWeekdayOf(s) {
	return isoWeekday(parseYmd(s));
}
function addDaysStr(s, n) {
	const d = parseYmd(s);
	d.setDate(d.getDate() + n);
	return ymd(d);
}
function addMonthsStr(s, n) {
	const d = parseYmd(s);
	d.setMonth(d.getMonth() + n);
	return ymd(d);
}
function maxStr(a, b) {
	return a >= b ? a : b;
}
function endOfWeekStr() {
	return addDaysStr(getWeekStart(), 6);
}
function endOfMonthStr() {
	const d = /* @__PURE__ */ new Date();
	return ymd(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}
function parseDays(csv) {
	return (csv ?? "").split(",").map((s) => Number(s.trim())).filter((n) => n >= 1 && n <= 7);
}
function daysToCsv(days) {
	return [...new Set(days)].filter((n) => n >= 1 && n <= 7).sort((a, b) => a - b).join(",");
}
function nextWeekdaysOccurrence(days, startStr) {
	if (!days.length) return null;
	let d = startStr;
	for (let i = 0; i < 7; i++) {
		if (days.includes(isoWeekdayOf(d))) return d;
		d = addDaysStr(d, 1);
	}
	return null;
}
function nextWeekdayOnOrAfter(startStr, weekday) {
	let d = startStr;
	for (let i = 0; i < 7; i++) {
		if (isoWeekdayOf(d) === weekday) return d;
		d = addDaysStr(d, 1);
	}
	return startStr;
}
function computeNextDue(t, lastDue) {
	const today = todayStr();
	if (t.sched_kind === "manual") return null;
	if (t.sched_kind === "weekdays") {
		const days = parseDays(t.sched_days);
		if (!days.length) return null;
		return nextWeekdaysOccurrence(days, lastDue ? maxStr(addDaysStr(lastDue, 1), today) : today);
	}
	if (lastDue == null) return t.anchor_day ? nextWeekdayOnOrAfter(today, t.anchor_day) : today;
	const step = (s) => t.sched_kind === "monthly" ? addMonthsStr(s, 1) : addDaysStr(s, t.sched_kind === "biweekly" ? 14 : 7);
	let d = step(lastDue);
	let guard = 0;
	while (d < today && guard++ < 600) d = step(d);
	return d;
}
function hasOpenInstance(taskId) {
	return !!get("SELECT id FROM task_instances WHERE task_id = ? AND status IN ('pending','claimed','awaiting_validation')", taskId);
}
function insertInstance(taskId, due) {
	run("INSERT INTO task_instances (task_id, due_date, week_start, status) VALUES (?, ?, ?, 'pending')", taskId, due, getWeekStart(parseYmd(due)));
}
function generateDueInstances() {
	const tasks = all("SELECT id, sched_kind, sched_days, anchor_day FROM tasks WHERE is_active = 1");
	for (const t of tasks) {
		if (t.sched_kind === "manual") continue;
		if (hasOpenInstance(t.id)) continue;
		const last = get("SELECT due_date FROM task_instances WHERE task_id = ? ORDER BY due_date DESC, id DESC LIMIT 1", t.id);
		const next = computeNextDue(t, last ? last.due_date : null);
		if (next) insertInstance(t.id, next);
	}
}
function scheduleNext(taskId, fromDue) {
	const t = get("SELECT id, sched_kind, sched_days, anchor_day FROM tasks WHERE id = ? AND is_active = 1", taskId);
	if (!t || t.sched_kind === "manual") return;
	if (hasOpenInstance(taskId)) return;
	const next = computeNextDue(t, fromDue);
	if (next) insertInstance(taskId, next);
}
var INSTANCE_SELECT = `
	SELECT ti.id, ti.status, ti.points_awarded, ti.validated_at, ti.due_date,
	       t.id AS task_id, t.name AS task_name, t.emoji AS task_emoji,
	       t.points AS task_points, t.difficulty AS task_difficulty, t.duration_min AS task_duration_min,
	       t.sched_kind AS task_sched_kind, t.sched_days AS task_sched_days, t.anchor_day AS task_anchor_day,
	       u.id AS claimer_id, u.name AS claimer_name, u.avatar AS claimer_avatar
	FROM task_instances ti
	JOIN tasks t ON t.id = ti.task_id
	LEFT JOIN users u ON u.id = ti.claimed_by
`;
function mapInstance(r) {
	return {
		id: r.id,
		status: r.status,
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
		claimedByUser: r.claimer_id ? {
			id: r.claimer_id,
			name: r.claimer_name ?? "",
			avatar: r.claimer_avatar ?? "🧑"
		} : null
	};
}
function getAvailableInstances() {
	generateDueInstances();
	return all(`${INSTANCE_SELECT} WHERE ti.status = 'pending' ORDER BY ti.due_date ASC, t.points DESC, t.name ASC`).map(mapInstance);
}
var DUE_LABELS = {
	today: "À faire aujourd'hui",
	week: "À faire cette semaine",
	month: "À faire ce mois-ci",
	other: "Autres tâches"
};
var DUE_ORDER = [
	"today",
	"week",
	"month",
	"other"
];
function bucketFor(dueDate, today, eow, eom) {
	if (!dueDate || dueDate <= today) return "today";
	if (dueDate <= eow) return "week";
	if (dueDate <= eom) return "month";
	return "other";
}
function getDueGroups() {
	const items = getAvailableInstances();
	const today = todayStr();
	const eow = endOfWeekStr();
	const eom = endOfMonthStr();
	const map = {
		today: [],
		week: [],
		month: [],
		other: []
	};
	for (const it of items) map[bucketFor(it.dueDate, today, eow, eom)].push(it);
	return DUE_ORDER.filter((k) => map[k].length).map((k) => ({
		key: k,
		label: DUE_LABELS[k],
		items: map[k]
	}));
}
function getRecentDone(limit = 8) {
	return all(`${INSTANCE_SELECT} WHERE ti.status = 'done' ORDER BY ti.validated_at DESC LIMIT ?`, limit).map(mapInstance);
}
function getHouseScore() {
	const rows = all("SELECT status FROM task_instances WHERE week_start = ?", getWeekStart());
	if (!rows.length) return 0;
	const done = rows.filter((r) => r.status === "done").length;
	return Math.round(done / rows.length * 100);
}
function completeTask(instanceId, personId) {
	const inst = get("SELECT id, status, task_id, due_date FROM task_instances WHERE id = ?", instanceId);
	if (!inst) throw new Error("Tâche introuvable");
	if (inst.status === "done") throw new Error("Tâche déjà faite");
	if (!get("SELECT id FROM users WHERE id = ?", personId)) throw new Error("Personne inconnue");
	const pts = get("SELECT points FROM tasks WHERE id = ?", inst.task_id)?.points ?? 0;
	run(`UPDATE task_instances
		 SET status = 'done', claimed_by = ?, claimed_at = datetime('now'),
		     validated_by = ?, validated_at = datetime('now'), points_awarded = ?
		 WHERE id = ?`, personId, personId, pts, instanceId);
	awardPoints(personId, pts);
	checkAndAwardBadges(personId);
	scheduleNext(inst.task_id, inst.due_date);
}
function uncompleteTask(instanceId) {
	const inst = get("SELECT id, status, task_id, due_date, claimed_by, points_awarded, week_start FROM task_instances WHERE id = ?", instanceId);
	if (!inst) throw new Error("Tâche introuvable");
	if (inst.status !== "done") throw new Error("Cette tâche n'est pas marquée comme faite");
	if (inst.claimed_by) removePoints(inst.claimed_by, inst.points_awarded ?? 0, inst.week_start);
	run(`UPDATE task_instances
		 SET status = 'pending', claimed_by = NULL, claimed_at = NULL,
		     validated_by = NULL, validated_at = NULL, points_awarded = NULL
		 WHERE id = ?`, instanceId);
	const kind = get("SELECT sched_kind FROM tasks WHERE id = ?", inst.task_id)?.sched_kind;
	if (kind && kind !== "manual") run("DELETE FROM task_instances WHERE task_id = ? AND id <> ? AND status = 'pending' AND claimed_by IS NULL AND due_date >= ?", inst.task_id, instanceId, inst.due_date);
}
function setInstanceDate(instanceId, date) {
	const inst = get("SELECT id, status FROM task_instances WHERE id = ?", instanceId);
	if (!inst) throw new Error("Tâche introuvable");
	if (inst.status === "done") throw new Error("Tâche déjà faite");
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Date invalide");
	run("UPDATE task_instances SET due_date = ?, week_start = ? WHERE id = ?", date, getWeekStart(parseYmd(date)), instanceId);
}
function addInstance(taskId) {
	if (!get("SELECT id FROM tasks WHERE id = ? AND is_active = 1", taskId)) throw new Error("Tâche inconnue");
	insertInstance(taskId, todayStr());
}
function awardPoints(userId, pts) {
	const user = get("SELECT total_points, weekly_points, week_start FROM users WHERE id = ?", userId);
	if (!user) return;
	const weekStart = getWeekStart();
	const newWeekly = (user.week_start === weekStart ? user.weekly_points : 0) + pts;
	const newTotal = user.total_points + pts;
	run("UPDATE users SET total_points = ?, weekly_points = ?, week_start = ?, level = ? WHERE id = ?", newTotal, newWeekly, weekStart, Math.floor(Math.sqrt(newTotal / 50)) + 1, userId);
}
function removePoints(userId, pts, instWeekStart) {
	const user = get("SELECT total_points, weekly_points, week_start FROM users WHERE id = ?", userId);
	if (!user) return;
	const weekStart = getWeekStart();
	const newTotal = Math.max(0, user.total_points - pts);
	run("UPDATE users SET total_points = ?, weekly_points = ?, level = ? WHERE id = ?", newTotal, instWeekStart === weekStart && user.week_start === weekStart ? Math.max(0, user.weekly_points - pts) : user.weekly_points, Math.floor(Math.sqrt(newTotal / 50)) + 1, userId);
}
function checkAndAwardBadges(userId) {
	const user = get("SELECT total_points, weekly_points FROM users WHERE id = ?", userId);
	if (!user) return;
	const taskCount = get("SELECT COUNT(*) AS n FROM task_instances WHERE claimed_by = ? AND status = 'done'", userId)?.n ?? 0;
	const badges = all("SELECT id, trigger_type, trigger_value FROM badges WHERE trigger_type IN ('total_points','weekly_points','task_count')");
	for (const b of badges) {
		let earned = false;
		if (b.trigger_type === "total_points") earned = user.total_points >= b.trigger_value;
		else if (b.trigger_type === "weekly_points") earned = user.weekly_points >= b.trigger_value;
		else if (b.trigger_type === "task_count") earned = taskCount >= b.trigger_value;
		if (!earned) continue;
		if (!get("SELECT id FROM user_badges WHERE user_id = ? AND badge_id = ?", userId, b.id)) run("INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)", userId, b.id);
	}
}
function listCatalogue(activeOnly = false) {
	return all(`SELECT id, name, emoji, points, difficulty, duration_min, sched_kind, sched_days, anchor_day, is_active
		 FROM tasks ${activeOnly ? "WHERE is_active = 1" : ""} ORDER BY name COLLATE NOCASE`).map((r) => ({
		id: r.id,
		name: r.name,
		emoji: r.emoji,
		points: r.points,
		difficulty: r.difficulty,
		durationMin: r.duration_min,
		kind: r.sched_kind,
		days: parseDays(r.sched_days),
		anchorDay: r.anchor_day,
		active: !!r.is_active
	}));
}
var VALID_KINDS = [
	"weekdays",
	"weekly",
	"biweekly",
	"monthly",
	"manual"
];
function normalizeKind(k) {
	return VALID_KINDS.includes(k) ? k : "weekly";
}
function normalizeDifficulty(d) {
	const n = Math.round(Number(d));
	return n >= 1 && n <= 3 ? n : 1;
}
function normalizeAnchor(a, kind) {
	if (kind === "weekly" || kind === "biweekly" || kind === "monthly") {
		const n = Math.round(Number(a));
		return n >= 1 && n <= 7 ? n : null;
	}
	return null;
}
function createTask(input) {
	const name = input.name.trim();
	if (!name) throw new Error("Le nom est obligatoire");
	const kind = normalizeKind(input.kind);
	run("INSERT INTO tasks (name, emoji, points, difficulty, sched_kind, sched_days, anchor_day, recurrence) VALUES (?, ?, ?, ?, ?, ?, ?, 'manual')", name, input.emoji?.trim() || "✅", Math.max(0, Math.round(input.points || 0)), normalizeDifficulty(input.difficulty), kind, daysToCsv(input.days), normalizeAnchor(input.anchorDay, kind));
}
function updateTask(input) {
	const name = input.name.trim();
	if (!name) throw new Error("Le nom est obligatoire");
	const kind = normalizeKind(input.kind);
	run("UPDATE tasks SET name = ?, emoji = ?, points = ?, difficulty = ?, sched_kind = ?, sched_days = ?, anchor_day = ?, is_active = ? WHERE id = ?", name, input.emoji?.trim() || "✅", Math.max(0, Math.round(input.points || 0)), normalizeDifficulty(input.difficulty), kind, daysToCsv(input.days), normalizeAnchor(input.anchorDay, kind), input.active ? 1 : 0, input.id);
}
function deleteTask(taskId) {
	run("DELETE FROM task_instances WHERE task_id = ?", taskId);
	run("DELETE FROM tasks WHERE id = ?", taskId);
}
//#endregion
export { getAvailableInstances as a, getRecentDone as c, uncompleteTask as d, updateTask as f, deleteTask as i, listCatalogue as l, completeTask as n, getDueGroups as o, createTask as r, getHouseScore as s, addInstance as t, setInstanceDate as u };
