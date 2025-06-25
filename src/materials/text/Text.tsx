import type { MaterialWithLayout } from "@/types/Material";
import TextComponent from "./Text.vue";

export interface TextProps {
	text: string;
	color: string;
}
export const Text = (): MaterialWithLayout<TextProps> => ({
	version: "0.0.1",
	id: "text",
	key: "text",
	title: "文本",
	active: false,
	nestable: false,
	locked: false,
	hidden: false,
	layout: {
		resizable: true,
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
	actions: [],
	emits: {
		created: [],
		click: [],
		dblclick: [],
	},
	lifecycle: {
		mounted: [],
		beforeUnmount: [],
	},
	propsExpression: {},
	stateExpression: {},
	components: [],
	render: (component) => {
		return <TextComponent component={component} />;
	},
});
