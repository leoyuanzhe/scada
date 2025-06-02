import type { Component } from "@/types/Component";
import { defineStore } from "pinia";

export const useSchema = defineStore("schema", {
	state() {
		return {
			canvas: {
				width: 1920,
				height: 1080,
				backgroundColor: "#000000",
			},
			targetComponentId: "",
			components: [] as Component[],
		};
	},
	getters: {
		targetComponent(): Component | null {
			if (this.targetComponentId) {
				return this.activeFlatComponents.find((v) => v.id === this.targetComponentId) || null;
			} else if (this.activeFlatComponents.length == 0) {
				this.targetComponentId = "";
				return null;
			} else if (this.activeFlatComponents.length === 1) {
				this.targetComponentId = this.activeFlatComponents[0].id;
				return this.activeFlatComponents[0];
			} else {
				this.targetComponentId = this.activeFlatComponents[this.activeFlatComponents.length - 1].id;
				return this.activeFlatComponents[this.activeFlatComponents.length - 1];
			}
		},
		activeComponents(): Component[] {
			return this.components.filter((v) => v.active);
		},
		unActiveComponents(): Component[] {
			return this.components.filter((v) => !v.locked && !v.active);
		},
		activeFlatComponents(): Component[] {
			return this.flatComponents.filter((v) => v.active);
		},
		flatComponents(): Component[] {
			return this.components.flatMap((v) => flat(v));
			function flat(component: Component): Component[] {
				return [component, ...component.children.flatMap(flat)];
			}
		},
	},
	actions: {
		// 找到组件的父元素
		findParentComponent(componentId: string) {
			const findInComponents = (components: Component[], parent: Component | null = null): Component | null => {
				for (const component of components) {
					if (component.id === componentId) return parent;
					if (component.children && component.children.length > 0) {
						const result = findInComponents(component.children, component);
						if (result) return result;
					}
				}
				return null;
			};
			return findInComponents(this.components);
		},
		// 删除组件
		removeComponent(componentId: string) {
			const parent = this.findParentComponent(componentId);
			if (parent) parent.children = parent.children.filter((item) => item.id !== componentId);
			else this.components = this.components.filter((item) => item.id !== componentId);
		},
	},
});
