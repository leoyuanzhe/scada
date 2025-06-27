export type ComponentKey = "text" | "container";
type BasicAction = {
	name: string;
	handler: string;
};
// 无动作
export type NoneAction = BasicAction & {
	type: "none";
	params: {};
};
// 改变组件显示状态动作
export type ChangeVisibleAction = BasicAction & {
	type: "changeVisible";
	params: {
		targetComponentsId: string[];
		visible: "show" | "hide" | "toggle";
	};
};
// 改变组件属性动作
export type ChangePropAction = BasicAction & {
	type: "changeProp";
	params: {
		targetComponentId: string;
		key: string;
		newValue: string;
	};
};
// 改变组件状态动作
export type ChangeStateAction = BasicAction & {
	type: "changeState";
	params: {
		targetComponentId: string;
		key: string;
		newValue: any;
	};
};
// 触发其它动作
export type TriggerOtherAction = BasicAction & {
	type: "triggerOther";
	params: {
		targetComponentId: string;
		name: string;
	};
};
export type Action = NoneAction | ChangeVisibleAction | ChangePropAction | ChangeStateAction | TriggerOtherAction;
export type EmitEvent = {
	executeType: "sequential" | "concurrent";
	actions: string[];
};
export interface Component<Props = any> {
	version: string;
	id: string;
	key: ComponentKey;
	title: string;
	active: boolean;
	nestable: boolean;
	locked: boolean;
	hidden: boolean;
	layout?: {
		resizable: boolean;
		snap: { v: number[]; h: number[] };
		left: number;
		top: number;
		width: number;
		height: number;
	};
	props: Props;
	state: Record<keyof Component["stateExpression"], any>;
	actions: Action[];
	emits: Record<string, EmitEvent[]>;
	lifecycle: {
		mounted: EmitEvent[];
		beforeUnmount: EmitEvent[];
	};
	components: Component[];
	propsExpression: Partial<Record<keyof Props, string>>;
	stateExpression: Record<string, string>;
}
export interface ComponentWithLayout<Props = any> extends Omit<Component<Props>, "layout"> {
	layout: NonNullable<Component["layout"]>;
}
