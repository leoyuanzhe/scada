import { defineStore } from "pinia";
import { useClient } from "./useClient";
import { useSchema } from "./useSchema";

type Command = {
	name: string;
	title: string;
	shortcutKey: string | null;
	execute: () => void;
};
export const useCommand = defineStore("command", {
	state() {
		return {
			commands: [] as Command[],
		};
	},
	actions: {
		init() {
			this.commands.push({
				name: "copy",
				title: "复制",
				shortcutKey: "ctrl+c",
				execute: () => {
					const clientStore = useClient();
					const schemaStore = useSchema();
					clientStore.copyComponents(schemaStore.activedFlatComponents);
				},
			});
			this.commands.push({
				name: "cut",
				title: "剪切",
				shortcutKey: "ctrl+x",
				execute: () => {
					const clientStore = useClient();
					const schemaStore = useSchema();
					clientStore.cutComponents(schemaStore.activedFlatComponents);
				},
			});
			this.commands.push({
				name: "paste",
				title: "粘贴",
				shortcutKey: "ctrl+v",
				execute: () => {
					const clientStore = useClient();
					clientStore.pasteComponents();
				},
			});
			this.commands.push({
				name: "delete",
				title: "删除",
				shortcutKey: "delete",
				execute: () => {
					const schemaStore = useSchema();
					schemaStore.activedFlatComponents.forEach((v) => schemaStore.deleteComponent(v));
				},
			});
			this.commands.push({
				name: "lock",
				title: "锁定",
				shortcutKey: "ctrl+l",
				execute: () => {
					const schemaStore = useSchema();
					if (schemaStore.activedFlatComponents.every((v) => v.locked)) schemaStore.activedFlatComponents.forEach((v) => schemaStore.unlockComponent(v));
					else schemaStore.activedFlatComponents.forEach((v) => schemaStore.lockComponent(v));
				},
			});
			this.commands.push({
				name: "hide",
				title: "隐藏",
				shortcutKey: "ctrl+h",
				execute: () => {
					const schemaStore = useSchema();
					if (schemaStore.activedFlatComponents.every((v) => v.hidden)) schemaStore.activedFlatComponents.forEach((v) => schemaStore.showComponent(v));
					else schemaStore.activedFlatComponents.forEach((v) => schemaStore.hideComponent(v));
				},
			});
		},
	},
});
