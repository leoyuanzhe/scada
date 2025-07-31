import { defineStore } from "pinia";
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import { useClient } from "./useClient";
import { useSchema } from "./useSchema";
import { useUndoStack } from "./useUndoStack";
import { useDragger } from "@/hooks/useDragger";
import { deepClone } from "@/utils/conversion";

export const useCommand = defineStore("command", {
	state() {
		return {};
	},
	actions: {
		createRootComponent(component: Component) {
			const schemaStore = useSchema();
			const dragger = useDragger();
			const oldSchema = deepClone(schemaStore.$state);
			schemaStore.deactivateAllComponent();
			const tempComponent = schemaStore.createRootComponent(component);
			dragger.computedSelector();
			schemaStore.recordStack(oldSchema);
			return tempComponent;
		},
		createComponent(component: Component, parent?: Component) {
			const schemaStore = useSchema();
			const dragger = useDragger();
			const oldSchema = deepClone(schemaStore.$state);
			schemaStore.deactivateAllComponent();
			const tempComponent = schemaStore.createComponent(component, parent);
			tempComponent.actived = true;
			schemaStore.targetComponentId = tempComponent.id;
			dragger.computedSelector();
			schemaStore.recordStack(oldSchema);
		},
		moveUp() {
			const schemaStore = useSchema();
			const dragger = useDragger();
			schemaStore.activedMoveableFlatedComponents.forEach((v) => v.layout.top--);
			dragger.computedSelector();
		},
		moveDown() {
			const schemaStore = useSchema();
			const dragger = useDragger();
			schemaStore.activedMoveableFlatedComponents.forEach((v) => v.layout.top++);
			dragger.computedSelector();
		},
		moveLeft() {
			const schemaStore = useSchema();
			const dragger = useDragger();
			schemaStore.activedMoveableFlatedComponents.forEach((v) => v.layout.left--);
			dragger.computedSelector();
		},
		moveRight() {
			const schemaStore = useSchema();
			const dragger = useDragger();
			schemaStore.activedMoveableFlatedComponents.forEach((v) => v.layout.left++);
			dragger.computedSelector();
		},
		// 导出
		async export() {
			try {
				const schemaStore = useSchema();
				const clonedSchema = deepClone(schemaStore.$state as Schema);
				schemaStore.clearComponent(clonedSchema);
				const json = JSON.stringify(clonedSchema);
				const blob = new Blob([json], { type: "application/json" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = clonedSchema.title + ".json";
				a.click();
				URL.revokeObjectURL(url);
			} catch (error: any) {
				throw new Error(error);
			}
		},
		// 导入
		import() {
			const schemaStore = useSchema();
			const input = document.createElement("input");
			input.type = "file";
			input.accept = ".json";
			input.onchange = (e: any) => {
				const file = e.target.files[0];
				const reader = new FileReader();
				reader.onload = () => {
					try {
						const oldSchema = deepClone(schemaStore.$state);
						const json = JSON.parse(reader.result as string);
						schemaStore.setSchema(json);
						schemaStore.recordStack(oldSchema);
					} catch (error: any) {
						throw new Error(error);
					}
				};
				reader.readAsText(file);
			};
			input.click();
		},
		// 保存
		save() {
			const schemaStore = useSchema();
			const clonedSchema = deepClone(schemaStore.$state as Schema);
			schemaStore.clearComponent(clonedSchema);
			const json = JSON.stringify(clonedSchema);
			localStorage.setItem("schema", json);
		},
		// 预览
		preview() {
			const schemaStore = useSchema();
			const clonedSchema = deepClone(schemaStore.$state as Schema);
			schemaStore.clearComponent(clonedSchema);
			const json = JSON.stringify(clonedSchema);
			localStorage.setItem("schema", json);
			window.open("/preview", "_blank");
		},
		// 切换触发操作
		toggleOperate(enabled?: boolean) {
			const clientStore = useClient();
			if (enabled) clientStore.enableOperate();
			else if (enabled === false) clientStore.disableOperate();
			else clientStore.enabledOperate ? clientStore.disableOperate() : clientStore.enableOperate();
		},
		// 切换标尺
		toggleRuler(enabled?: boolean) {
			const clientStore = useClient();
			if (enabled) clientStore.ruler.show = true;
			else if (enabled === false) clientStore.ruler.show = false;
			else clientStore.ruler.show ? (clientStore.ruler.show = false) : (clientStore.ruler.show = true);
		},
		// 切换参考线
		toggleGuide(enabled?: boolean) {
			const clientStore = useClient();
			if (enabled) clientStore.guide.enable;
			else if (enabled === false) clientStore.guide.enable = false;
			else clientStore.guide.enable ? (clientStore.guide.enable = false) : (clientStore.guide.enable = true);
		},
		// 切换网格
		toggleGrid(enabled?: boolean) {
			const clientStore = useClient();
			if (enabled) clientStore.grid.enable = true;
			else if (enabled === false) clientStore.grid.enable = false;
			else clientStore.grid.enable ? (clientStore.grid.enable = false) : (clientStore.grid.enable = true);
		},
		// 切换吸附
		toggleSnap(enabled?: boolean) {
			const clientStore = useClient();
			if (enabled) clientStore.snap.enable = true;
			else if (enabled === false) clientStore.snap.enable = false;
			else clientStore.snap.enable ? (clientStore.snap.enable = false) : (clientStore.snap.enable = true);
		},
		// 撤销
		undo() {
			const undoStackStore = useUndoStack();
			undoStackStore.undo();
		},
		// 重做
		redo() {
			const undoStackStore = useUndoStack();
			undoStackStore.redo();
		},
		// 复制
		copy() {
			const clientStore = useClient();
			const schemaStore = useSchema();
			clientStore.copyComponents(schemaStore.activedFlatedComponents);
		},
		// 剪切
		cut() {
			const clientStore = useClient();
			const schemaStore = useSchema();
			const dragger = useDragger();
			const oldSchema = deepClone(schemaStore.$state);
			clientStore.cutComponents(schemaStore.activedFlatedComponents);
			schemaStore.targetComponentId = "";
			dragger.computedSelector();
			schemaStore.recordStack(oldSchema);
		},
		// 粘贴
		paste() {
			const clientStore = useClient();
			const schemaStore = useSchema();
			const dragger = useDragger();
			const oldSchema = deepClone(schemaStore.$state);
			const components = clientStore.pasteComponents(schemaStore.targetComponent);
			schemaStore.deactivateAllComponent();
			components?.forEach((v) => (v.actived = true));
			schemaStore.targetComponentId = "";
			dragger.computedSelector();
			schemaStore.recordStack(oldSchema);
		},
		// 删除
		delete() {
			const schemaStore = useSchema();
			const dragger = useDragger();
			const oldSchema = deepClone(schemaStore.$state);
			schemaStore.activedFlatedComponents.forEach((v) => schemaStore.deleteComponent(v.id));
			dragger.computedSelector();
			schemaStore.recordStack(oldSchema);
		},
		// 切换锁定
		toggleLocked(locked?: boolean) {
			const schemaStore = useSchema();
			const dragger = useDragger();
			const oldSchema = deepClone(schemaStore.$state);
			if (locked) lock();
			else if (locked === false) unlock();
			else {
				if (schemaStore.activedFlatedComponents.every((v) => v.locked)) unlock();
				else lock();
			}
			schemaStore.recordStack(oldSchema);
			function lock() {
				schemaStore.activedFlatedComponents.forEach((v) => (v.locked = true));
				schemaStore.deactivateAllComponent();
				schemaStore.targetComponentId = "";
				dragger.computedSelector();
			}
			function unlock() {
				schemaStore.activedFlatedComponents.forEach((v) => (v.locked = false));
			}
		},
		// 切换隐藏
		toggleHidden(hidden?: boolean) {
			const schemaStore = useSchema();
			const dragger = useDragger();
			const oldSchema = deepClone(schemaStore.$state);
			if (hidden) hide();
			else if (hidden === false) show();
			else {
				if (schemaStore.activedFlatedComponents.every((v) => v.hidden)) show();
				else hide();
			}
			schemaStore.recordStack(oldSchema);
			function hide() {
				schemaStore.activedFlatedComponents.forEach((v) => (v.hidden = true));
				schemaStore.deactivateAllComponent();
				schemaStore.targetComponentId = "";
				dragger.computedSelector();
			}
			function show() {
				schemaStore.activedFlatedComponents.forEach((v) => (v.hidden = false));
			}
		},
		// 创建分组
		createGroup() {
			const schemaStore = useSchema();
			const dragger = useDragger();
			const oldSchema = deepClone(schemaStore.$state);
			const container = schemaStore.createGroup(schemaStore.activedFlatedComponents.map((v) => v.id));
			if (container) {
				schemaStore.deactivateAllComponent();
				container.actived = true;
				schemaStore.targetComponentId = container.id;
				dragger.computedSelector();
				schemaStore.recordStack(oldSchema);
			}
		},
		// 移出分组
		moveOut() {
			const schemaStore = useSchema();
			const oldSchema = deepClone(schemaStore.$state);
			schemaStore.activedFlatedComponents.forEach((v) => schemaStore.moveOut(v));
			schemaStore.recordStack(oldSchema);
		},
		// 加入分组
		joinGroup(componentId: string, newParentId: string) {
			const schemaStore = useSchema();
			const dragger = useDragger();
			const oldSchema = deepClone(schemaStore.$state);
			const newParent = schemaStore.findComponent(newParentId);
			const component = schemaStore.findComponent(componentId);
			if (newParent && component) {
				schemaStore.joinGroup(component, newParent);
				newParent.actived = true;
				schemaStore.targetComponentId = newParent.id;
				dragger.computedSelector();
				schemaStore.recordStack(oldSchema);
			}
		},
		// 插入到组件之前
		insertBefore(componentId: string, targetId: string) {
			const schemaStore = useSchema();
			const oldSchema = deepClone(schemaStore.$state);
			const component = schemaStore.findComponent(componentId);
			if (component) {
				schemaStore.insertBefore(component, targetId);
				schemaStore.recordStack(oldSchema);
			}
		},
		// 插入到组件之后
		insertAfter(componentId: string, targetId: string) {
			const schemaStore = useSchema();
			const oldSchema = deepClone(schemaStore.$state);
			const component = schemaStore.findComponent(componentId);
			if (component) {
				schemaStore.insertAfter(component, targetId);
				schemaStore.recordStack(oldSchema);
			}
		},
		// 展开子组件到父组件
		flatChildrenToParent() {
			const schemaStore = useSchema();
			const dragger = useDragger();
			const oldSchema = deepClone(schemaStore.$state);
			schemaStore.activedFlatedComponents.forEach((component) => {
				component.components.forEach((component) => (component.actived = true));
				schemaStore.flatChildrenToParent(component.id);
			});
			dragger.computedSelector();
			schemaStore.recordStack(oldSchema);
		},
	},
});
