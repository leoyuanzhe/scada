import { defineStore } from "pinia";
import { useSchema } from "./useSchema";

export const useClient = defineStore("client", {
	state() {
		return {
			oRenderer: null as HTMLDivElement | null,
			draggingAsset: false,
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
		// 计算画布布局
		computedCanvasLayout() {
			const schemaStore = useSchema();
			if (this.oRenderer) {
				this.canvas.left = 30;
				this.canvas.top = 30;
				this.canvas.scale = Math.max(Math.min((this.oRenderer.offsetWidth - 40) / schemaStore.layout.width, 5), 0.1);
			}
		},
	},
});
