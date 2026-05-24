import { af as store_get, g as attr, ag as stringify, h as attr_class, ad as slot, t as ensure_array_like, v as escape_html, ak as unsubscribe_stores, j as bind_props, B as getContext } from './dev-BiDXAdHk.js';
import './client-BSxRYNZI.js';
import './internal-C9xlRm40.js';
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
				href: "/done",
				icon: "✅",
				label: "Faites"
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
		$$renderer.push(`<div class="app"><header class="app-header"><span class="logo">🏠</span> <span class="title">ManoirQuest</span> <a${attr("href", `${stringify(base)}/settings`)}${attr_class("gear", void 0, { "active": current === "/settings" })} aria-label="Réglages des tâches" title="Réglages">⚙️</a></header> <main class="app-main"><!--[-->`);
		slot($$renderer, $$props, "default", {});
		$$renderer.push(`<!--]--></main> <nav class="tabbar"><!--[-->`);
		const each_array = ensure_array_like(navItems);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			const active = current === item.href;
			$$renderer.push(`<a${attr("href", base + item.href)}${attr_class("tab", void 0, { "active": active })}><span class="ic">${escape_html(item.icon)}</span> <span>${escape_html(item.label)}</span></a>`);
		}
		$$renderer.push(`<!--]--></nav></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
		bind_props($$props, { data });
	});
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-DVnk3Cl1.js.map
