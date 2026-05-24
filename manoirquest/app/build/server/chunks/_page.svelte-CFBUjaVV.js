import { J as head, v as escape_html, t as ensure_array_like, h as attr_class, ag as stringify, m as clsx$1, g as attr, j as bind_props } from './dev-BiDXAdHk.js';

//#region src/routes/tasks/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let data = $$props["data"];
		let form = $$props["form"];
		const DAY = [
			"",
			"Lu",
			"Ma",
			"Me",
			"Je",
			"Ve",
			"Sa",
			"Di"
		];
		const DAY_LONG = [
			"",
			"lundi",
			"mardi",
			"mercredi",
			"jeudi",
			"vendredi",
			"samedi",
			"dimanche"
		];
		const diffLabel = (d) => [
			"",
			"★",
			"★★",
			"★★★"
		][d] ?? "";
		const diffClass = (d) => `diff-${d}`;
		const KIND_LABEL = {
			weekdays: "Jours fixes",
			weekly: "1×/sem",
			biweekly: "2 sem.",
			monthly: "1×/mois",
			manual: "Ponctuel"
		};
		const today = /* @__PURE__ */ new Date();
		today.setHours(0, 0, 0, 0);
		const fmt = new Intl.DateTimeFormat("fr-FR", {
			weekday: "short",
			day: "numeric",
			month: "short"
		});
		function parseYmd(s) {
			const [y, m, d] = s.split("-").map(Number);
			return new Date(y, m - 1, d);
		}
		function dueLabel(s) {
			const d = parseYmd(s);
			d.setHours(0, 0, 0, 0);
			const diff = Math.round((d.getTime() - today.getTime()) / 864e5);
			if (diff < 0) return {
				text: `En retard (${fmt.format(d)})`,
				late: true
			};
			if (diff === 0) return {
				text: "Aujourd'hui",
				late: false
			};
			if (diff === 1) return {
				text: "Demain",
				late: false
			};
			return {
				text: fmt.format(d),
				late: false
			};
		}
		head("1pluywh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ManoirQuest — Tâches</title>`);
			});
		});
		$$renderer.push(`<div class="stack">`);
		if (form?.error) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="banner banner-err">${escape_html(form.error)}</div>`);
		} else if (form?.success) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="banner banner-ok">Tâche validée, points attribués ! 🎉</div>`);
		} else if (form?.added) {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<div class="banner banner-ok">Tâche ajoutée à faire.</div>`);
		} else if (form?.dated) {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<div class="banner banner-ok">Date mise à jour. 📅</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <form method="POST" action="?/add" class="card add-form"><span class="add-plus">＋</span> <select name="taskId" class="select grow" aria-label="Tâche à ajouter">`);
		$$renderer.option({
			value: "",
			selected: true,
			disabled: true
		}, ($$renderer) => {
			$$renderer.push(`Ajouter une tâche à faire…`);
		});
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(data.catalogue);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let t = each_array[$$index];
			$$renderer.option({ value: t.id }, ($$renderer) => {
				$$renderer.push(`${escape_html(t.emoji)} ${escape_html(t.name)}`);
			});
		}
		$$renderer.push(`<!--]--></select> <button class="btn btn-accent">Ajouter</button></form> `);
		if (data.groups.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="empty"><div class="em">🎉</div> <p style="font-weight:500; margin:6px 0 0">Rien à faire pour le moment !</p></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_1 = ensure_array_like(data.groups);
		for (let $$index_4 = 0, $$length = each_array_1.length; $$index_4 < $$length; $$index_4++) {
			let group = each_array_1[$$index_4];
			$$renderer.push(`<section${attr_class(`bucket bucket-${stringify(group.key)}`)}><header class="bucket-h"><span class="bucket-title">${escape_html(group.label)}</span> <span class="bucket-count">${escape_html(group.items.length)}</span></header> <div class="stack" style="gap:10px"><!--[-->`);
			const each_array_2 = ensure_array_like(group.items);
			for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
				let inst = each_array_2[$$index_3];
				const due = dueLabel(inst.dueDate);
				$$renderer.push(`<div class="task-card"><div class="row" style="margin-bottom:10px"><span class="task-emoji">${escape_html(inst.task.emoji)}</span> <div class="grow"><p style="font-weight:600; margin:0">${escape_html(inst.task.name)}</p> <p class="tiny dim" style="margin:2px 0 0"><span${attr_class(clsx$1(diffClass(inst.task.difficulty)))}>${escape_html(diffLabel(inst.task.difficulty))}</span> · ~${escape_html(inst.task.durationMin)} min
									· <span class="pts">+${escape_html(inst.task.points)} pts</span></p> <div class="meta-chips"><span${attr_class("due-chip", void 0, { "late": due.late })}>📅 ${escape_html(due.text)}</span> `);
				if (inst.task.scheduleKind === "weekdays" && inst.task.scheduleDays.length < 7) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<!--[-->`);
					const each_array_3 = ensure_array_like(inst.task.scheduleDays);
					for (let $$index_1 = 0, $$length = each_array_3.length; $$index_1 < $$length; $$index_1++) {
						let d = each_array_3[$$index_1];
						$$renderer.push(`<span class="daychip">${escape_html(DAY[d])}</span>`);
					}
					$$renderer.push(`<!--]-->`);
				} else if (inst.task.anchorDay) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<span class="daychip">${escape_html(KIND_LABEL[inst.task.scheduleKind])} · ${escape_html(DAY_LONG[inst.task.anchorDay])}</span>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="kindchip">${escape_html(KIND_LABEL[inst.task.scheduleKind])}</span>`);
				}
				$$renderer.push(`<!--]--></div></div></div> <form method="POST" action="?/setDate" class="date-form"><input type="hidden" name="instanceId"${attr("value", inst.id)}/> <label class="date-label"${attr("for", `due-${stringify(inst.id)}`)}>Planifier :</label> <input${attr("id", `due-${stringify(inst.id)}`)} class="input date-input" type="date" name="date"${attr("value", inst.dueDate)}/> <button class="btn-mini" title="Enregistrer la date">OK</button></form> <form method="POST" action="?/complete" class="picker"><input type="hidden" name="instanceId"${attr("value", inst.id)}/> <!--[-->`);
				const each_array_4 = ensure_array_like(data.players);
				for (let $$index_2 = 0, $$length = each_array_4.length; $$index_2 < $$length; $$index_2++) {
					let p = each_array_4[$$index_2];
					$$renderer.push(`<button class="pick" name="userId"${attr("value", p.id)}${attr("title", `Fait par ${stringify(p.name)}`)}><span class="av">${escape_html(p.avatar)}</span> <span>${escape_html(p.name)}</span></button>`);
				}
				$$renderer.push(`<!--]--></form></div>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		}
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, {
			data,
			form
		});
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CFBUjaVV.js.map
