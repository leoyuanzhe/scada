import { defineStore } from "pinia";
import type { Component, ComponentWithLayout } from "@/types/Component";
import type { Schema } from "@/types/Schema";
import { initComponent } from "@/helpers/component";

interface SchemaProps {
	backgroundColor: string;
}

export const useSchema = defineStore("schema", {
	state() {
		return {
			key: "schema",
			layout: {
				width: 1920,
				height: 1080,
			},
			props: {
				backgroundColor: "#000000",
			},
			state: {},
			propsExpression: {},
			stateExpression: {},
			components: [] as Component[],
		} as Schema<SchemaProps>;
	},
	getters: {
		// 有布局属性的在根节点下的组件
		moveableComponents(): ComponentWithLayout[] {
			return this.components.filter((v) => v.layout) as ComponentWithLayout[];
		},
		// 所有可移动的在根节点下的未隐藏的未锁定的组件
		moveableVisibleUnlockedComponents(): ComponentWithLayout[] {
			return this.moveableComponents.filter((v) => !v.hidden && !v.locked);
		},
		// 激活的有布局属性的组件
		activeMoveableComponents(): ComponentWithLayout[] {
			return this.components.filter((v) => v.active && v.layout) as ComponentWithLayout[];
		},
		// 未激活的有布局属性的组件
		unactiveMoveableComponents(): ComponentWithLayout[] {
			return this.components.filter((v) => !v.active && v.layout) as ComponentWithLayout[];
		},
		// 所有组件
		flatComponents(): Component[] {
			return this.components.flatMap((v) => flat(v));
			function flat(component: Component): Component[] {
				return [component, ...component.components.flatMap(flat)];
			}
		},
		// 激活的所有组件
		activeFlatComponents(): Component[] {
			return this.flatComponents.filter((v) => v.active);
		},
	},
	actions: {
		// 初始化
		init() {
			initComponent(this.$state);
		},
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
		getOffsetFromSchema(component: Component): { left: number; top: number } {
			let left = component?.layout?.left ?? 0;
			let top = component?.layout?.top ?? 0;
			const fn = (component: Component) => {
				const parent = this.findParent(component.id);
				if (parent) {
					const index = parent.components.findIndex((v) => v.id === component.id);
					if (index !== -1) {
						if (!this.isSchema(parent) && parent.layout) {
							left += parent.layout.left;
							top += parent.layout.top;
							fn(parent);
						}
					}
				}
			};
			fn(component);
			return { left, top };
		},
		// 删除组件
		removeComponent(componentId: string) {
			const parent = this.findParent(componentId);
			if (parent) {
				const index = parent.components.findIndex((v) => v.id === componentId);
				if (index !== -1) {
					if (parent.components[index].layout) {
						const { left, top } = this.getOffsetFromSchema(parent.components[index]);
						const component = parent.components.splice(index, 1)[0];
						if (!this.isSchema(parent) && parent.layout) {
							let newLeft = parent.components.length > 0 ? Infinity : 0;
							let newTop = parent.components.length > 0 ? Infinity : 0;
							parent.components.forEach((v) => {
								newLeft = Math.min(newLeft, v.layout?.left ?? 0);
								newTop = Math.min(newTop, v.layout?.top ?? 0);
							});
							parent.layout.left += newLeft;
							parent.layout.top += newTop;
						}
						if (component.layout) {
							component.layout.left = left;
							component.layout.top = top;
						}
						return component;
					} else return parent.components.splice(index, 1)[0];
				}
			}
		},
		// 加入分组
		joinGroup(componentId: string, parentId: string) {
			if (componentId !== parentId) {
				const parent = this.findParent(componentId);
				const index = parent?.components.findIndex((item) => item.id === componentId);
				if (parent && index !== -1) {
					const newParent = this.findComponent(parentId);
					if (newParent?.nestable && newParent.layout) {
						const child = parent.components[index!];
						const newParentParent = this.findParent(parentId);
						if (newParentParent && !this.isSchema(newParentParent)) {
							// 新父组件仍然有父组件
							this.moveOut(child.id);
							this.moveOut(newParent.id);
							this.joinGroup(child.id, parentId);
							this.joinGroup(newParent.id, newParentParent.id);
						} else if (child.layout && newParent.layout) {
							if (child.layout.left <= newParent.layout.left) {
								newParent.components.forEach((component) => {
									if (component.layout) {
										component.layout.left += newParent.layout!.left - child.layout!.left;
									}
								});
								newParent.layout.left = child.layout.left;
								child.layout.left = 0;
							} else {
								child.layout.left = child.layout.left - newParent.layout.left;
							}
							if (child.layout.top <= newParent.layout.top) {
								newParent.components.forEach((component) => {
									if (component.layout) {
										component.layout.top += newParent.layout!.top - child.layout!.top;
									}
								});
								newParent.layout.top = child.layout.top;
								child.layout.top = 0;
							} else {
								child.layout.top = child.layout.top - newParent.layout.top;
							}
							newParent.components.push(this.removeComponent(child.id)!);
						}
					}
				}
			}
		},
		// 移出分组
		moveOut(componentId: string) {
			const parent = this.findParent(componentId);
			if (parent) {
				const child = this.findComponent(componentId);
				if (child) parent.components.push(child);
			}
		},
		// 展开子组件到根组件
		flatChindrenToSchema(componentId: string) {
			const component = this.findComponent(componentId);
			if (component) {
				const parent = this.findParent(componentId);
				if (parent) {
					const { left, top } = this.getOffsetFromSchema(component);
					this.components.push(
						...component.components.splice(0).map((v) => {
							if (v.layout) {
								v.layout.left += left;
								v.layout.top += top;
							}
							return v;
						})
					);
					this.removeComponent(componentId);
				}
			}
		},
	},
});
