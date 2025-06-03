import type { Material } from "@/types/Material";
import ContainerComponent from "./Container.vue";

export interface ContainerProps {}
export const Container = (): Material<ContainerProps> => ({
	id: "container",
	key: "container",
	title: "容器",
	active: false,
	nestable: true,
	resizable: false,
	locked: false,
	hidden: false,
	snap: { v: [], h: [] },
	left: 0,
	top: 0,
	width: 300,
	height: 300,
	props: {},
	components: [],
	render: (component) => {
		return <ContainerComponent component={component} />;
	},
});
