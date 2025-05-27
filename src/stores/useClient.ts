import { defineStore } from "pinia";

export const useClient = defineStore("client", {
	state() {
		return {
			canvas: {
				left: 30,
				top: 30,
				scale: 1,
			},
			snap: {
				distance: 10,
			},
			grid: {
				enableSnap: true,
				span: 10,
			},
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
