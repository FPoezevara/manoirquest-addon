import { i as listPlayers } from './players-uz-MVUuf.js';
import './auth-BBzAbgAR.js';
import 'node:sqlite';
import 'fs';
import 'path';

//#region src/routes/+layout.server.ts
var load = async ({ locals }) => {
	return {
		base: locals.base,
		players: listPlayers()
	};
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-DVnk3Cl1.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.BiRSscS9.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/6m1V4_Nh.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/1sAtSMT6.js"];
const stylesheets = ["_app/immutable/assets/0.QiZapTEB.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-BB4Bk8SV.js.map
