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
			schemaStore.activedFlatedComponents.forEach((v) => schemaStore.deactivateComponent(v));
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
		lock(locked?: boolean) {
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
				schemaStore.activedFlatedComponents.forEach((v) => schemaStore.deactivateComponent(v));
				targetComponent.componentId.value = "";
				dragger.computedSelector();
			}
			function unlock() {
				schemaStore.activedFlatedComponents.forEach((v) => schemaStore.unlockComponent(v));
			}
		},
		hide(hidden?: boolean) {
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
	},
});
