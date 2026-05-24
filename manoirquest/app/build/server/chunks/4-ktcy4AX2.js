import { r as resetWeeklyIfNeeded, b as getLeaderboard } from './players-uz-MVUuf.js';
import './auth-BBzAbgAR.js';
import 'node:sqlite';
import 'fs';
import 'path';

//#region src/routes/leaderboard/+page.server.ts
var load = async () => {
	resetWeeklyIfNeeded();
	return getLeaderboard();
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Crp3VX9U.js')).default;
const server_id = "src/routes/leaderboard/+page.server.ts";
const imports = ["_app/immutable/nodes/4.CdJOC0xc.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/1sAtSMT6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-ktcy4AX2.js.map
