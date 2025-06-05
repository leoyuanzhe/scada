import type { Material, MoveableProps } from "@/types/Material";
import ContainerComponent from "./Container.vue";

export interface ContainerProps extends MoveableProps {}
export const Container = (): Material<ContainerProps> => ({
	id: "container",
	key: "container",
	title: "容器",
	active: false,
	moveable: true,
	resizable: false,
	nestable: true,
	locked: false,
	hidden: false,
	snap: { v: [], h: [] },
	props: {
		left: 0,
		top: 0,
		width: 300,
		height: 300,
	},
	components: [],
	render: (component) => {
		return <ContainerComponent component={component} />;
	},
});
