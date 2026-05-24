import { J as head, v as escape_html, i as attr_style, ag as stringify, t as ensure_array_like, g as attr, j as bind_props } from './dev-BiDXAdHk.js';

//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let base, houseFill, houseEmoji;
		let data = $$props["data"];
		base = data.base ?? "";
		houseFill = data.houseScore >= 75 ? "#30d158" : data.houseScore >= 40 ? "#ffd60a" : "#ff453a";
		houseEmoji = data.houseScore >= 75 ? "✨" : data.houseScore >= 40 ? "🧹" : "😱";
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>ManoirQuest — Maison</title>`);
			});
		});
		$$renderer.push(`<div class="stack"><div class="card"><div class="between" style="margin-bottom:8px"><span class="card-h bare" style="margin:0">🏠 Propreté de la maison</span> <span style="font-size:22px">${escape_html(houseEmoji)}</span></div> <div class="gauge"><span${attr_style(`width:${stringify(data.houseScore)}%; background:${stringify(houseFill)}`)}></span></div> <p class="tiny dim" style="text-align:right; margin:6px 0 0">${escape_html(data.houseScore)}% des tâches de la semaine faites</p></div> <div class="card"><h2 class="card-h">🏆 Classement de la semaine</h2> <!--[-->`);
		const each_array = ensure_array_like(data.leaderboard);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let player = each_array[i];
			$$renderer.push(`<div class="list-row"><span class="rank">${escape_html(i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`)}</span> <span class="avatar" style="font-size:24px">${escape_html(player.avatar)}</span> <div class="grow"><span style="font-weight:500">${escape_html(player.name)}</span> `);
			if (player.badges && player.badges.length) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="chips">${escape_html(player.badges.slice(0, 4).map((b) => b.emoji).join(""))}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <span class="pts">${escape_html(player.weeklyPoints)} pts</span> <span class="lvl" style="width:48px; text-align:right">Niv.${escape_html(player.level)}</span></div>`);
		}
		$$renderer.push(`<!--]--></div> `);
		if (data.upcoming.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="card"><h2 class="card-h">📋 À faire (${escape_html(data.upcomingCount)})</h2> <!--[-->`);
			const each_array_1 = ensure_array_like(data.upcoming);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let inst = each_array_1[$$index_1];
				$$renderer.push(`<div class="list-row"><span style="font-size:20px">${escape_html(inst.task.emoji)}</span> <span class="grow truncate">${escape_html(inst.task.name)}</span> <span class="pts tiny">+${escape_html(inst.task.points)} pts</span></div>`);
			}
			$$renderer.push(`<!--]--> <a${attr("href", `${stringify(base)}/tasks`)} class="small" style="display:block; text-align:center; color:var(--accent); font-weight:600; margin-top:12px; text-decoration:none">Déclarer une tâche faite →</a></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="card center"><div style="font-size:40px">🎉</div> <p style="font-weight:600; color:var(--green); margin:6px 0 0">Tout est fait pour cette semaine !</p></div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (data.recentDone.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="card"><h2 class="card-h">✅ Dernières tâches faites</h2> <!--[-->`);
			const each_array_2 = ensure_array_like(data.recentDone);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let inst = each_array_2[$$index_2];
				$$renderer.push(`<div class="list-row small"><span>${escape_html(inst.claimedByUser?.avatar ?? "🧑")}</span> <span class="muted">${escape_html(inst.claimedByUser?.name ?? "—")}</span> <span class="dim">a fait</span> <span>${escape_html(inst.task.emoji)}</span> <span class="grow truncate">${escape_html(inst.task.name)}</span> <span class="pts-pos tiny">+${escape_html(inst.pointsAwarded)}</span></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { data });
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CIjBZInK.js.map
