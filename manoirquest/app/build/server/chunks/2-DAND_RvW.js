import { a as all, r as run } from './db-DoQKVq8x.js';
import { a as getWeekStart } from './auth-B82FvBEF.js';
import { g as generateWeeklyInstances, a as getPendingValidations } from './tasks-CPnLy6J4.js';
import 'node:sqlite';
import 'fs';
import 'path';
import 'crypto';

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

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DSJYKCsg.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/2.BcdV4iuc.js","_app/immutable/chunks/DUZ7yc7H.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/CKzn0cD3.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-DAND_RvW.js.map
