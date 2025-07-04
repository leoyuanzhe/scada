import { defineStore } from "pinia";
import type { Component } from "@/types/Component";
import { useCommand } from "./useCommand";
import { useSchema } from "./useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import { deepClone } from "@/utils/conversion";

export const useClient = defineStore("client", {
	state() {
		return {
			oRenderer: null as HTMLDivElement | null,
			previewing: false,
			typing: false,
			canvas: {
				left: 30,
				top: 30,
				scale: 1,
			},
			keyboard: {
				pressingKey: "",
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
			enabledOperate: false,
			copiedComponents: null as Component[] | null,
		};
	},
	actions: {
		init() {
			const commandStore = useCommand();
			document.addEventListener("focusin", () => {
				this.typing = true;
			});
			document.addEventListener("focusout", () => {
				this.typing = false;
			});
			document.addEventListener("keydown", (e) => {
				this.keyboard.pressingKey = "";
				const key = e.key.toLowerCase();
				if (e.ctrlKey) this.keyboard.pressingKey += "ctrl+";
				else if (e.metaKey) this.keyboard.pressingKey += "ctrl+";
				if (e.altKey) this.keyboard.pressingKey += "alt+";
				if (e.shiftKey) this.keyboard.pressingKey += "shift+";
				switch (key) {
					case " ":
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
					case "space":
						e.preventDefault();
						this.keyboard.spaceKey = true;
						break;
				}
				const command = commandStore.commands.find((v) => v.shortcutKey === this.keyboard.pressingKey);
				if (command && !this.typing) {
					e.preventDefault();
					command.execute();
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
				this.canvas.scale = Math.max(Math.min((this.oRenderer.offsetWidth - 40) / schemaStore.layout.width, 5), 0.1);
			}
		},
		// 启用触发操作
		enableGrid() {
			const targetComponent = useTargetComponent();
			this.enabledOperate = true;
			targetComponent.componentId.value = "";
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
			const targetComponent = useTargetComponent();
			const dragger = useDragger();
			this.copyComponents(components);
			components.forEach((v) => schemaStore.deleteComponent(v));
			targetComponent.componentId.value = "";
			dragger.computedSelector();
		},
		// 粘贴组件
		pasteComponents() {
			const schemaStore = useSchema();
			const targetComponent = useTargetComponent();
			const dragger = useDragger();
			if (this.copiedComponents) {
				const targetComponentId = targetComponent.componentId.value;
				schemaStore.activedFlatComponents.forEach((v) => schemaStore.deactivateComponent(v));
				const tempTargetComponent = schemaStore.findComponent(targetComponentId);
				deepClone(this.copiedComponents).forEach((component) => {
					if (tempTargetComponent && !schemaStore.isSchema(tempTargetComponent) && tempTargetComponent.nestable) tempTargetComponent.components.push(component);
					else schemaStore.createComponent(component);
					schemaStore.activateComponent(component);
				});
				targetComponent.componentId.value = "";
				dragger.computedSelector();
				this.copyComponents(schemaStore.activedFlatComponents);
			}
		},
	},
});
