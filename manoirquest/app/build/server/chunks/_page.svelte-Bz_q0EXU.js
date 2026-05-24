import { J as head, t as ensure_array_like, g as attr, ag as stringify, h as attr_class, v as escape_html, i as attr_style, j as bind_props } from './dev-BiDXAdHk.js';

//#region src/routes/profile/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let base;
		let data = $$props["data"];
		let form = $$props["form"];
		base = data.base ?? "";
		head("maq4gq", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ManoirQuest — Profil</title>`);
			});
		});
		$$renderer.push(`<div class="stack"><div class="people"><!--[-->`);
		const each_array = ensure_array_like(data.players);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let p = each_array[$$index];
			$$renderer.push(`<a${attr("href", `${stringify(base)}/profile?u=${stringify(p.id)}`)}${attr_class("person", void 0, { "sel": p.id === data.selectedId })}><span class="av">${escape_html(p.avatar)}</span> <span>${escape_html(p.name)}</span></a>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (data.player) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="hero"><div class="row" style="margin-bottom:16px"><span class="big">${escape_html(data.player.avatar)}</span> <div><div class="name">${escape_html(data.player.name)}</div> <div class="tiny dim">Niveau ${escape_html(data.progress.level)}</div></div> <div style="margin-left:auto; text-align:right"><div class="total">${escape_html(data.player.totalPoints)}</div> <div class="tiny dim">points totaux</div></div></div> <div class="between tiny dim" style="margin-bottom:5px"><span>Niveau ${escape_html(data.progress.level)}</span> <span>${escape_html(data.progress.nextLevelPts - data.player.totalPoints)} pts → niveau suivant</span></div> <div class="progress"><span${attr_style(`width:${stringify(data.progress.progressPct)}%`)}></span></div></div> <div class="card"><h2 class="card-h">🏅 Badges (${escape_html(data.badges.length)})</h2> `);
			if (data.badges.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="small dim center" style="padding:14px 0; margin:0">Aucun badge pour l'instant — fais des tâches pour en débloquer !</p>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="badge-grid"><!--[-->`);
				const each_array_1 = ensure_array_like(data.badges);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let b = each_array_1[$$index_1];
					$$renderer.push(`<div class="badge"${attr("title", b.description)}><span class="em">${escape_html(b.emoji)}</span> <span class="nm">${escape_html(b.name)}</span></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="card"><h2 class="card-h bare">🎁 Récompenses</h2> <p class="tiny dim" style="margin:0 0 12px">${escape_html(data.player.name)} a <span class="pts">${escape_html(data.player.totalPoints)} pts</span></p> `);
			if (form?.error) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="banner banner-err" style="margin-bottom:12px">${escape_html(form.error)}</div>`);
			} else if (form?.success) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="banner banner-ok" style="margin-bottom:12px">Récompense réclamée ! 🎉</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <!--[-->`);
			const each_array_2 = ensure_array_like(data.rewards);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let reward = each_array_2[$$index_2];
				const canAfford = data.player.totalPoints >= reward.cost;
				$$renderer.push(`<div class="list-row"><span style="font-size:22px">${escape_html(reward.emoji)}</span> <div class="grow"><p class="small" style="font-weight:500; margin:0">${escape_html(reward.name)}</p> <p class="pts tiny" style="margin:0">${escape_html(reward.cost)} pts</p></div> <form method="POST" action="?/claimReward"><input type="hidden" name="rewardId"${attr("value", reward.id)}/> <input type="hidden" name="userId"${attr("value", data.selectedId)}/> <button${attr_class(`btn ${canAfford ? "btn-accent" : "btn-off"}`)}${attr("disabled", !canAfford, true)}>${escape_html(canAfford ? "Réclamer" : "Insuffisant")}</button></form></div>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (data.claims.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="card"><h2 class="card-h">📜 Récompenses réclamées</h2> <!--[-->`);
				const each_array_3 = ensure_array_like(data.claims);
				for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
					let claim = each_array_3[$$index_3];
					$$renderer.push(`<div class="list-row small"><span>${escape_html(claim.reward_emoji)}</span> <span class="grow muted">${escape_html(claim.reward_name)}</span> <span class="lvl">${escape_html(claim.reward_cost)} pts</span></div>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, {
			data,
			form
		});
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Bz_q0EXU.js.map
