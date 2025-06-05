import type { Material, MoveableProps } from "@/types/Material";
import TextComponent from "./Text.vue";

export interface TextProps extends MoveableProps {
	text: string;
	color: string;
}
export const Text = (): Material<TextProps> => ({
	id: "text",
	key: "text",
	title: "文本",
	active: false,
	moveable: true,
	resizable: true,
	nestable: false,
	locked: false,
	hidden: false,
	snap: { v: [], h: [] },
	props: {
		left: 0,
		top: 0,
		width: 100,
		height: 50,
		text: "文本",
		color: "#ffffff",
	},
	components: [],
	render: (component) => {
		return <TextComponent component={component} />;
	},
});
