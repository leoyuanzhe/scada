export type DataSourceMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
export type DataSourceBodyType = "none" | "form-data" | "x-www-form-urlencoded" | "raw";
export type DataSourceBodyRowType = "Text" | "JavaScript" | "JSON" | "HTML" | "XML";
export type DataSourceParam = { key: string; value: string };
export type DataSource = {
	name: string;
	autoRequest: boolean;
	url: RequestInfo | URL;
	method: DataSourceMethod;
	headers: DataSourceParam[];
	params: DataSourceParam[];
	body: {
		type: DataSourceBodyType;
		formDataParams: DataSourceParam[];
		xWwwFormUrlencodedParams: DataSourceParam[];
		rawType: "Text" | "JavaScript" | "JSON" | "HTML" | "XML";
		rawContent: string;
	};
	response: {
		type: "none" | "Text" | "JSON" | "Blob" | "ArrayBuffer" | "FormData";
		status: number | null;
		statusText: string | null;
		headers: Headers | null;
		data: any;
	};
	beforeHandler: string;
	afterHandler: string;
};
export type Action = {
	name: string;
	type: "none" | "changeVisible" | "changeProp" | "changeState" | "triggerOtherAction";
	// 改变组件显示状态动作
	changeVisibleParams: {
		targetComponentsId: string[];
		visible: "show" | "hide" | "toggle";
	};
	// 改变组件属性动作
	changePropParams: {
		targetComponentId: string;
		key: string;
		expression: string;
	};
	// 改变组件状态动作
	changeStateParams: {
		targetComponentId: string;
		key: string;
		expression: any;
	};
	// 触发其它动作
	triggerOtherActionParams: {
		targetComponentId: string;
		name: string;
	};
	beforeHandler: string;
	afterHandler: string;
};
export type EmitEvent = {
	executeType: "sequential" | "concurrent";
	timeout: number;
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
