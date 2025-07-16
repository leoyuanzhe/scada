import { useRoute } from "vue-router";
import { defineStore } from "pinia";
import type { Component, ComponentWithLayout } from "@/types/Component";
import type { Schema } from "@/types/Schema";
import { useUndoStack } from "./useUndoStack";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import { initState } from "@/helpers/component";
import { generateId } from "@/utils/tool";
import { deepClone } from "@/utils/conversion";
import { Container } from "@/materials/container/Container";

export const useSchema = defineStore("schema", {
	state() {
		return {
			title: "大屏",
			current: "",
			targetComponentId: "",
			state: {},
			actions: [],
			components: [],
			stateExpression: {},
		} as Schema;
	},
	getters: {
		// 目标组件
		targetComponent(): Component | null {
			return this.components.find((item) => item.id === this.targetComponentId) ?? null;
		},
		// 当前组件
		currentComponent(): Component | null {
			return this.components.find((v) => v.id === this.current) ?? null;
		},
		// 有布局属性的在根节点下的组件
		moveableComponents(): ComponentWithLayout[] {
			return (this.currentComponent?.components.filter((v) => v.layout) as ComponentWithLayout[]) ?? [];
		},
		// 所有可移动的下的未隐藏的未锁定的根组件下的组件
		moveableVisibleUnlockedComponents(): ComponentWithLayout[] {
			return this.moveableComponents.filter((v) => !v.hidden && !v.locked);
		},
		// 激活的有布局属性的根组件下的组件
		activedMoveableComponents(): ComponentWithLayout[] {
			return (
				(this.currentComponent?.components.filter((v) => v.actived && v.layout) as ComponentWithLayout[]) ?? []
			);
		},
		// 未激活的有布局属性的所有的组件
		unactivedMoveableFlatedComponents(): ComponentWithLayout[] {
			return (this.flatedComponents.filter((v) => !v.actived && v.layout) as ComponentWithLayout[]) ?? [];
		},
		// 所有组件（不包括根组件）
		flatedComponents(): Component[] {
			return this.currentComponent?.components.flatMap(flat) ?? [];
			function flat(component: Component): Component[] {
				return [component, ...component.components.flatMap(flat)];
			}
		},
		// 激活的所有组件
		activedFlatedComponents(): Component[] {
			return this.flatedComponents.filter((v) => v.actived);
		},
		// 激活的有布局属性的所有组件
		activedMoveableFlatedComponents(): ComponentWithLayout[] {
			return this.flatedComponents.filter((v) => v.actived && v.layout) as ComponentWithLayout[];
		},
	},
	actions: {
		// 初始化
		init() {
			const route = useRoute();
			if (route.query.id) {
				this.current = route.query.id as string;
			}
			initState(this.$state);
		},
		isRoot(componentId: string) {
			return this.currentComponent?.id === componentId;
		},
		setSchema(schema: Schema) {
			this.$state = schema;
		},
		// 找到组件（包括根组件）
		findComponent(componentId: string) {
			return [this.currentComponent, ...this.flatedComponents].find((v) => v?.id === componentId) || null;
		},
		// 找到组件的父元素
		findParent<T extends { parent: Component | null; index: number; isRoot: boolean }>(componentId: string): T {
			const findInComponents = (parent: Component, components: Component[], isRoot: boolean): T => {
				for (let i = 0; i < components.length; i++) {
					const component = components[i];
					if (component.id === componentId) return { parent, index: i, isRoot } as T;
					if (component.components && component.components.length > 0) {
						const result = findInComponents(component, component.components, false);
						if (result) return result;
					}
				}
				return { parent: null, index: -1, isRoot: false } as T;
			};
			return this.currentComponent
				? findInComponents(this.currentComponent, this.currentComponent.components, true)
				: ({ parent: null, index: -1, isRoot: false } as T);
		},
		// 获取组件相对于父组件的父组件的偏移
		getOffsetFromParentParent(component: Component): { left: number; top: number } {
			let left = component?.layout?.left ?? 0;
			let top = component?.layout?.top ?? 0;
			const { parent } = this.findParent(component.id);
			if (parent?.layout) {
				left += parent.layout.left;
				top += parent.layout.top;
			}
			const { parent: parentParent } = this.findParent(component.id);
			if (parentParent?.layout) {
				left += parentParent.layout.left;
				top += parentParent.layout.top;
			}
			return { left, top };
		},
		// 获取组件相对于根组件的偏移
		getOffsetFromSchema(component: Component): { left: number; top: number } {
			let left = component?.layout?.left ?? 0;
			let top = component?.layout?.top ?? 0;
			const fn = (component: Component) => {
				const { parent } = this.findParent(component.id);
				if (parent && parent.layout) {
					left += parent.layout.left;
					top += parent.layout.top;
					fn(parent);
				}
			};
			fn(component);
			return { left, top };
		},
		createRootComponent(component: Component) {
			component.id = generateId();
			this.components.push(component);
			return component;
		},
		createComponent<T extends Component>(component: T, parent?: Component | null): T {
			component.id = generateId();
			parent ? parent.components.push(component) : this.currentComponent?.components.push(component);
			return component;
		},
		// 删除组件
		deleteComponent(componentId: string) {
			const { parent, index } = this.findParent(componentId);
			if (parent && index !== -1) {
				if (parent.components[index].layout) {
					const component = parent.components.splice(index, 1)[0];
					if (parent.layout) {
						const moveableComponents = parent.components.filter((v) => v.layout) as ComponentWithLayout[];
						if (moveableComponents.length) {
							let newLeft = moveableComponents[0].layout.left;
							let newTop = moveableComponents[0].layout.top;
							moveableComponents.forEach((v) => {
								newLeft = Math.min(newLeft, v.layout.left);
								newTop = Math.min(newTop, v.layout.top);
							});
							moveableComponents.forEach((v) => {
								v.layout.left -= newLeft;
								v.layout.top -= newTop;
							});
							parent.layout.left += newLeft;
							parent.layout.top += newTop;
						}
					}
					return component;
				} else return parent.components.splice(index, 1)[0];
			}
		},
		// 创建分组
		createGroup(componentsId: string[]) {
			const container = this.createComponent(Container());
			container.layout.left = Infinity;
			container.layout.top = Infinity;
			componentsId.forEach((componentId) => {
				const component = this.findComponent(componentId);
				if (component && component.layout) {
					container.layout.left = Math.min(component.layout.left, container.layout.left);
					container.layout.top = Math.min(component.layout.top, container.layout.top);
				}
			});
			componentsId.forEach((componentId) => this.joinGroup(componentId, container.id));
			return container;
		},
		// 加入分组
		joinGroup(componentId: string, parentId: string) {
			if (componentId !== parentId) {
				const { parent, index } = this.findParent(componentId);
				if (parent && index !== -1) {
					const newParent = this.findComponent(parentId);
					if (newParent?.nestable && newParent.layout) {
						const child = parent.components[index!];
						const { parent: newParentParent } = this.findParent(parentId);
						if (newParentParent) {
							// 新父组件仍然有父组件
							this.moveOut(child.id);
							this.moveOut(newParent.id);
							this.joinGroup(child.id, parentId);
							this.joinGroup(newParent.id, newParentParent.id);
						} else if (child.layout) {
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
							newParent.components.push(this.deleteComponent(child.id)!);
						}
					}
				}
			}
		},
		// 移出分组
		moveOut(componentId: string) {
			const { parent } = this.findParent(this.findParent(componentId).parent?.id || "");
			if (parent) {
				this.deleteComponent(componentId);
				this.joinGroup(componentId, parent.id);
			}
		},
		// 展开子组件到父组件
		flatChildrenToParent(componentId: string) {
			const component = this.findComponent(componentId);
			const { parent } = this.findParent(componentId);
			if (component && parent) {
				const { left, top } = this.getOffsetFromParentParent(component);
				parent.components.push(
					...component.components.splice(0).map((v) => {
						if (v.layout) {
							v.layout.left += left;
							v.layout.top += top;
						}
						return v;
					})
				);
				this.deleteComponent(component.id);
			}
		},
		// 展开子组件到根组件
		flatChildrenToSchema(componentId: string) {
			const component = this.findComponent(componentId);
			if (component) {
				const { left, top } = this.getOffsetFromSchema(component);
				this.currentComponent?.components.push(
					...component.components.splice(0).map((v) => {
						if (v.layout) {
							v.layout.left += left;
							v.layout.top += top;
						}
						return v;
					})
				);
				this.deleteComponent(component.id);
			}
		},
		// 取消激活所有组件
		deactivateAllComponent() {
			[this.currentComponent, ...this.activedFlatedComponents].forEach((v) => v?.actived && (v.actived = false));
			this.targetComponentId = "";
		},
		recordStack(oldSchema: Schema) {
			const undoStackStore = useUndoStack();
			const newSchema = deepClone(this.$state);
			const dragger = useDragger();
			undoStackStore.push({
				undo: () => {
					this.setSchema(oldSchema);
					dragger.computedSelector();
				},
				redo: () => {
					this.setSchema(newSchema);
					dragger.computedSelector();
				},
			});
		},
	},
});
