import { defineStore } from "pinia";

type UserInfo = { [key: string]: any };
export const useUser = defineStore("user", {
	state() {
		return {
			token: "",
			userInfo: {} as UserInfo,
		};
	},
	actions: {
		syncToken() {
			return new Promise((resolve) => {
				resolve(null);
			});
		},
		syncUserInfo() {
			return new Promise(async (resolve) => {
				resolve(null);
			});
		},
	},
});
