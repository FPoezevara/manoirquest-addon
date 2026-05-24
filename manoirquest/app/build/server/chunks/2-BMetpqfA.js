import { r as resetWeeklyIfNeeded, b as getLeaderboard } from './players-uz-MVUuf.js';
import { g as getAvailableInstances, f as getHouseScore, h as getRecentDone } from './tasks-Coyc2aY6.js';
import './auth-BBzAbgAR.js';
import 'node:sqlite';
import 'fs';
import 'path';

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

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CIjBZInK.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/2.BULaXLY4.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/1sAtSMT6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-BMetpqfA.js.map
