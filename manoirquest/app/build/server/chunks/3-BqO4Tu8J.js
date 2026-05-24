import { a as all } from './db-DoQKVq8x.js';
import 'node:sqlite';
import 'fs';
import 'path';

//#region src/routes/leaderboard/+page.server.ts
var load = async () => {
	const allUsers = all("SELECT id, name, avatar, role, weekly_points, total_points, level FROM users");
	return {
		weekly: [...allUsers].sort((a, b) => b.weekly_points - a.weekly_points),
		allTime: [...allUsers].sort((a, b) => b.total_points - a.total_points)
	};
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-TU3WZkvO.js')).default;
const server_id = "src/routes/leaderboard/+page.server.ts";
const imports = ["_app/immutable/nodes/3.-E8xa2UH.js","_app/immutable/chunks/DUZ7yc7H.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/CKzn0cD3.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-BqO4Tu8J.js.map
