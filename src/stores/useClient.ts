import { defineStore } from "pinia";

export const useClient = defineStore("client", {
	state() {
		return {
			canvasLeft: 40,
			canvasTop: 40,
			canvasScale: 1,
			spaceKey: false,
		};
	},
	actions: {
		init() {
			window.addEventListener("keydown", (e) => {
				switch (e.key) {
					case " ":
						this.spaceKey = true;
						break;
				}
			});
			window.addEventListener("keyup", (e) => {
				switch (e.key) {
					case " ":
						this.spaceKey = false;
						break;
				}
			});
		},
	},
});
