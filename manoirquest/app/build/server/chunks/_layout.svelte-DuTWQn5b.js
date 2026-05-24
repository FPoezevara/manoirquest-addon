import { ae as store_get, u as escape_html, ac as slot, s as ensure_array_like, g as attr, h as attr_class, aj as unsubscribe_stores, j as bind_props, A as getContext } from './dev-C19Uo_57.js';
import './client-DP75kEpc.js';
import './internal-Cexu-MdL.js';
import '@sveltejs/kit/internal';
import '@sveltejs/kit/internal/server';

//#region node_modules/@sveltejs/kit/src/runtime/app/stores.js
/**
* A function that returns all of the contextual stores. On the server, this must be called during component initialization.
* Only use this if you need to defer store subscription until after the component has mounted, for some reason.
*
* @deprecated Use `$app/state` instead (requires Svelte 5, [see docs for more info](https://svelte.dev/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated))
*/
var getStores = () => {
	const stores$1 = getContext("__svelte__");
	return {
		/** @type {typeof page} */
		page: { subscribe: stores$1.page.subscribe },
		/** @type {typeof navigating} */
		navigating: { subscribe: stores$1.navigating.subscribe },
		/** @type {typeof updated} */
		updated: stores$1.updated
	};
};
/**
* A readable store whose value contains page data.
*
* On the server, this store can only be subscribed to during component initialization. In the browser, it can be subscribed to at any time.
*
* @deprecated Use `page` from `$app/state` instead (requires Svelte 5, [see docs for more info](https://svelte.dev/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated))
* @type {import('svelte/store').Readable<import('@sveltejs/kit').Page>}
*/
var page = { subscribe(fn) {
	return getStores().page.subscribe(fn);
} };
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let base, current;
		let data = $$props["data"];
		const navItems = [
			{
				href: "/",
				icon: "🏠",
				label: "Maison"
			},
			{
				href: "/tasks",
				icon: "📋",
				label: "Tâches"
			},
			{
				href: "/leaderboard",
				icon: "🏆",
				label: "Classement"
			},
			{
				href: "/profile",
				icon: "👤",
				label: "Profil"
			}
		];
		base = data.base ?? "";
		current = store_get($$store_subs ??= {}, "$page", page).url.pathname.replace(base, "") || "/";
		if (data.user) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-col min-h-screen bg-gray-50"><header class="bg-purple-700 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-10"><div class="flex items-center gap-2"><span class="text-xl">🏠</span> <span class="font-bold text-lg">ManoirQuest</span></div> <div class="flex items-center gap-3"><span class="text-sm bg-purple-600 px-2 py-1 rounded-full">${escape_html(data.user.avatar)} ${escape_html(data.user.name)}</span> <button class="text-purple-200 text-xs hover:text-white">Quitter</button></div></header> <main class="flex-1 pb-20 overflow-y-auto"><!--[-->`);
			slot($$renderer, $$props, "default", {});
			$$renderer.push(`<!--]--></main> <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 safe-area-bottom svelte-12qhfyh"><div class="flex"><!--[-->`);
			const each_array = ensure_array_like(navItems);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				const active = current === item.href;
				$$renderer.push(`<a${attr("href", base + item.href)}${attr_class(`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors ${active ? "text-purple-700 font-semibold" : "text-gray-500"}`)}><span class="text-xl">${escape_html(item.icon)}</span> <span>${escape_html(item.label)}</span> `);
				if (active) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="absolute bottom-0 w-8 h-0.5 bg-purple-600 rounded-t-full"></span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></a>`);
			}
			$$renderer.push(`<!--]--></div></nav></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			slot($$renderer, $$props, "default", {});
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
		bind_props($$props, { data });
	});
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-DuTWQn5b.js.map
