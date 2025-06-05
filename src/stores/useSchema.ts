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
		// 找到组件
		findComponent(componentId: string) {
			return this.flatComponents.find((v) => v.id === componentId) || null;
		},
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
		// 获取组件相对于根元素的偏移
		getOffsetFromSchema(componentId: string) {
			const component = this.findComponent(componentId);
			let left = component?.props.left ?? 0;
			let top = component?.props.top ?? 0;
			const parent = this.findParent(componentId);
			if (parent) {
				const index = parent.components.findIndex((v) => v.id === componentId);
				if (index !== -1) {
					if (!this.isSchema(parent) && parent.moveable) {
						left += parent.props.left;
						top += parent.props.top;
					}
				}
			}
			return { left, top };
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
		// 加入分组
		joinGroup(componentId: string, parentId: string) {
			this.moveOut(componentId);
			const parent = this.findParent(componentId);
			if (parent) {
				const index = parent.components.findIndex((v) => v.id === componentId);
				if (index !== -1) {
					const newParent = this.findComponent(parentId);
					if (newParent?.nestable) {
						newParent.components.push(parent.components.splice(index, 1)[0]);
					}
				}
			}
		},
		// 移出分组
		moveOut(componentId: string) {
			const parent = this.findParent(componentId);
			if (parent) {
				const index = parent.components.findIndex((v) => v.id === componentId);
				if (index !== -1) {
					if (parent.components[index].moveable) {
						let left = (parent.props.left ?? 0) + parent.components[index].props.left;
						let top = (parent.props.top ?? 0) + parent.components[index].props.top;
						const fn = (componentId: string) => {
							const parent = this.findParent(componentId);
							if (parent) {
								const index = parent.components.findIndex((v) => v.id === componentId);
								if (index !== -1) {
									if (!this.isSchema(parent) && parent.moveable) {
										left += parent.props.left;
										top += parent.props.top;
									}
								}
							}
						};
						if (!this.isSchema(parent)) fn((parent as Component).id);
						const component = parent.components.splice(index, 1)[0];
						component.props.left = left;
						component.props.top = top;
						this.components.push(component);
					} else this.components.push(parent.components.splice(index, 1)[0]);
				}
			}
		},
		// 展开子组件到根组件
		flatChindrenToSchema(componentId: string) {
			const component = this.findComponent(componentId);
			if (component) {
				const parent = this.findParent(componentId);
				if (parent) {
					let left = component.props.left ?? 0;
					let top = component.props.top ?? 0;
					const fn = (componentId: string) => {
						const parent = this.findParent(componentId);
						if (parent) {
							const index = parent.components.findIndex((v) => v.id === componentId);
							if (index !== -1) {
								if (!this.isSchema(parent) && parent.moveable) {
									left += parent.props.left;
									top += parent.props.top;
								}
							}
						}
					};
					fn(componentId);
					this.components.push(
						...component.components.splice(0).map((v) => {
							if (v.moveable) {
								v.props.left += left;
								v.props.top += top;
							}
							return v;
						})
					);
				}
			}
		},
	},
});
