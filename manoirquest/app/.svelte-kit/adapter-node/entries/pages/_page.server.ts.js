import { a as getLeaderboard, f as resetWeeklyIfNeeded } from "../../chunks/players.js";
import { a as getAvailableInstances, c as getRecentDone, s as getHouseScore } from "../../chunks/tasks.js";
//#region src/routes/+page.server.ts
var load = async () => {
	resetWeeklyIfNeeded();
	const { weekly } = getLeaderboard();
	const available = getAvailableInstances();
	return {
		leaderboard: weekly,
		upcoming: available.slice(0, 6),
		upcomingCount: available.length,
		recentDone: getRecentDone(6),
		houseScore: getHouseScore()
	};
};
//#endregion
export { load };
