import type { Material } from "@/types/Material";
import TextComponent from "./Text.vue";

export interface TextProps {
	text: string;
	color: string;
}
export const Text = (): Material<TextProps> => ({
	id: "text",
	name: "text",
	title: "文本",
	active: false,
	nestable: false,
	resizable: true,
	locked: false,
	hidden: false,
	snap: { v: [], h: [] },
	left: 0,
	top: 0,
	width: 100,
	height: 50,
	props: {
		text: "这是一段文本",
		color: "#ffffff",
	},
	children: [],
	render: (component) => {
		return <TextComponent component={component} />;
	},
});
