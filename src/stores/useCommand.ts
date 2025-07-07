import { defineStore } from "pinia";
import { useClient } from "./useClient";
import { useSchema } from "./useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { useDragger } from "@/pages/editor/hooks/useDragger";

export const useCommand = defineStore("command", {
	state() {
		return {};
	},
	actions: {
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
						schemaStore.$state = json;
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
		// TODO 显示/隐藏标尺 Ctrl/Cmd+R
		toggleRuler(enabled?: boolean) {
			const clientStore = useClient();
			if (enabled) clientStore.enableOperate();
			else if (enabled === false) clientStore.disableOperate();
			else clientStore.enabledOperate ? clientStore.disableOperate() : clientStore.enableOperate();
		},
		// TODO 显示/隐藏参考线 Ctrl/Cmd+;
		toggleGuide(enabled?: boolean) {
			const clientStore = useClient();
			if (enabled) clientStore.enableOperate();
			else if (enabled === false) clientStore.disableOperate();
			else clientStore.enabledOperate ? clientStore.disableOperate() : clientStore.enableOperate();
		},
		// TODO 切换网格 Ctrl/Cmd+'
		toggleGrid(enabled?: boolean) {
			const clientStore = useClient();
			if (enabled) clientStore.enableGrid();
			else if (enabled === false) clientStore.disableGrid();
			else clientStore.enabledOperate ? clientStore.disableGrid() : clientStore.enableGrid();
		},
		// TODO 切换吸附 Shift+Ctrl/Cmd+;
		toggleSnap(enabled?: boolean) {
			const clientStore = useClient();
			if (enabled) clientStore.enableSnap();
			else if (enabled === false) clientStore.disableSnap();
			else clientStore.enabledOperate ? clientStore.disableSnap() : clientStore.enableSnap();
		},
		// 复制
		copy() {
			const clientStore = useClient();
			const schemaStore = useSchema();
			clientStore.copyComponents(schemaStore.activedFlatedComponents);
		},
		cut() {
			const clientStore = useClient();
			const schemaStore = useSchema();
			const targetComponent = useTargetComponent();
			const dragger = useDragger();
			clientStore.cutComponents(schemaStore.activedFlatedComponents);
			targetComponent.componentId.value = "";
			dragger.computedSelector();
		},
		paste() {
			const clientStore = useClient();
			const schemaStore = useSchema();
			const targetComponent = useTargetComponent();
			const targetComponentId = targetComponent.componentId.value;
			const tempTargetComponent = schemaStore.findComponent(targetComponentId);
			const dragger = useDragger();
			schemaStore.deactivateAllComponent();
			const components = clientStore.pasteComponents(
				tempTargetComponent && !schemaStore.isSchema(tempTargetComponent) ? tempTargetComponent : null
			);
			components?.forEach((v) => schemaStore.activateComponent(v));
			targetComponent.componentId.value = "";
			dragger.computedSelector();
		},
		delete() {
			const schemaStore = useSchema();
			const dragger = useDragger();
			schemaStore.activedFlatedComponents.forEach((v) => schemaStore.deleteComponent(v));
			dragger.computedSelector();
		},
		toggleLocked(locked?: boolean) {
			const schemaStore = useSchema();
			const targetComponent = useTargetComponent();
			const dragger = useDragger();
			if (locked) lock();
			else if (locked === false) unlock();
			else {
				if (schemaStore.activedFlatedComponents.every((v) => v.locked)) unlock();
				else lock();
			}
			function lock() {
				schemaStore.activedFlatedComponents.forEach((v) => schemaStore.lockComponent(v));
				schemaStore.deactivateAllComponent();
				targetComponent.componentId.value = "";
				dragger.computedSelector();
			}
			function unlock() {
				schemaStore.activedFlatedComponents.forEach((v) => schemaStore.unlockComponent(v));
			}
		},
		toggleHidden(hidden?: boolean) {
			const schemaStore = useSchema();
			const targetComponent = useTargetComponent();
			const dragger = useDragger();
			if (hidden) hide();
			else if (hidden === false) show();
			else {
				if (schemaStore.activedFlatedComponents.every((v) => v.hidden)) show();
				else hide();
			}
			function hide() {
				schemaStore.activedFlatedComponents.forEach((v) => schemaStore.hideComponent(v));
				targetComponent.componentId.value = "";
				dragger.computedSelector();
			}
			function show() {
				schemaStore.activedFlatedComponents.forEach((v) => schemaStore.showComponent(v));
			}
		},
		createGroup() {
			const schemaStore = useSchema();
			const targetComponent = useTargetComponent();
			const dragger = useDragger();
			const container = schemaStore.createGroup(schemaStore.activedFlatedComponents.map((v) => v.id));
			schemaStore.deactivateAllComponent();
			targetComponent.componentId.value = container.id;
			dragger.computedSelector();
		},
		flatChildrenToSchema() {
			const schemaStore = useSchema();
			schemaStore.activedFlatedComponents.forEach((v) => schemaStore.flatChindrenToSchema(v.id));
		},
	},
});
