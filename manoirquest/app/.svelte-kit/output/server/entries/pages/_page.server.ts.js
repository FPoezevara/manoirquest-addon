import { r as run, t as all } from "../../chunks/db.js";
import { i as getWeekStart } from "../../chunks/auth.js";
import { i as getPendingValidations, r as generateWeeklyInstances } from "../../chunks/tasks.js";
//#region src/routes/+page.server.ts
var load = async ({ locals }) => {
	generateWeeklyInstances();
	const weekStart = getWeekStart();
	const allUsers = all("SELECT * FROM users");
	for (const u of allUsers) if (u.week_start !== weekStart) {
		run("UPDATE users SET weekly_points = 0, week_start = ? WHERE id = ?", weekStart, u.id);
		u.weekly_points = 0;
		u.week_start = weekStart;
	}
	const leaderboard = [...allUsers].sort((a, b) => b.weekly_points - a.weekly_points);
	const urgent = all(`
		SELECT ti.*, t.name AS task_name, t.emoji AS task_emoji, t.points AS task_points
		FROM task_instances ti
		JOIN tasks t ON t.id = ti.task_id
		WHERE ti.week_start = ? AND ti.status IN ('pending','claimed')
		ORDER BY ti.due_date ASC LIMIT 5
	`, weekStart);
	const pendingValidation = locals.user?.role === "parent" ? getPendingValidations() : [];
	const allThisWeek = all("SELECT status FROM task_instances WHERE week_start = ?", weekStart);
	const doneCount = allThisWeek.filter((t) => t.status === "done").length;
	return {
		leaderboard,
		urgent,
		pendingValidation,
		houseScore: allThisWeek.length ? Math.round(doneCount / allThisWeek.length * 100) : 0,
		recentDone: all(`
		SELECT ti.*, t.name AS task_name, t.emoji AS task_emoji,
		       u.name AS claimer_name, u.avatar AS claimer_avatar
		FROM task_instances ti
		JOIN tasks t ON t.id = ti.task_id
		LEFT JOIN users u ON u.id = ti.claimed_by
		WHERE ti.status = 'done'
		ORDER BY ti.validated_at DESC LIMIT 6
	`)
	};
};
//#endregion
export { load };
