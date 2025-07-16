import { defineStore } from "pinia";
import { useClient } from "./useClient";
import { useSchema } from "./useSchema";
import { useUndoStack } from "./useUndoStack";
import { useDragger } from "@/pages/editor/hooks/useDragger";

export const useCommand = defineStore("command", {
	state() {
		return {};
	},
	actions: {
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
			const schemaStore = useSchema();
			try {
				const json = JSON.stringify(schemaStore.$state);
				const blob = new Blob([json], { type: "application/json" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = schemaStore.title + ".json";
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
						const json = JSON.parse(reader.result as string);
						schemaStore.setSchema(json);
					} catch (error: any) {
						throw new Error(error);
					}
				};
				reader.readAsText(file);
			};
			input.click();
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
			clientStore.cutComponents(schemaStore.activedFlatedComponents);
			schemaStore.targetComponentId = "";
			dragger.computedSelector();
		},
		// 粘贴
		paste() {
			const clientStore = useClient();
			const schemaStore = useSchema();
			const dragger = useDragger();
			schemaStore.deactivateAllComponent();
			const components = clientStore.pasteComponents(schemaStore.targetComponent);
			components?.forEach((v) => (v.actived = true));
			schemaStore.targetComponentId = "";
			dragger.computedSelector();
		},
		// 删除
		delete() {
			const schemaStore = useSchema();
			const dragger = useDragger();
			schemaStore.activedFlatedComponents.forEach((v) => schemaStore.deleteComponent(v.id));
			dragger.computedSelector();
		},
		// 切换锁定
		toggleLocked(locked?: boolean) {
			const schemaStore = useSchema();
			const dragger = useDragger();
			if (locked) lock();
			else if (locked === false) unlock();
			else {
				if (schemaStore.activedFlatedComponents.every((v) => v.locked)) unlock();
				else lock();
			}
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
			if (hidden) hide();
			else if (hidden === false) show();
			else {
				if (schemaStore.activedFlatedComponents.every((v) => v.hidden)) show();
				else hide();
			}
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
			const container = schemaStore.createGroup(schemaStore.activedFlatedComponents.map((v) => v.id));
			schemaStore.deactivateAllComponent();
			schemaStore.targetComponentId = container.id;
			dragger.computedSelector();
		},
		// 展开子组件到父组件
		flatChildrenToParent() {
			const schemaStore = useSchema();
			const dragger = useDragger();
			schemaStore.activedFlatedComponents.forEach((component) => {
				component.components.forEach((component) => (component.actived = true));
				schemaStore.flatChildrenToParent(component.id);
			});
			dragger.computedSelector();
		},
	},
});
