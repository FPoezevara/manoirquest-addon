import { H as attr, U as escape_html, d as stringify, i as bind_props, n as attr_class, o as ensure_array_like, r as attr_style, s as head } from "../../../chunks/dev.js";
//#region src/routes/profile/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let form = $$props["form"];
		head("maq4gq", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ManoirQuest — Profil</title>`);
			});
		});
		$$renderer.push(`<div class="p-4 space-y-5 max-w-lg mx-auto"><div class="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl p-5 text-white"><div class="flex items-center gap-4 mb-4"><span class="text-6xl">${escape_html(data.user?.avatar)}</span> <div><h1 class="text-2xl font-bold">${escape_html(data.user?.name)}</h1> <p class="text-purple-200 text-sm">Niveau ${escape_html(data.user?.level)}</p></div> <div class="ml-auto text-right"><p class="text-3xl font-bold">${escape_html(data.user?.totalPoints)}</p> <p class="text-purple-200 text-xs">points totaux</p></div></div> <div><div class="flex justify-between text-xs text-purple-200 mb-1"><span>Niveau ${escape_html(data.user?.level)}</span> `);
		if (data.nextLevelPts) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span>${escape_html(data.nextLevelPts - (data.user?.totalPoints ?? 0))} pts pour le niveau suivant</span>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span>Niveau max !</span>`);
		}
		$$renderer.push(`<!--]--></div> <div class="bg-purple-900/50 rounded-full h-2"><div class="bg-yellow-400 h-2 rounded-full transition-all"${attr_style(`width:${stringify(data.progressPct)}%`)}></div></div></div></div> <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"><h2 class="font-bold text-gray-700 mb-3">🏅 Badges (${escape_html(data.earnedBadges.length)})</h2> `);
		if (data.earnedBadges.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-gray-400 text-sm text-center py-4">Aucun badge pour l'instant — commence à faire des tâches !</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-3 gap-3"><!--[-->`);
			const each_array = ensure_array_like(data.earnedBadges);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let ub = each_array[$$index];
				$$renderer.push(`<div class="flex flex-col items-center text-center p-2 bg-purple-50 rounded-xl"><span class="text-3xl">${escape_html(ub.badge?.emoji)}</span> <span class="text-xs font-medium text-gray-700 mt-1">${escape_html(ub.badge?.name)}</span></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"><h2 class="font-bold text-gray-700 mb-1">🎁 Récompenses</h2> <p class="text-xs text-gray-400 mb-3">Tu as <strong class="text-purple-700">${escape_html(data.user?.totalPoints)} pts</strong></p> `);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2 text-sm mb-3">${escape_html(form.error)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_1 = ensure_array_like(data.availableRewards);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let reward = each_array_1[$$index_1];
			const canAfford = (data.user?.totalPoints ?? 0) >= reward.cost;
			$$renderer.push(`<div class="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"><span class="text-2xl">${escape_html(reward.emoji)}</span> <div class="flex-1"><p class="font-medium text-gray-800 text-sm">${escape_html(reward.name)}</p> <p class="text-xs text-purple-600 font-semibold">${escape_html(reward.cost)} pts</p></div> <form method="POST" action="?/claimReward"><input type="hidden" name="rewardId"${attr("value", reward.id)}/> <button${attr("disabled", !canAfford, true)}${attr_class(`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${canAfford ? "bg-purple-600 hover:bg-purple-700 text-white active:scale-95" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`)}>${escape_html(canAfford ? "Réclamer" : "Insuffisant")}</button></form></div>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (data.myClaims.filter((c) => c.status === "pending").length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-4"><h2 class="font-bold text-yellow-700 mb-2">⏳ Récompenses en attente de validation</h2> <!--[-->`);
			const each_array_2 = ensure_array_like(data.myClaims.filter((c) => c.status === "pending"));
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let claim = each_array_2[$$index_2];
				$$renderer.push(`<div class="flex items-center gap-2 py-1"><span>${escape_html(claim.reward?.emoji)}</span> <span class="text-sm">${escape_html(claim.reward?.name)}</span> <span class="text-xs text-yellow-600 ml-auto">En attente…</span></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, {
			data,
			form
		});
	});
}
//#endregion
export { _page as default };
