import type { ComponentKey } from "./ComponentKey";

export type Watcher = {
	name: string;
	sourceHandler: string;
	executeType: "sequential" | "concurrent";
	timeout: number;
	deep: boolean;
	immediate: boolean;
	actionsName: string[];
};
export type DataSourceRequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
export type DataSourceRequestBodyType = "none" | "form-data" | "x-www-form-urlencoded" | "raw";
export type DataSourceRequestBodyRawType = "Text" | "JavaScript" | "JSON" | "HTML" | "XML";
export type DataSourceRequestParam = { key: string; value: string };
export type DataSourceResponseType = "none" | "Text" | "JSON" | "Blob" | "ArrayBuffer" | "FormData";
export type DataSource = {
	name: string;
	autoRequest: boolean;
	responseType: DataSourceResponseType;
	request: {
		url: RequestInfo | URL;
		method: DataSourceMethod;
		headers: DataSourceParam[];
		params: DataSourceParam[];
		body: {
			type: DataSourceBodyType;
			formDataParams: DataSourceParam[];
			xWwwFormUrlencodedParams: DataSourceParam[];
			rawType: DataSourceRequestBodyRawType;
			rawContent: string;
		};
	};
	response: {
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
	type: "none" | "changeVisible" | "changeProp" | "changeState" | "requestDataSource" | "triggerOtherAction";
	// 改变组件显示状态
	changeVisibleParams: {
		targetComponentsId: string[];
		visible: "show" | "hide" | "toggle";
	};
	// 改变组件属性
	changePropParams: {
		targetComponentId: string;
		key: string;
		expression: string;
	};
	// 改变组件状态
	changeStateParams: {
		targetComponentId: string;
		key: string;
		expression: any;
	};
	// 请求数据源
	requestDataSourceParams: {
		targetComponentId: string;
		name: string;
	};
	// 触发其它
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
	key: ComponentKey;
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
	watchers: Watcher[];
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
