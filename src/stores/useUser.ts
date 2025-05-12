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
		setState({ token, userInfo }: { token?: string; userInfo?: UserInfo }) {
			if (token !== void 0) {
				this.token = token;
				localStorage.setItem("token", token);
			}
			if (userInfo !== void 0) {
				this.userInfo = userInfo;
				localStorage.setItem("user_info", JSON.stringify(userInfo));
			}
		},
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
