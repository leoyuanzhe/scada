import { defineStore } from "pinia";
import type { Component, ComponentWithLayout } from "@/types/Component";
import type { Schema, SchemaProps } from "@/types/Schema";
import { generateComponetId, initComponent } from "@/helpers/component";
import { Container } from "@/materials/container/Container";

export const useSchema = defineStore("schema", {
	state() {
		return {
			version: "1.0.0",
			id: "schema",
			key: "schema",
			title: "大屏",
			layout: {
				width: 1920,
				height: 1080,
			},
			props: {
				backgroundColor: "#000000",
			},
			state: {},
			actions: [],
			emits: {
				mounted: { executeType: "concurrent", actionsName: [] },
				beforeUnmount: { executeType: "concurrent", actionsName: [] },
			},
			components: [] as Component[],
			propsExpression: {},
			stateExpression: {},
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
		activedMoveableComponents(): ComponentWithLayout[] {
			return this.components.filter((v) => v.actived && v.layout) as ComponentWithLayout[];
		},
		// 未激活的有布局属性的组件
		unactivedMoveableComponents(): ComponentWithLayout[] {
			return this.components.filter((v) => !v.actived && v.layout) as ComponentWithLayout[];
		},
		// 所有组件
		flatedComponents(): Component[] {
			return this.components.flatMap(flat);
			function flat(component: Component): Component[] {
				return [component, ...component.components.flatMap(flat)];
			}
		},
		// 激活的所有组件
		activedFlatedComponents(): Component[] {
			return this.flatedComponents.filter((v) => v.actived);
		},
	},
	actions: {
		// 初始化
		init() {
			initComponent(this.$state);
		},
		// 找到组件
		findComponent(componentId: string) {
			return [this.$state, ...this.flatedComponents].find((v) => v.id === componentId) || null;
		},
		// 找到组件的父元素
		findParent(componentId: string) {
			const findInComponents = (
				components: Component[],
				parent: Schema | Component
			): Schema | Component | null => {
				for (const component of components) {
					if (component.id === componentId) return parent;
					if (component.components && component.components.length > 0) {
						const result = findInComponents(component.components, component);
						if (result) return result;
					}
				}
				return null;
			};
			return findInComponents(this.components, this.$state);
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
		addComponent(component: Component) {
			this.components.push(component);
		},
		createComponent<T extends Component>(component: T): T {
			component.id = generateComponetId();
			this.components.push(component);
			return component;
		},
		// 删除组件
		deleteComponent(component: Component) {
			const parent = this.findParent(component.id);
			if (parent) {
				const index = parent.components.findIndex((v) => v.id === component.id);
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
		// 创建分组
		createGroup(componentsId: string[]) {
			const container = this.createComponent(Container());
			container.layout.left = Infinity;
			container.layout.top = Infinity;
			componentsId.forEach((componentId) => {
				const component = this.findComponent(componentId);
				if (component && !this.isSchema(component)) {
					if (component.layout?.resizable) {
						container.layout.left = Math.min(component.layout.left, container.layout.left);
						container.layout.top = Math.min(component.layout.top, container.layout.top);
					}
				}
			});
			componentsId.forEach((componentId) => {
				this.joinGroup(componentId, container.id);
			});
			return container;
		},
		// 加入分组
		joinGroup(componentId: string, parentId: string) {
			if (componentId !== parentId) {
				const parent = this.findParent(componentId);
				const index = parent?.components.findIndex((item) => item.id === componentId);
				if (parent && index !== -1) {
					const newParent = this.findComponent(parentId);
					if (!this.isSchema(newParent) && newParent?.nestable && newParent.layout) {
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
							newParent.components.push(this.deleteComponent(child)!);
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
				if (child) {
					parent.components.push(child as Component);
					if (!this.isSchema(parent) && parent.components.length === 0) this.deleteComponent(parent);
				}
			}
		},
		// 展开子组件到根组件
		flatChildrenToSchema(componentId: string) {
			const component = this.findComponent(componentId);
			if (component && !this.isSchema(component)) {
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
					if (!this.isSchema(parent) && parent.components.length === 0) this.deleteComponent(parent);
				}
			}
		},
		// 锁定组件
		lockComponent(component: Component) {
			component.locked = true;
		},
		// 解锁组件
		unlockComponent(component: Component) {
			component.locked = false;
		},
		// 显示组件
		showComponent(component: Component) {
			component.hidden = false;
		},
		// 隐藏组件
		hideComponent(component: Component) {
			component.hidden = true;
		},
		// 激活组件
		activateComponent(component: Component) {
			component.actived = true;
		},
		// 取消激活组件
		deactivateComponent(component: Component) {
			component.actived = false;
		},
		// 取消激活所有组件
		deactivateAllComponent() {
			this.activedFlatedComponents.forEach((v) => this.deactivateComponent(v));
		},
	},
});
