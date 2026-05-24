import { I as head, s as ensure_array_like, u as escape_html, j as bind_props } from './dev-C19Uo_57.js';

//#region src/routes/login/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let form = $$props["form"];
		Array.from({ length: 4 }, (_, i) => i < 0);
		head("1x05zx6", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ManoirQuest — Connexion</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center p-4">`);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center mb-8"><div class="text-5xl mb-2">🏠</div> <h1 class="text-3xl font-bold text-white">ManoirQuest</h1> <p class="text-purple-200 mt-1">Qui joue ?</p></div> <div class="grid grid-cols-2 gap-4 w-full max-w-sm"><!--[-->`);
			const each_array = ensure_array_like(data.players);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let player = each_array[$$index];
				$$renderer.push(`<button class="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-2xl p-5 flex flex-col items-center gap-2 transition-all active:scale-95"><span class="text-5xl">${escape_html(player.avatar)}</span> <span class="text-white font-semibold text-lg">${escape_html(player.name)}</span> `);
				if (player.role === "parent") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-xs text-yellow-300">👑 Parent</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></button>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, {
			data,
			form
		});
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CyKRHVel.js.map
