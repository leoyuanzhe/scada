import { defineStore } from "pinia";
import type { Component } from "@/types/Component";
import { useCommand } from "./useCommand";
import { useSchema } from "./useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { deepClone } from "@/utils/conversion";
import { generateComponetId } from "@/helpers/component";

export const useClient = defineStore("client", {
	state() {
		return {
			oRenderer: null as HTMLDivElement | null,
			previewing: false,
			typing: false,
			enabledOperate: false,
			copiedComponents: null as Component[] | null,
			canvas: {
				left: 30,
				top: 30,
				scale: 1,
			},
			keyboard: {
				pressingKey: "",
				spaceKey: false,
			},
			ruler: {
				show: true,
			},
			guide: {
				enable: true,
				width: 1,
				color: "#ff0000",
			},
			grid: {
				enable: true,
				span: 10,
				width: 1,
				color: "#ffffff33",
			},
			snap: {
				enable: true,
				distance: 10,
				width: 1,
				color: "#ff0000",
			},
		};
	},
	actions: {
		init() {
			document.addEventListener("focusin", () => {
				this.typing = true;
			});
			document.addEventListener("focusout", () => {
				this.typing = false;
			});
			document.addEventListener("keydown", (e) => {
				if (!this.typing) {
					const commandStore = useCommand();
					this.keyboard.pressingKey = "";
					const key = e.key.toLowerCase();
					if (e.ctrlKey) this.keyboard.pressingKey += "ctrl+";
					else if (e.metaKey) this.keyboard.pressingKey += "ctrl+";
					if (e.altKey) this.keyboard.pressingKey += "alt+";
					if (e.shiftKey) this.keyboard.pressingKey += "shift+";
					switch (key) {
						case " ":
							this.keyboard.spaceKey = true;
							this.keyboard.pressingKey += "space";
							break;
						case "control":
						case "meta":
						case "alt":
						case "shift":
							break;
						default:
							this.keyboard.pressingKey += key;
							break;
					}
					switch (this.keyboard.pressingKey) {
						case "ctrl+shift+s":
							e.preventDefault();
							commandStore.export();
							break;
						case "ctrl+i":
							e.preventDefault();
							commandStore.import();
							break;
						case "ctrl+o":
							e.preventDefault();
							commandStore.toggleOperate();
							break;
						case "ctrl+c":
							e.preventDefault();
							commandStore.copy();
							break;
						case "ctrl+x":
							e.preventDefault();
							commandStore.cut();
							break;
						case "ctrl+v":
							e.preventDefault();
							commandStore.paste();
							break;
						case "delete":
							e.preventDefault();
							commandStore.delete();
							break;
						case "ctrl+l":
							e.preventDefault();
							commandStore.toggleLocked();
							break;
						case "ctrl+h":
							e.preventDefault();
							commandStore.toggleHidden();
							break;
						case "ctrl+g":
							e.preventDefault();
							commandStore.createGroup();
							break;
						case "ctrl+shift+g":
							e.preventDefault();
							commandStore.flatChildrenToSchema();
							break;
					}
				}
			});
			document.addEventListener("keyup", (e) => {
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
				this.canvas.scale = Math.max(
					Math.min((this.oRenderer.offsetWidth - 40) / schemaStore.layout.width, 5),
					0.1
				);
			}
		},
		// 启用触发操作
		enableOperate() {
			const schemaStore = useSchema();
			const targetComponent = useTargetComponent();
			this.enabledOperate = true;
			schemaStore.deactivateAllComponent();
			targetComponent.componentId.value = "";
		},
		// 禁用触发操作
		disableOperate() {
			this.enabledOperate = false;
		},
		// 启用网格
		enableGrid() {
			this.grid.enable = true;
		},
		// 禁用网格线
		disableGrid() {
			this.grid.enable = false;
		},
		// 启用吸附
		enableSnap() {
			this.snap.enable = true;
		},
		// 禁用吸附
		disableSnap() {
			this.snap.enable = false;
		},
		// 复制组件
		copyComponents(components: Component[]) {
			this.copiedComponents = deepClone(components);
			this.copiedComponents.forEach((component) => {
				if (component.layout?.resizable) {
					component.layout.left += 20;
					component.layout.top += 20;
				}
			});
		},
		// 剪切组件
		cutComponents(components: Component[]) {
			const schemaStore = useSchema();
			this.copyComponents(components);
			components.forEach((v) => schemaStore.deleteComponent(v));
		},
		// 粘贴组件
		pasteComponents(parent?: Component | null) {
			const schemaStore = useSchema();
			const components: Component[] = [];
			if (this.copiedComponents) {
				deepClone(this.copiedComponents).forEach((component) => {
					if (parent && parent.nestable) {
						component.id = generateComponetId();
						parent.components.push(component);
					} else schemaStore.createComponent(component);
					components.push(component);
				});
				this.copyComponents(schemaStore.activedFlatedComponents);
				return components;
			}
		},
	},
});
