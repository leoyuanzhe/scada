import type { MaterialWithLayout } from "@/types/Material";
import { generateId } from "@/helpers/schema";
import { deepClone } from "@/utils/conversion";
import PageComponent from "./Page.vue";

const props = deepClone({
	backgroundColor: "#000000",
});
export type PageProps = typeof props;
export const Page = (): MaterialWithLayout<PageProps> => ({
	version: "0.0.1",
	id: generateId(),
	key: "page",
	title: "页面",
	actived: false,
	nestable: true,
	locked: false,
	hidden: false,
	selectable: true,
	moveable: false,
	resizable: false,
	autoReplace: false,
	autoLayout: false,
	layout: {
		snap: { v: [], h: [] },
		left: 0,
		top: 0,
		width: 1920,
		height: 1080,
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
	render: (component) => <PageComponent component={component} />,
});
