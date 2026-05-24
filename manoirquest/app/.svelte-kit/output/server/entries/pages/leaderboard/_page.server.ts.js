import { t as all } from "../../../chunks/db.js";
//#region src/routes/leaderboard/+page.server.ts
var load = async () => {
	const allUsers = all("SELECT id, name, avatar, role, weekly_points, total_points, level FROM users");
	return {
		weekly: [...allUsers].sort((a, b) => b.weekly_points - a.weekly_points),
		allTime: [...allUsers].sort((a, b) => b.total_points - a.total_points)
	};
};
//#endregion
export { load };
