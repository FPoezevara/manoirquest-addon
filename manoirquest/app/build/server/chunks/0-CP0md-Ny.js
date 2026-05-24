//#region src/routes/+layout.server.ts
var load = async ({ locals }) => {
	return {
		user: locals.user,
		base: locals.base
	};
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-DuTWQn5b.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.DDvrmQDz.js","_app/immutable/chunks/DUZ7yc7H.js","_app/immutable/chunks/BLUzwq2q.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/CKzn0cD3.js"];
const stylesheets = ["_app/immutable/assets/0.CciMvYd0.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-CP0md-Ny.js.map
