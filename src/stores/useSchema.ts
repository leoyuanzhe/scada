import { defineStore } from "pinia";

type UserInfo = { [key: string]: any };
export const useSchema = defineStore("schema", {
	state() {
		return {
			canvas: {},
			components: [],
		};
	},
	actions: {},
});
