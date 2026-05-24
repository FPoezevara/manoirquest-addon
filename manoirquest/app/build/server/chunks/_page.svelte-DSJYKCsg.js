import { I as head, u as escape_html, h as attr_class, i as attr_style, af as stringify, s as ensure_array_like, g as attr, j as bind_props } from './dev-C19Uo_57.js';

//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let base, houseColor, houseEmoji;
		let data = $$props["data"];
		base = data.base ?? "";
		houseColor = data.houseScore >= 75 ? "bg-green-500" : data.houseScore >= 40 ? "bg-yellow-400" : "bg-red-400";
		houseEmoji = data.houseScore >= 75 ? "✨" : data.houseScore >= 40 ? "🧹" : "😱";
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ManoirQuest — Maison</title>`);
			});
		});
		$$renderer.push(`<div class="p-4 space-y-5 max-w-lg mx-auto"><div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"><div class="flex items-center justify-between mb-2"><span class="font-semibold text-gray-700">🏠 Propreté de la maison</span> <span class="text-2xl">${escape_html(houseEmoji)}</span></div> <div class="w-full bg-gray-100 rounded-full h-4 overflow-hidden"><div${attr_class(`${stringify(houseColor)} h-4 rounded-full transition-all duration-700`)}${attr_style(`width:${stringify(data.houseScore)}%`)}></div></div> <p class="text-right text-sm text-gray-500 mt-1">${escape_html(data.houseScore)}%</p></div> <div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"><h2 class="font-semibold text-gray-700 mb-3">🏆 Classement de la semaine</h2> <div class="space-y-2"><!--[-->`);
		const each_array = ensure_array_like(data.leaderboard);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let player = each_array[i];
			$$renderer.push(`<div${attr_class(`flex items-center gap-3 ${i === 0 ? "bg-yellow-50 rounded-xl p-2" : "px-2 py-1"}`)}><span class="text-xl w-6 text-center">${escape_html(i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`)}</span> <span class="text-2xl">${escape_html(player.avatar)}</span> <span class="flex-1 font-medium text-gray-800">${escape_html(player.name)}</span> <span class="text-purple-700 font-bold">${escape_html(player.weeklyPoints)} pts</span> <span class="text-xs text-gray-400 w-10 text-center">Niv.${escape_html(player.level)}</span></div>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		if (data.pendingValidation.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-orange-50 border border-orange-200 rounded-2xl p-4"><h2 class="font-semibold text-orange-700 mb-2">⏳ À valider (${escape_html(data.pendingValidation.length)})</h2> <!--[-->`);
			const each_array_1 = ensure_array_like(data.pendingValidation);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let inst = each_array_1[$$index_1];
				$$renderer.push(`<div class="flex items-center justify-between bg-white rounded-xl p-3 mb-2 shadow-sm"><div><span class="text-lg mr-1">${escape_html(inst.task?.emoji)}</span> <span class="font-medium">${escape_html(inst.task?.name)}</span> <span class="text-xs text-gray-500 block">par ${escape_html(inst.claimedByUser?.avatar)} ${escape_html(inst.claimedByUser?.name)}</span></div> <div class="flex gap-2"><form method="POST"${attr("action", `${stringify(base)}/tasks?/validate`)}><input type="hidden" name="instanceId"${attr("value", inst.id)}/> <input type="hidden" name="approved" value="true"/> <button class="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium">✓</button></form> <form method="POST"${attr("action", `${stringify(base)}/tasks?/refuse`)}><input type="hidden" name="instanceId"${attr("value", inst.id)}/> <button class="bg-red-400 text-white px-3 py-1.5 rounded-lg text-sm font-medium">✗</button></form></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.urgent.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"><h2 class="font-semibold text-gray-700 mb-3">📋 Tâches en attente</h2> <!--[-->`);
			const each_array_2 = ensure_array_like(data.urgent);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let inst = each_array_2[$$index_2];
				$$renderer.push(`<div class="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0"><span class="text-xl">${escape_html(inst.task?.emoji)}</span> <span class="flex-1 text-gray-700">${escape_html(inst.task?.name)}</span> <span class="text-xs text-purple-600 font-semibold">+${escape_html(inst.task?.points)}pts</span></div>`);
			}
			$$renderer.push(`<!--]--> <a${attr("href", `${stringify(base)}/tasks`)} class="block text-center text-purple-600 text-sm font-medium mt-3">Voir toutes les tâches →</a></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.recentDone.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"><h2 class="font-semibold text-gray-700 mb-3">✅ Activité récente</h2> <!--[-->`);
			const each_array_3 = ensure_array_like(data.recentDone);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let inst = each_array_3[$$index_3];
				$$renderer.push(`<div class="flex items-center gap-2 text-sm py-1.5 border-b border-gray-50 last:border-0"><span>${escape_html(inst.claimedByUser?.avatar)}</span> <span class="text-gray-600">${escape_html(inst.claimedByUser?.name)}</span> <span class="text-gray-400">a fait</span> <span>${escape_html(inst.task?.emoji)}</span> <span class="flex-1 text-gray-700 truncate">${escape_html(inst.task?.name)}</span> <span class="text-green-600 font-semibold text-xs">+${escape_html(inst.pointsAwarded)}pts</span></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { data });
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DSJYKCsg.js.map
