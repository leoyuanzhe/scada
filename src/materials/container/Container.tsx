import type { MaterialWithLayout } from "@/types/Material";
import ContainerComponent from "./Container.vue";

export interface ContainerProps {}
export const Container = (): MaterialWithLayout<ContainerProps> => ({
	version: "0.0.1",
	id: "container",
	key: "container",
	title: "容器",
	actived: false,
	nestable: true,
	locked: false,
	hidden: false,
	layout: {
		resizable: false,
		snap: { v: [], h: [] },
		left: 0,
		top: 0,
		width: 300,
		height: 300,
	},
	props: {},
	state: {},
	actions: [],
	emits: {
		mounted: { executeType: "concurrent", actionsName: [] },
		beforeUnmount: { executeType: "concurrent", actionsName: [] },
	},
	propsExpression: {},
	stateExpression: {},
	components: [],
	render: (component) => {
		return <ContainerComponent component={component} />;
	},
});
