import type { MaterialWithLayout } from "@/types/Material";
import { generateId } from "@/helpers/schema";
import { deepClone } from "@/utils/conversion";
import TextComponent from "./Text.vue";

const props = deepClone({
	content: "文本",
	fontColor: "#ffffff",
	fontSize: 16,
	fontStyle: "normal" as "normal" | "italic",
	fontWeight: "normal" as "normal" | "bold",
	fontFamily: "serif" as "serif",
	textAlign: "center" as "left" | "center" | "right",
	textDecorationLine: "none" as "none" | "overline" | "underline" | "line-through",
	lineHeight: 30,
	backgroundColor: "transparent",
	borderWidth: 0,
	borderColor: "transparent",
	borderStyle: "solid" as "solid" | "dashed" | "dotted",
	borderRadius: 0,
});
export type TextProps = typeof props;
export type TextEmitKey = "click" | "dblclick";
export const Text = (): MaterialWithLayout<TextProps, TextEmitKey> => ({
	version: "0.0.1",
	id: generateId(),
	key: "text",
	title: "文本",
	actived: false,
	nestable: false,
	locked: false,
	hidden: false,
	resizable: true,
	autoLayout: false,
	layout: {
		snap: { v: [], h: [] },
		left: 0,
		top: 0,
		width: 100,
		height: 30,
	},
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
	render: (component) => <TextComponent component={component} />,
});
