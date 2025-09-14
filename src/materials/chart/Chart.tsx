import type { MaterialWithLayout } from "@/types/Material";
import { generateId } from "@/helpers/schema";
import { deepClone } from "@/utils/conversion";
import ChartComponent from "./Chart.vue";

const props = deepClone({});
export type ChartProps = typeof props;
export type ChartEmitKey = "click";
export const Chart = (): MaterialWithLayout<ChartProps, ChartEmitKey> => ({
	version: "0.0.1",
	id: generateId(),
	key: "chart",
	title: "图表",
	actived: false,
	nestable: false,
	locked: false,
	hidden: false,
	selectable: true,
	moveable: true,
	resizable: true,
	autoReplace: false,
	autoLayout: false,
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
		click: { executeType: "concurrent", timeout: 0, actionsName: [] },
		mounted: { executeType: "concurrent", timeout: 0, actionsName: [] },
		beforeUnmount: { executeType: "concurrent", timeout: 0, actionsName: [] },
	},
	customProps: [],
	customEmits: [],
	propsExpression: {},
	stateExpression: {},
	components: [],
	render: (component) => <ChartComponent component={component} />,
});
