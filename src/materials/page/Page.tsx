import type { Material } from "@/types/Material";
import PageComponent from "./Page.vue";

export interface PageProps {
	backgroundColor: string;
}
export const Page = (): Material<PageProps> => ({
	version: "0.0.1",
	id: "page",
	key: "page",
	title: "页面",
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
	props: {
		backgroundColor: "#ffffff",
	},
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
		return <PageComponent component={component} />;
	},
});
