import { W as escape_html, i as bind_props, n as attr_class, o as ensure_array_like, s as head } from "../../../chunks/dev.js";
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
		$$renderer.push(`<div class="seg"><button${attr_class("", void 0, { "on": true })}>Cette semaine</button> <button${attr_class("", void 0, { "on": false })}>Tout temps</button></div> `);
		if (list.length >= 3) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="podium"><div class="podium-col"><span class="av">${escape_html(list[1].avatar)}</span> <span class="nm">${escape_html(list[1].name)}</span> <div class="podium-bar silver">${escape_html(list[1][scoreKey])}</div></div> <div class="podium-col"><span class="av" style="font-size:48px">${escape_html(list[0].avatar)}</span> <span class="nm">${escape_html(list[0].name)}</span> <div class="podium-bar gold">${escape_html(list[0][scoreKey])}</div></div> <div class="podium-col"><span class="av">${escape_html(list[2].avatar)}</span> <span class="nm">${escape_html(list[2].name)}</span> <div class="podium-bar bronze">${escape_html(list[2][scoreKey])}</div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="card" style="padding:4px 16px"><!--[-->`);
		const each_array = ensure_array_like(list);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let player = each_array[i];
			$$renderer.push(`<div class="list-row"><span class="rank">${escape_html(medals[i] ?? `${i + 1}.`)}</span> <span class="avatar" style="font-size:24px">${escape_html(player.avatar)}</span> <div class="grow"><p style="font-weight:600; margin:0">${escape_html(player.name)}</p> <p class="lvl" style="margin:0">Niveau ${escape_html(player.level)} `);
			if (player.badges && player.badges.length) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`· <span class="chips">${escape_html(player.badges.map((b) => b.emoji).join(""))}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></p></div> <div style="text-align:right"><p class="pts" style="margin:0">${escape_html(player[scoreKey])} pts</p> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="lvl" style="margin:0">Total : ${escape_html(player.totalPoints)}</p>`);
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { data });
	});
}
//#endregion
export { _page as default };
