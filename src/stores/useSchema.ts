import { useRoute } from "vue-router";
import { defineStore } from "pinia";
import type { Component, ComponentWithLayout } from "@/types/Component";
import type { Schema } from "@/types/Schema";
import { useUndoStack } from "./useUndoStack";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import { initState } from "@/helpers/schema";
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
			dataSources: [],
			actions: [],
			components: [],
			stateExpression: {},
		} as Schema;
	},
	getters: {
		// 目标组件
		targetComponent(): Component | null {
			return this.flatedComponents.find((item) => item.id === this.targetComponentId) ?? null;
		},
		// 当前组件
		currentComponent(): Component | null {
			return this.components.find((v) => v.id === this.current) ?? null;
		},
		// 所有组件（不包括根组件）
		flatedComponents(): Component[] {
			return this.currentComponent?.components.flatMap(flat) ?? [];
			function flat(component: Component): Component[] {
				return [component, ...component.components.flatMap(flat)];
			}
		},
		// 有布局属性的在根节点下的组件
		moveableComponents(): ComponentWithLayout[] {
			return (this.currentComponent?.components.filter((v) => v.layout) as ComponentWithLayout[]) ?? [];
		},
		// 所有可移动的下的未隐藏的未锁定的根组件下的组件
		moveableVisibleUnlockedComponents(): ComponentWithLayout[] {
			return this.moveableComponents.filter((v) => !v.hidden && !v.locked);
		},
		// 激活的有布局属性的所有的组件
		activedMoveableFlatedComponents(): ComponentWithLayout[] {
			return (this.flatedComponents.filter((v) => v.actived && v.layout) as ComponentWithLayout[]) ?? [];
		},
		// 未激活的有布局属性的所有的组件
		unactivedMoveableFlatedComponents(): ComponentWithLayout[] {
			return (this.flatedComponents.filter((v) => !v.actived && v.layout) as ComponentWithLayout[]) ?? [];
		},
		// 激活的所有组件
		activedFlatedComponents(): Component[] {
			return this.flatedComponents.filter((v) => v.actived);
		},
	},
	actions: {
		// 初始化
		init() {
			const route = useRoute();
			if (route.query.id) {
				this.current = route.query.id as string;
			}
			initState.call(this.$state);
		},
		isRoot(componentId: string) {
			return this.currentComponent?.id === componentId;
		},
		isContains(parent: Component, componentId: string) {
			return parent.components.flatMap(flat).some((v) => v.id === componentId);
			function flat(component: Component): Component[] {
				return [component, ...component.components.flatMap(flat)];
			}
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
						if (result.parent) return result;
					}
				}
				return { parent: null, index: -1, isRoot: false } as T;
			};
			return this.currentComponent
				? findInComponents(this.currentComponent, this.currentComponent.components, true)
				: ({ parent: null, index: -1, isRoot: false } as T);
		},
		// 找到组件的根组件
		findRoot(component: Component): Component {
			let { parent } = this.findParent(component.id);
			while (parent && !this.isRoot(parent.id)) {
				component = parent;
				parent = this.findParent(component.id).parent;
			}
			return parent || component;
		},
		// 创建根组件
		createRootComponent(component: Component) {
			component.id = generateId();
			this.components.push(component);
			return component;
		},
		// 创建组件
		createComponent<T extends Component>(component: T, parent?: Component | null): T {
			component.id = generateId();
			parent ? parent.components.push(component) : this.currentComponent?.components.push(component);
			return component;
		},
		// 创建分组
		createGroup(componentsId: string[]) {
			const parent = this.findParent(componentsId[0]).parent?.id ?? "";
			if (componentsId.length > 1 && componentsId.every((v) => this.findParent(v).parent?.id === parent)) {
				const container = this.createComponent(Container());
				container.layout.left = Infinity;
				container.layout.top = Infinity;
				container.layout.width = 0;
				container.layout.height = 0;
				componentsId.forEach((componentId) => {
					const component = this.findComponent(componentId);
					if (component && component.layout) {
						container.layout.left = Math.min(component.layout.left, container.layout.left);
						container.layout.top = Math.min(component.layout.top, container.layout.top);
						container.layout.width = Math.max(
							component.layout.left + component.layout.width,
							container.layout.width
						);
						container.layout.height = Math.max(
							component.layout.top + component.layout.height,
							container.layout.height
						);
						this.joinGroup(component, container);
					}
				});
				container.components.forEach((component) => {
					if (component.layout) {
						component.layout.left -= container.layout.left;
						component.layout.top -= container.layout.top;
					}
				});
				container.layout.width -= container.layout.left;
				container.layout.height -= container.layout.top;
				return container;
			}
			return null;
		},
		// 删除组件
		deleteComponent(componentId: string) {
			const dragger = useDragger();
			const { parent, index } = this.findParent(componentId);
			// 检查子组件，没有子组件就删除，有子组件适应位置
			const checkChildren = (component: Component) => {
				if (!this.isRoot(component.id)) {
					if (component.components.length === 0) {
						this.deleteComponent(component.id);
					}
					if (component.layout) {
						const moveableComponents = component.components.filter(
							(v) => v.layout
						) as ComponentWithLayout[];
						let parentLeft = Infinity;
						let parentTop = Infinity;
						let left = Infinity;
						let top = Infinity;
						let width = 0;
						let height = 0;
						moveableComponents.forEach((child) => {
							const { left: toParentParentLeft, top: toParentParentTop } =
								dragger.getOffsetFromParentParent(child);
							parentLeft = Math.min(toParentParentLeft, parentLeft);
							parentTop = Math.min(toParentParentTop, parentTop);
							left = Math.min(child.layout.left, left);
							top = Math.min(child.layout.top, top);
							width = Math.max(child.layout.left + child.layout.width, width);
							height = Math.max(child.layout.top + child.layout.height, height);
							component.layout!.width = Math.max(child.layout.left + child.layout.width, width);
							component.layout!.height = Math.max(child.layout.left + child.layout.height, height);
						});
						component.layout.left = parentLeft;
						component.layout.top = parentTop;
						moveableComponents.forEach((component) => {
							component.layout.left -= left;
							component.layout.top -= top;
						});
						component.layout.width -= left;
						component.layout.height -= top;
					}
				}
			};
			if (parent && index !== -1) {
				const component = parent.components.splice(index, 1)[0];
				checkChildren(parent);
				return component;
			}
		},
		// 加入分组
		joinGroup(component: Component, newParent: Component) {
			const schemaStore = useSchema();
			const dragger = useDragger();
			if (component.id !== newParent.id) {
				const { left: componentLeft, top: componentTop } = dragger.getOffsetFromRoot(component);
				this.deleteComponent(component.id);
				if (component.layout) {
					component.layout.left = componentLeft;
					component.layout.top = componentTop;
					const fn = (parent: Component) => {
						const { parent: parentParent, isRoot } = schemaStore.findParent(parent.id);
						if (parentParent) {
							if (!isRoot) fn(parentParent);
							if (parent.layout) {
								const { left: parentLeft, top: parentTop } = dragger.getOffsetFromRoot(parent);
								if (componentLeft < parentLeft) {
									const diff = parentLeft - componentLeft;
									parent.layout.left = componentLeft;
									parent.layout.width += diff;
									component.layout!.left = 0;
									parent.components.forEach((v) => v.layout && (v.layout.left += diff));
								} else component.layout!.left = componentLeft - parentLeft;
								if (componentTop < parentTop) {
									const diff = parentTop - componentTop;
									parent.layout.top = componentTop;
									component.layout!.top = 0;
									parent.components.forEach((v) => v.layout && (v.layout.top += diff));
								} else component.layout!.top = componentTop - parentTop;
								if (componentLeft + component.layout!.width > parentLeft + parent.layout.width) {
									parent.layout.width = component.layout!.left + component.layout!.width;
								}
								if (componentTop + component.layout!.height > parentTop + parent.layout.height) {
									parent.layout.height = component.layout!.top + component.layout!.height;
								}
							}
						}
					};
					fn(newParent);
				}
				newParent.components.push(component);
				dragger.computedSelector();
			}
		},
		// 插入到组件之前
		insertBefore(component: Component, targetId: string) {
			this.deleteComponent(component.id);
			if (this.isRoot(targetId)) {
				const index = this.components.findIndex((v) => v.id === targetId);
				if (index !== -1) this.components.splice(index, 0, component);
			} else {
				const { parent, index } = this.findParent(targetId);
				if (parent) parent.components.splice(index, 0, component);
			}
		},
		// 插入到组件之后
		insertAfter(component: Component, targetId: string) {
			this.deleteComponent(component.id);
			if (this.isRoot(targetId)) {
				const index = this.components.findIndex((v) => v.id === targetId);
				if (index !== -1) this.components.splice(index + 1, 0, component);
			} else {
				const { parent, index } = this.findParent(targetId);
				if (parent) parent.components.splice(index + 1, 0, component);
			}
		},
		// 移出分组
		moveOut(component: Component) {
			const { parent } = this.findParent(this.findParent(component.id).parent?.id || "");
			if (parent && this.findComponent(component.id)) {
				this.joinGroup(component!, parent);
			}
		},
		// 展开子组件到父组件
		flatChildrenToParent(componentId: string) {
			const dragger = useDragger();
			const component = this.findComponent(componentId);
			const { parent } = this.findParent(componentId);
			if (component && parent) {
				const { left, top } = dragger.getOffsetFromParentParent(component);
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
			const dragger = useDragger();
			const component = this.findComponent(componentId);
			if (component) {
				const { left, top } = dragger.getOffsetFromRoot(component);
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
