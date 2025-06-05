import { defineStore } from "pinia";
import type { Component } from "@/types/Component";
import type { Schema } from "@/types/Schema";

export const useSchema = defineStore("schema", {
	state() {
		return {
			key: "schema",
			props: {
				width: 1920,
				height: 1080,
				backgroundColor: "#000000",
			},
			components: [] as Component[],
		} as Schema;
	},
	getters: {
		moveableComponents(): Component[] {
			return this.components.filter((v) => v.moveable);
		},
		activeMoveableComponents(): Component[] {
			return this.components.filter((v) => v.active && v.moveable);
		},
		unactiveMoveableComponents(): Component[] {
			return this.components.filter((v) => !v.active && v.moveable);
		},
		flatComponents(): Component[] {
			return this.components.flatMap((v) => flat(v));
			function flat(component: Component): Component[] {
				return [component, ...component.components.flatMap(flat)];
			}
		},
		activeFlatComponents(): Component[] {
			return this.flatComponents.filter((v) => v.active);
		},
	},
	actions: {
		// 找到组件的父元素
		findParent(componentId: string) {
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
		// 是否是根元素
		isSchema(component: Schema | Component | null) {
			return component?.key === "schema";
		},
		// 删除组件
		removeComponent(componentId: string) {
			const parent = this.findParent(componentId);
			if (parent) {
				const index = parent.components.findIndex((item) => item.id === componentId);
				if (index !== -1) {
					parent.components.splice(index, 1);
				}
			}
		},
		// 移出分组
		moveOut(componentId: string) {
			const parent = this.findParent(componentId);
			if (parent) {
				const index = parent.components.findIndex((item) => item.id === componentId);
				if (index !== -1) {
					if (parent.components[index].moveable) {
						parent.components[index].props.left = parent.props.left + parent.components[index].props.left;
						parent.components[index].props.top = parent.props.top + parent.components[index].props.top;
					}
					this.components.push(...parent.components.splice(index, 1));
				}
			}
		},
	},
});
