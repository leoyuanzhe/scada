import { defineStore } from "pinia";
import { useSchema } from "./useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import type { Component } from "@/types/Component";

export const useClient = defineStore("client", {
	state() {
		return {
			oRenderer: null as HTMLDivElement | null,
			isPreview: false,
			canvas: {
				left: 30,
				top: 30,
				scale: 1,
			},
			keyboard: {
				spaceKey: false,
			},
			grid: {
				enable: true,
				span: 10,
			},
			snap: {
				enable: true,
				distance: 10,
			},
			operate: {
				enable: false,
			},
			clipboard: {
				component: null as Component | null,
			},
		};
	},
	actions: {
		init() {
			window.addEventListener("keydown", (e) => {
				switch (e.key) {
					case " ":
						this.keyboard.spaceKey = true;
						break;
				}
			});
			window.addEventListener("keyup", (e) => {
				switch (e.key) {
					case " ":
						this.keyboard.spaceKey = false;
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
		// 启用触发操作
		enableGrid() {
			const targetComponent = useTargetComponent();
			this.operate.enable = true;
			targetComponent.componentId.value = "";
		},
	},
});
