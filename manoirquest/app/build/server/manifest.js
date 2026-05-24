const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["icons/favicon.png","icons/icon-192.png","icons/icon-512.png","manifest.json","sw.js"]),
	mimeTypes: {".png":"image/png",".json":"application/json",".js":"text/javascript"},
	_: {
		client: {start:"_app/immutable/entry/start.DZ9bnP7u.js",app:"_app/immutable/entry/app.BWgtTTYX.js",imports:["_app/immutable/entry/start.DZ9bnP7u.js","_app/immutable/chunks/BLUzwq2q.js","_app/immutable/chunks/DUZ7yc7H.js","_app/immutable/entry/app.BWgtTTYX.js","_app/immutable/chunks/DUZ7yc7H.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CP0md-Ny.js')),
			__memo(() => import('./chunks/1-uqF8DlNB.js')),
			__memo(() => import('./chunks/2-DAND_RvW.js')),
			__memo(() => import('./chunks/3-BqO4Tu8J.js')),
			__memo(() => import('./chunks/4-Y1rWWYZG.js')),
			__memo(() => import('./chunks/5-DGI2Hu5p.js')),
			__memo(() => import('./chunks/6-v6HSY_VV.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/auth",
				pattern: /^\/api\/auth\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DMj39SOo.js'))
			},
			{
				id: "/leaderboard",
				pattern: /^\/leaderboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/tasks",
				pattern: /^\/tasks\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
