import { u as listPlayers } from "../../chunks/players.js";
//#region src/routes/+layout.server.ts
var load = async ({ locals }) => {
	return {
		base: locals.base,
		players: listPlayers()
	};
};
//#endregion
export { load };
