import { H as attr, U as escape_html, i as bind_props, n as attr_class, o as ensure_array_like, s as head } from "../../../chunks/dev.js";
//#region src/routes/tasks/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let form = $$props["form"];
		const diffLabel = (d) => [
			"",
			"★",
			"★★",
			"★★★"
		][d] ?? "?";
		const diffColor = (d) => [
			"",
			"text-green-600",
			"text-yellow-600",
			"text-red-600"
		][d] ?? "";
		head("1pluywh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ManoirQuest — Tâches</title>`);
			});
		});
		$$renderer.push(`<div class="p-4 space-y-5 max-w-lg mx-auto">`);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2 text-sm">${escape_html(form.error)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.toValidate.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section><h2 class="font-bold text-orange-600 mb-2">⏳ À valider (${escape_html(data.toValidate.length)})</h2> <!--[-->`);
			const each_array = ensure_array_like(data.toValidate);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let inst = each_array[$$index];
				$$renderer.push(`<div class="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-2"><div class="flex items-start gap-3 mb-3"><span class="text-3xl">${escape_html(inst.task?.emoji)}</span> <div class="flex-1"><p class="font-semibold">${escape_html(inst.task?.name)}</p> <p class="text-sm text-gray-500">par ${escape_html(inst.claimedByUser?.avatar)} ${escape_html(inst.claimedByUser?.name)}
								· +${escape_html(inst.task?.points)} pts</p></div></div> <div class="flex gap-2"><form method="POST" action="?/validate" class="flex-1"><input type="hidden" name="instanceId"${attr("value", inst.id)}/> <input type="hidden" name="approved" value="true"/> <button class="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-2.5 font-semibold transition-colors">✓ Valider</button></form> <form method="POST" action="?/refuse" class="flex-1"><input type="hidden" name="instanceId"${attr("value", inst.id)}/> <button class="w-full bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-xl py-2.5 font-semibold transition-colors">✗ Refuser</button></form></div></div>`);
			}
			$$renderer.push(`<!--]--></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.myClaimed.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section><h2 class="font-bold text-purple-700 mb-2">🔄 En cours (${escape_html(data.myClaimed.length)})</h2> <!--[-->`);
			const each_array_1 = ensure_array_like(data.myClaimed);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let inst = each_array_1[$$index_1];
				$$renderer.push(`<div class="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-2 flex items-center gap-3"><span class="text-3xl">${escape_html(inst.task?.emoji)}</span> <div class="flex-1"><p class="font-semibold">${escape_html(inst.task?.name)}</p> <p class="text-xs text-purple-500">Durée ~${escape_html(inst.task?.durationMin)} min · +${escape_html(inst.task?.points)} pts</p></div> <form method="POST" action="?/declare"><input type="hidden" name="instanceId"${attr("value", inst.id)}/> <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Terminé !</button></form></div>`);
			}
			$$renderer.push(`<!--]--></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (data.myPending.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section><h2 class="font-bold text-yellow-600 mb-2">⏳ En attente de validation</h2> <!--[-->`);
			const each_array_2 = ensure_array_like(data.myPending);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let inst = each_array_2[$$index_2];
				$$renderer.push(`<div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-2 flex items-center gap-3 opacity-75"><span class="text-3xl">${escape_html(inst.task?.emoji)}</span> <div class="flex-1"><p class="font-semibold">${escape_html(inst.task?.name)}</p> <p class="text-xs text-yellow-600">En attente qu'un parent valide…</p></div> <span class="text-yellow-500 text-xl">⏳</span></div>`);
			}
			$$renderer.push(`<!--]--></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <section><h2 class="font-bold text-gray-700 mb-2">📋 Disponibles `);
		if (data.available.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="text-sm font-normal text-gray-400">(${escape_html(data.available.length)})</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></h2> `);
		if (data.available.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-center py-10 text-gray-400"><div class="text-5xl mb-2">🎉</div> <p class="font-medium">Toutes les tâches sont prises !</p> <p class="text-sm">Reviens plus tard.</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_3 = ensure_array_like(data.available);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let inst = each_array_3[$$index_3];
				$$renderer.push(`<div class="bg-white border border-gray-100 rounded-2xl p-4 mb-2 shadow-sm flex items-center gap-3"><span class="text-3xl">${escape_html(inst.task?.emoji)}</span> <div class="flex-1"><p class="font-semibold text-gray-800">${escape_html(inst.task?.name)}</p> <p class="text-xs text-gray-500 mt-0.5"><span${attr_class(diffColor(inst.task?.difficulty ?? 1))}>${escape_html(diffLabel(inst.task?.difficulty ?? 1))}</span> · ~${escape_html(inst.task?.durationMin)} min
							· <span class="text-purple-600 font-semibold">+${escape_html(inst.task?.points)} pts</span></p></div> <form method="POST" action="?/claim"><input type="hidden" name="instanceId"${attr("value", inst.id)}/> <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors active:scale-95">Je prends !</button></form></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></section></div>`);
		bind_props($$props, {
			data,
			form
		});
	});
}
//#endregion
export { _page as default };
