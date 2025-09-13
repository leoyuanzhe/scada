import type { MaterialWithLayout } from "@/types/Material";
import { generateId } from "@/helpers/schema";
import { deepClone } from "@/utils/conversion";
import ContainerComponent from "./Container.vue";

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
	selectable: true,
	moveable: true,
	resizable: false,
	autoReplace: false,
	autoLayout: true,
	layout: {
		snap: { v: [], h: [] },
		left: 0,
		top: 0,
		width: 300,
		height: 300,
	},
	props,
	state: {},
	watchers: [],
	dataSources: [],
	actions: [],
	emits: {
		mounted: { executeType: "concurrent", timeout: 0, actionsName: [] },
		beforeUnmount: { executeType: "concurrent", timeout: 0, actionsName: [] },
	},
	propsExpression: {},
	stateExpression: {},
	customProps: [],
	customEmits: [],
	components: [],
	render: (component) => <ContainerComponent component={component} />,
});
