import type { Material } from "@/types/Material";
import { generateId } from "@/helpers/schema";
import { deepClone } from "@/utils/conversion";
import DialogComponent from "./Dialog.vue";

const props = deepClone({
	show: false,
});
export type DialogProps = typeof props;
export type DialogEmitKey = "click" | "dblclick";
export const Dialog = (): Material<DialogProps, DialogEmitKey> => ({
	version: "0.0.1",
	id: generateId(),
	key: "dialog",
	title: "对话框",
	actived: false,
	nestable: true,
	locked: false,
	hidden: false,
	selectable: true,
	moveable: false,
	resizable: false,
	autoReplace: false,
	autoLayout: false,
	props,
	state: {},
	watchers: [],
	dataSources: [],
	actions: [],
	emits: {
		click: { executeType: "concurrent", timeout: 0, actionsName: [] },
		dblclick: { executeType: "concurrent", timeout: 0, actionsName: [] },
		mounted: { executeType: "concurrent", timeout: 0, actionsName: [] },
		beforeUnmount: { executeType: "concurrent", timeout: 0, actionsName: [] },
	},
	customProps: [],
	customEmits: [],
	propsExpression: {},
	stateExpression: {},
	components: [],
	render: (component) => <DialogComponent component={component} />,
});
