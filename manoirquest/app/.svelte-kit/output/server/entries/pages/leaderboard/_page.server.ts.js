import { a as getLeaderboard, f as resetWeeklyIfNeeded } from "../../../chunks/players.js";
//#region src/routes/leaderboard/+page.server.ts
var load = async () => {
	resetWeeklyIfNeeded();
	return getLeaderboard();
};
//#endregion
export { load };
