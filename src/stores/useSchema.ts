import { defineStore } from "pinia";
import type { Component } from "@/types/Component";
import type { Schema } from "@/types/Schema";

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
		} as Schema;
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
				return [component, ...component.components.flatMap(flat)];
			}
		},
	},
	actions: {
		// 找到组件的父元素
		findParentComponent(componentId: string) {
			const findInComponents = (components: Component[], parent: Schema | Component): Schema | Component | null => {
				for (const component of components) {
					if (component.id === componentId) return parent;
					if (component.components && component.components.length > 0) {
						const result = findInComponents(component.components, component);
						if (result) return result;
					}
				}
				return null;
			};
			return findInComponents(this.components, this);
		},
		// 删除组件
		removeComponent(componentId: string) {
			const parent = this.findParentComponent(componentId);
			if (parent) parent.components = parent.components.filter((item) => item.id !== componentId);
		},
		// 移出分组
		moveOut(componentId: string) {
			const parent = this.findParentComponent(componentId);
			if (parent) {
				const index = parent.components.findIndex((item) => item.id === componentId);
				if (index !== -1) {
					parent.components[index].left = (parent.left || 0) + parent.components[index].left;
					parent.components[index].top = (parent.top || 0) + parent.components[index].top;
					this.components.push(...parent.components.splice(index, 1));
				}
			}
		},
	},
});
