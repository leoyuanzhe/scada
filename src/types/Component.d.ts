export type DataSource = {
	name: string;
	url: RequestInfo | URL;
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
	params: Record<string, string>;
	headers: Record<string, string>;
	body: {
		type: "none" | "form-data" | "x-www-form-urlencoded" | "raw";
		contentType: "Text" | "JavaScript" | "JSON" | "HTML" | "XML";
		content: string;
	};
};
type BasicAction = {
	name: string;
	beforeHandler: string;
	afterHandler: string;
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
		expression: string;
	};
};
// 改变组件状态动作
export type ChangeStateAction = BasicAction & {
	type: "changeState";
	params: {
		targetComponentId: string;
		key: string;
		expression: any;
	};
};
// 触发其它动作
export type TriggerOtherAction = BasicAction & {
	type: "triggerOtherAction";
	params: {
		targetComponentId: string;
		name: string;
	};
};
export type Action = NoneAction | ChangeVisibleAction | ChangePropAction | ChangeStateAction | TriggerOtherAction;
export type EmitEvent = {
	executeType: "sequential" | "concurrent";
	actionsName: string[];
};
export interface Component<Props = Record<string, any>, EmitKey = string> {
	version: string;
	id: string;
	key: string;
	title: string;
	actived: boolean;
	nestable: boolean;
	locked: boolean;
	hidden: boolean;
	resizable: boolean;
	layout?: {
		snap: { v: number[]; h: number[] };
		left: number;
		top: number;
		width: number;
		height: number;
	};
	props: Props;
	state: Record<keyof Component["stateExpression"], any>;
	dataSources: DataSource[];
	actions: Action[];
	emits: Record<EmitKey | "mounted" | "beforeUnmount", EmitEvent>;
	components: Component[];
	propsExpression: Partial<Record<keyof Props, string>>;
	stateExpression: Record<string, string>;
}
export interface ComponentWithLayout<Props = Record<string, any>, EmitKey = string>
	extends Omit<Component<Props, EmitKey>, "layout"> {
	layout: NonNullable<Component["layout"]>;
}
