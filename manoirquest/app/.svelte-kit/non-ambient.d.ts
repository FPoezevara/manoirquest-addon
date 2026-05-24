
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/auth" | "/api/tasks" | "/api/tasks/claim" | "/api/tasks/declare" | "/api/tasks/validate" | "/done" | "/leaderboard" | "/login" | "/profile" | "/settings" | "/tasks";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/api": Record<string, never>;
			"/api/auth": Record<string, never>;
			"/api/tasks": Record<string, never>;
			"/api/tasks/claim": Record<string, never>;
			"/api/tasks/declare": Record<string, never>;
			"/api/tasks/validate": Record<string, never>;
			"/done": Record<string, never>;
			"/leaderboard": Record<string, never>;
			"/login": Record<string, never>;
			"/profile": Record<string, never>;
			"/settings": Record<string, never>;
			"/tasks": Record<string, never>
		};
		Pathname(): "/" | "/api/auth" | "/done" | "/leaderboard" | "/login" | "/profile" | "/settings" | "/tasks";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/icons/favicon.png" | "/icons/icon-192.png" | "/icons/icon-512.png" | "/manifest.json" | "/sw.js" | string & {};
	}
}