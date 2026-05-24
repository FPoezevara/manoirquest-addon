import { a as all, g as get, r as run } from './db-DoQKVq8x.js';
import { a as getWeekStart } from './auth-B82FvBEF.js';

//#region src/lib/server/tasks.ts
function generateWeeklyInstances() {
	const weekStart = getWeekStart();
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const recurring = all("SELECT * FROM tasks WHERE is_active = 1 AND recurrence IN ('daily','weekly','biweekly')");
	for (const task of recurring) if (!get("SELECT id FROM task_instances WHERE task_id = ? AND week_start = ?", task.id, weekStart)) run("INSERT INTO task_instances (task_id, due_date, week_start, status) VALUES (?, ?, ?, ?)", task.id, today, weekStart, "pending");
}
function getTasksForUser(userId) {
	const weekStart = getWeekStart();
	generateWeeklyInstances();
	return all(`
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
function getPendingValidations() {
	return all(`
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
function claimTask(instanceId, userId) {
	const inst = get("SELECT * FROM task_instances WHERE id = ?", instanceId);
	if (!inst || inst.status !== "pending") throw new Error("Tâche non disponible");
	run("UPDATE task_instances SET claimed_by = ?, claimed_at = datetime('now'), status = 'claimed' WHERE id = ?", userId, instanceId);
}
function declareTask(instanceId, userId, userRole) {
	const inst = get("SELECT * FROM task_instances WHERE id = ?", instanceId);
	if (!inst) throw new Error("Instance introuvable");
	if (inst.claimed_by !== userId && inst.assigned_to !== userId) throw new Error("Ce n'est pas ta tâche");
	if (userRole === "parent") {
		const pts = get("SELECT * FROM tasks WHERE id = ?", inst.task_id)?.points ?? 0;
		run("UPDATE task_instances SET status = 'done', validated_by = ?, validated_at = datetime('now'), points_awarded = ? WHERE id = ?", userId, pts, instanceId);
		awardPoints(userId, pts);
	} else run("UPDATE task_instances SET status = 'awaiting_validation' WHERE id = ?", instanceId);
}
function validateTask(instanceId, validatorId, approved, reason) {
	const inst = get("SELECT ti.*, t.points AS task_points FROM task_instances ti JOIN tasks t ON t.id = ti.task_id WHERE ti.id = ? AND ti.status = 'awaiting_validation'", instanceId);
	if (!inst) throw new Error("Instance introuvable ou déjà traitée");
	if (approved) {
		const pts = inst.task_points ?? 0;
		run("UPDATE task_instances SET status = 'done', validated_by = ?, validated_at = datetime('now'), points_awarded = ? WHERE id = ?", validatorId, pts, instanceId);
		if (inst.claimed_by) awardPoints(inst.claimed_by, pts);
	} else run("UPDATE task_instances SET status = 'refused', refusal_reason = ? WHERE id = ?", reason ?? "Refusé", instanceId);
}
function awardPoints(userId, pts) {
	const user = get("SELECT * FROM users WHERE id = ?", userId);
	if (!user) return;
	const weekStart = getWeekStart();
	const newWeekly = user.week_start === weekStart ? user.weekly_points + pts : pts;
	const newTotal = user.total_points + pts;
	run("UPDATE users SET total_points = ?, weekly_points = ?, week_start = ?, level = ? WHERE id = ?", newTotal, newWeekly, weekStart, Math.floor(Math.sqrt(newTotal / 50)) + 1, userId);
}

export { getPendingValidations as a, getTasksForUser as b, claimTask as c, declareTask as d, generateWeeklyInstances as g, validateTask as v };
//# sourceMappingURL=tasks-CPnLy6J4.js.map
