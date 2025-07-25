import type { MaterialWithLayout } from "@/types/Material";
import TextComponent from "./Text.vue";
import { generateId } from "@/helpers/schema";

export interface TextProps {
	text: string;
	color: string;
}
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
	layout: {
		snap: { v: [], h: [] },
		left: 0,
		top: 0,
		width: 100,
		height: 50,
	},
	props: {
		text: "文本",
		color: "#ffffff",
	},
	state: {},
	dataSources: [],
	actions: [],
	emits: {
		click: { executeType: "concurrent", actionsName: [] },
		dblclick: { executeType: "concurrent", actionsName: [] },
		mounted: { executeType: "concurrent", actionsName: [] },
		beforeUnmount: { executeType: "concurrent", actionsName: [] },
	},
	propsExpression: {},
	stateExpression: {},
	components: [],
	render: (component) => {
		return <TextComponent component={component} />;
	},
});
