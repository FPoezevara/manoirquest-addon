import { U as escape_html, i as bind_props, n as attr_class, o as ensure_array_like, s as head } from "../../../chunks/dev.js";
//#region src/routes/leaderboard/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let list, scoreKey;
		let data = $$props["data"];
		const medals = [
			"🥇",
			"🥈",
			"🥉"
		];
		$: list = data.weekly;
		$: scoreKey = "weeklyPoints";
		head("c59208", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ManoirQuest — Classement</title>`);
			});
		});
		$$renderer.push(`<div class="p-4 max-w-lg mx-auto"><div class="flex bg-gray-100 rounded-xl p-1 mb-5"><button${attr_class(`flex-1 py-2 rounded-lg text-sm font-semibold transition-all bg-white shadow text-purple-700`)}>Cette semaine</button> <button${attr_class(`flex-1 py-2 rounded-lg text-sm font-semibold transition-all text-gray-500`)}>Tout temps</button></div> `);
		if (list.length >= 3) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-end justify-center gap-3 mb-6 px-4"><div class="flex flex-col items-center flex-1"><span class="text-4xl mb-1">${escape_html(list[1].avatar)}</span> <span class="text-sm font-semibold text-gray-700">${escape_html(list[1].name)}</span> <div class="w-full bg-gray-300 rounded-t-lg mt-2 h-16 flex items-end justify-center pb-1"><span class="text-white font-bold text-sm">${escape_html(list[1][scoreKey])}</span></div></div> <div class="flex flex-col items-center flex-1"><span class="text-5xl mb-1">${escape_html(list[0].avatar)}</span> <span class="text-sm font-bold text-gray-800">${escape_html(list[0].name)}</span> <div class="w-full bg-yellow-400 rounded-t-lg mt-2 h-24 flex items-end justify-center pb-1"><span class="text-white font-bold">${escape_html(list[0][scoreKey])}</span></div></div> <div class="flex flex-col items-center flex-1"><span class="text-4xl mb-1">${escape_html(list[2].avatar)}</span> <span class="text-sm font-semibold text-gray-700">${escape_html(list[2].name)}</span> <div class="w-full bg-amber-600 rounded-t-lg mt-2 h-10 flex items-end justify-center pb-1"><span class="text-white font-bold text-sm">${escape_html(list[2][scoreKey])}</span></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"><!--[-->`);
		const each_array = ensure_array_like(list);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let player = each_array[i];
			$$renderer.push(`<div${attr_class(`flex items-center gap-3 px-4 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} ${i < list.length - 1 ? "border-b border-gray-100" : ""}`)}><span class="text-lg w-7 text-center">${escape_html(medals[i] ?? `${i + 1}.`)}</span> <span class="text-2xl">${escape_html(player.avatar)}</span> <div class="flex-1"><p class="font-semibold text-gray-800">${escape_html(player.name)}</p> <p class="text-xs text-gray-400">Niveau ${escape_html(player.level)}</p></div> <div class="text-right"><p class="font-bold text-purple-700">${escape_html(player[scoreKey])} pts</p> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-xs text-gray-400">Total: ${escape_html(player.totalPoints)}</p>`);
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
		bind_props($$props, { data });
	});
}
//#endregion
export { _page as default };
