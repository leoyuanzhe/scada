import type { Material } from "@/types/Material";
import TextComponent from "./Text.vue";

export const Text: Material = {
	id: "text",
	name: "文本",
	cover: "",
	nestable: false,
	locked: false,
	hidden: false,
	snap: { v: [], h: [] },
	left: 0,
	top: 0,
	width: 0,
	height: 0,
	property: {
		text: "",
		color: "#ffffff",
	},
	render: (component) => {
		return <TextComponent component={component}>{component.text}</TextComponent>;
	},
};
