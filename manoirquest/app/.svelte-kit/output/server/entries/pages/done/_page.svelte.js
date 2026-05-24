import { H as attr, W as escape_html, i as bind_props, o as ensure_array_like, s as head } from "../../../chunks/dev.js";
//#region src/routes/done/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let form = $$props["form"];
		function fmt(ts) {
			if (!ts) return "";
			const m = ts.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
			return m ? `${m[3]}/${m[2]} · ${m[4]}:${m[5]}` : ts;
		}
		head("1fcdzl5", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ManoirQuest — Faites</title>`);
			});
		});
		$$renderer.push(`<div class="stack">`);
		if (form?.success) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="banner banner-ok">Tâche annulée, points retirés.</div>`);
		} else if (form?.error) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="banner banner-err">${escape_html(form.error)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2 class="card-h bare">✅ Tâches faites</h2> `);
		if (data.done.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="empty"><div class="em">📭</div> <p style="font-weight:500; margin:6px 0 0">Aucune tâche enregistrée pour l'instant.</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="stack" style="gap:8px"><!--[-->`);
			const each_array = ensure_array_like(data.done);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let inst = each_array[$$index];
				$$renderer.push(`<div class="done-row"><span class="avatar" style="font-size:24px">${escape_html(inst.claimedByUser?.avatar ?? "🧑")}</span> <div class="grow"><p class="small" style="margin:0; font-weight:500"><span>${escape_html(inst.task.emoji)}</span> ${escape_html(inst.task.name)}</p> <p class="tiny dim" style="margin:1px 0 0">${escape_html(inst.claimedByUser?.name ?? "—")} · ${escape_html(fmt(inst.validatedAt))}</p></div> <span class="pts-pos tiny" style="white-space:nowrap">+${escape_html(inst.pointsAwarded)}</span> <form method="POST" action="?/undo"><input type="hidden" name="instanceId"${attr("value", inst.id)}/> <button class="btn-undo" title="Annuler (retire les points)">Annuler</button></form></div>`);
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
//#endregion
export { _page as default };
