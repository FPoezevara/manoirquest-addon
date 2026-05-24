import { redirect } from '@sveltejs/kit';

//#region src/routes/login/+page.server.ts
var load = async ({ locals }) => {
	throw redirect(307, `${locals.base}/`);
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CqbOKo-R.js')).default;
const server_id = "src/routes/login/+page.server.ts";
const imports = ["_app/immutable/nodes/5.DTAGTswg.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/1sAtSMT6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-ZObajJh1.js.map
