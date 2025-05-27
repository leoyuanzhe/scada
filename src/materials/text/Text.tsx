import type { Material } from "@/types/Material";
import TextComponent from "./Text.vue";

interface Props {
	text: string;
	color: string;
}
export interface Text extends Material<Props> {}
export const Text = (): Text => ({
	id: "text",
	name: "text",
	title: "文本",
	active: false,
	nestable: false,
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
		return <TextComponent component={component}>{component.props.text}</TextComponent>;
	},
});
