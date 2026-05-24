import { H as attr, W as escape_html, i as bind_props, o as ensure_array_like, r as attr_style, s as head } from "../../../chunks/dev.js";
//#region src/routes/settings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let form = $$props["form"];
		const KINDS = [
			{
				v: "weekdays",
				l: "Jours de la semaine"
			},
			{
				v: "weekly",
				l: "1×/semaine"
			},
			{
				v: "biweekly",
				l: "Toutes les 2 semaines"
			},
			{
				v: "monthly",
				l: "1×/mois"
			},
			{
				v: "manual",
				l: "Manuel (à la volée)"
			}
		];
		const DAYS = [
			{
				v: 1,
				l: "Lun"
			},
			{
				v: 2,
				l: "Mar"
			},
			{
				v: 3,
				l: "Mer"
			},
			{
				v: 4,
				l: "Jeu"
			},
			{
				v: 5,
				l: "Ven"
			},
			{
				v: 6,
				l: "Sam"
			},
			{
				v: 7,
				l: "Dim"
			}
		];
		const DIFFS = [
			{
				v: 1,
				l: "★ Facile"
			},
			{
				v: 2,
				l: "★★ Moyen"
			},
			{
				v: 3,
				l: "★★★ Dur"
			}
		];
		head("1i19ct2", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ManoirQuest — Réglages</title>`);
			});
		});
		$$renderer.push(`<div class="stack">`);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="banner banner-err">${escape_html(form.error)}</div>`);
		} else if (form?.created) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="banner banner-ok">Tâche créée.</div>`);
		} else if (form?.updated) {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<div class="banner banner-ok">Tâche enregistrée.</div>`);
		} else if (form?.deleted) {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<div class="banner banner-ok">Tâche supprimée.</div>`);
		} else if (form?.rewardCreated) {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<div class="banner banner-ok">Récompense créée.</div>`);
		} else if (form?.rewardUpdated) {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<div class="banner banner-ok">Récompense enregistrée.</div>`);
		} else if (form?.rewardDeleted) {
			$$renderer.push("<!--[6-->");
			$$renderer.push(`<div class="banner banner-ok">Récompense supprimée.</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <h2 class="section-title">📋 Tâches</h2> <form method="POST" action="?/create" class="card stack" style="gap:10px"><div class="card-h bare">➕ Nouvelle tâche</div> <div class="row"><input class="input" name="emoji" placeholder="✅" maxlength="2" style="width:54px; text-align:center"/> <input class="input grow" name="name" placeholder="Nom de la tâche" required=""/></div> <div class="row"><label class="field"><span class="flabel">Points</span> <input class="input" type="number" name="points" value="20" min="0" step="5" style="width:80px"/></label> <label class="field"><span class="flabel">Étoiles (difficulté)</span> <select class="select" name="difficulty"><!--[-->`);
		const each_array = ensure_array_like(DIFFS);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let d = each_array[$$index];
			$$renderer.option({
				value: d.v,
				selected: d.v === 2
			}, ($$renderer) => {
				$$renderer.push(`${escape_html(d.l)}`);
			});
		}
		$$renderer.push(`<!--]--></select></label></div> <div class="row"><label class="field grow"><span class="flabel">Fréquence</span> <select class="select" name="kind"><!--[-->`);
		const each_array_1 = ensure_array_like(KINDS);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let k = each_array_1[$$index_1];
			$$renderer.option({
				value: k.v,
				selected: k.v === "weekly"
			}, ($$renderer) => {
				$$renderer.push(`${escape_html(k.l)}`);
			});
		}
		$$renderer.push(`<!--]--></select></label> <label class="field"><span class="flabel">Jour habituel</span> <select class="select" name="anchorDay" style="width:110px">`);
		$$renderer.option({ value: "" }, ($$renderer) => {
			$$renderer.push(`—`);
		});
		$$renderer.push(`<!--[-->`);
		const each_array_2 = ensure_array_like(DAYS);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let d = each_array_2[$$index_2];
			$$renderer.option({ value: d.v }, ($$renderer) => {
				$$renderer.push(`${escape_html(d.l)}`);
			});
		}
		$$renderer.push(`<!--]--></select></label></div> <div><span class="flabel">Jours fixes (si « jours de la semaine »)</span> <div class="day-row"><!--[-->`);
		const each_array_3 = ensure_array_like(DAYS);
		for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
			let d = each_array_3[$$index_3];
			$$renderer.push(`<label class="day-check"><input type="checkbox" name="day"${attr("value", d.v)}/><span>${escape_html(d.l)}</span></label>`);
		}
		$$renderer.push(`<!--]--></div></div> <button class="btn btn-accent" style="align-self:flex-start">Créer la tâche</button></form> <h3 class="card-h bare">📚 Catalogue (${escape_html(data.catalogue.length)})</h3> <!--[-->`);
		const each_array_4 = ensure_array_like(data.catalogue);
		for (let $$index_8 = 0, $$length = each_array_4.length; $$index_8 < $$length; $$index_8++) {
			let t = each_array_4[$$index_8];
			$$renderer.push(`<form method="POST" action="?/update" class="card stack"${attr_style(`gap:10px; ${t.active ? "" : "opacity:.6"}`)}><input type="hidden" name="id"${attr("value", t.id)}/> <div class="row"><input class="input" name="emoji"${attr("value", t.emoji)} maxlength="2" style="width:54px; text-align:center"/> <input class="input grow" name="name"${attr("value", t.name)} required=""/></div> <div class="row"><label class="field"><span class="flabel">Points</span> <input class="input" type="number" name="points"${attr("value", t.points)} min="0" step="5" style="width:80px"/></label> <label class="field"><span class="flabel">Étoiles</span> <select class="select" name="difficulty"><!--[-->`);
			const each_array_5 = ensure_array_like(DIFFS);
			for (let $$index_4 = 0, $$length = each_array_5.length; $$index_4 < $$length; $$index_4++) {
				let d = each_array_5[$$index_4];
				$$renderer.option({
					value: d.v,
					selected: d.v === t.difficulty
				}, ($$renderer) => {
					$$renderer.push(`${escape_html(d.l)}`);
				});
			}
			$$renderer.push(`<!--]--></select></label></div> <div class="row"><label class="field grow"><span class="flabel">Fréquence</span> <select class="select" name="kind"><!--[-->`);
			const each_array_6 = ensure_array_like(KINDS);
			for (let $$index_5 = 0, $$length = each_array_6.length; $$index_5 < $$length; $$index_5++) {
				let k = each_array_6[$$index_5];
				$$renderer.option({
					value: k.v,
					selected: k.v === t.kind
				}, ($$renderer) => {
					$$renderer.push(`${escape_html(k.l)}`);
				});
			}
			$$renderer.push(`<!--]--></select></label> <label class="field"><span class="flabel">Jour habituel</span> <select class="select" name="anchorDay" style="width:110px">`);
			$$renderer.option({
				value: "",
				selected: !t.anchorDay
			}, ($$renderer) => {
				$$renderer.push(`—`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array_7 = ensure_array_like(DAYS);
			for (let $$index_6 = 0, $$length = each_array_7.length; $$index_6 < $$length; $$index_6++) {
				let d = each_array_7[$$index_6];
				$$renderer.option({
					value: d.v,
					selected: d.v === t.anchorDay
				}, ($$renderer) => {
					$$renderer.push(`${escape_html(d.l)}`);
				});
			}
			$$renderer.push(`<!--]--></select></label></div> <div><span class="flabel">Jours fixes</span> <div class="day-row"><!--[-->`);
			const each_array_8 = ensure_array_like(DAYS);
			for (let $$index_7 = 0, $$length = each_array_8.length; $$index_7 < $$length; $$index_7++) {
				let d = each_array_8[$$index_7];
				$$renderer.push(`<label class="day-check"><input type="checkbox" name="day"${attr("value", d.v)}${attr("checked", t.days.includes(d.v), true)}/><span>${escape_html(d.l)}</span></label>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="between"><label class="active-toggle"><input type="checkbox" name="active"${attr("checked", t.active, true)}/><span>Active</span></label> <div class="row" style="gap:8px"><button class="btn-undo" formaction="?/delete">Supprimer</button> <button class="btn btn-accent">Enregistrer</button></div></div></form>`);
		}
		$$renderer.push(`<!--]--> <h2 class="section-title">🎁 Récompenses</h2> <form method="POST" action="?/createReward" class="card stack" style="gap:10px"><div class="card-h bare">➕ Nouvelle récompense</div> <div class="row"><input class="input" name="emoji" placeholder="🎁" maxlength="2" style="width:54px; text-align:center"/> <input class="input grow" name="name" placeholder="Nom de la récompense" required=""/></div> <input class="input" name="description" placeholder="Description (facultatif)"/> <label class="field"><span class="flabel">Coût (points)</span> <input class="input" type="number" name="cost" value="200" min="0" step="50" style="width:110px"/></label> <button class="btn btn-accent" style="align-self:flex-start">Créer la récompense</button></form> <h3 class="card-h bare">🏆 Liste (${escape_html(data.rewards.length)})</h3> <!--[-->`);
		const each_array_9 = ensure_array_like(data.rewards);
		for (let $$index_9 = 0, $$length = each_array_9.length; $$index_9 < $$length; $$index_9++) {
			let r = each_array_9[$$index_9];
			$$renderer.push(`<form method="POST" action="?/updateReward" class="card stack"${attr_style(`gap:10px; ${r.is_active ? "" : "opacity:.6"}`)}><input type="hidden" name="id"${attr("value", r.id)}/> <div class="row"><input class="input" name="emoji"${attr("value", r.emoji)} maxlength="2" style="width:54px; text-align:center"/> <input class="input grow" name="name"${attr("value", r.name)} required=""/></div> <input class="input" name="description"${attr("value", r.description)} placeholder="Description (facultatif)"/> <label class="field"><span class="flabel">Coût (points)</span> <input class="input" type="number" name="cost"${attr("value", r.cost)} min="0" step="50" style="width:110px"/></label> <div class="between"><label class="active-toggle"><input type="checkbox" name="active"${attr("checked", !!r.is_active, true)}/><span>Active</span></label> <div class="row" style="gap:8px"><button class="btn-undo" formaction="?/deleteReward">Supprimer</button> <button class="btn btn-accent">Enregistrer</button></div></div></form>`);
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
