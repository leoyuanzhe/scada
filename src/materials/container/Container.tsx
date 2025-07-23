import type { MaterialWithLayout } from "@/types/Material";
import ContainerComponent from "./Container.vue";
import { generateId } from "@/helpers/schema";
import { deepClone } from "@/utils/conversion";

const props = deepClone({
	backgroundColor: "#00000000",
});
export type ContainerProps = typeof props;
export const Container = (): MaterialWithLayout<ContainerProps> => ({
	version: "0.0.1",
	id: generateId(),
	key: "container",
	title: "容器",
	actived: false,
	nestable: true,
	locked: false,
	hidden: false,
	resizable: false,
	layout: {
		snap: { v: [], h: [] },
		left: 0,
		top: 0,
		width: 300,
		height: 300,
	},
	props,
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
