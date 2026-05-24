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
		client: {start:"_app/immutable/entry/start.CuqvuZu5.js",app:"_app/immutable/entry/app.DjTWMUct.js",imports:["_app/immutable/entry/start.CuqvuZu5.js","_app/immutable/chunks/6m1V4_Nh.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/entry/app.DjTWMUct.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-BB4Bk8SV.js')),
			__memo(() => import('./chunks/1-IDUOjhZa.js')),
			__memo(() => import('./chunks/2-BMetpqfA.js')),
			__memo(() => import('./chunks/3-DQSRfd2D.js')),
			__memo(() => import('./chunks/4-ktcy4AX2.js')),
			__memo(() => import('./chunks/5-ZObajJh1.js')),
			__memo(() => import('./chunks/6-CPaXMwWi.js')),
			__memo(() => import('./chunks/7-BN5xhPoa.js')),
			__memo(() => import('./chunks/8-C7KG1Kns.js'))
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
				endpoint: __memo(() => import('./chunks/_server.ts-_FLWoB2g.js'))
			},
			{
				id: "/done",
				pattern: /^\/done\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/leaderboard",
				pattern: /^\/leaderboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/tasks",
				pattern: /^\/tasks\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
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
