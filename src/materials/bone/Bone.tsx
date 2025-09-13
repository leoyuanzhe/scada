import type { MaterialWithLayout } from "@/types/Material";
import { generateId } from "@/helpers/schema";
import { deepClone } from "@/utils/conversion";
import BoneComponent from "./Bone.vue";

const props = deepClone({});
export type BoneProps = typeof props;
export const Bone = (): MaterialWithLayout<BoneProps> => ({
	version: "0.0.1",
	id: generateId(),
	key: "bone",
	title: "骨架",
	actived: false,
	nestable: true,
	locked: false,
	hidden: false,
	selectable: false,
	moveable: false,
	resizable: false,
	autoReplace: true,
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
	emits: {},
	propsExpression: {},
	stateExpression: {},
	customProps: [],
	customEmits: [],
	components: [],
	render: (component) => <BoneComponent component={component} />,
});
