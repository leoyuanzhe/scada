export interface Action {
	handler: string;
}

export type ComponentKey = "text" | "container";

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
	emits: Record<string, Action[]>;
	propsExpression: Partial<Record<keyof Props, string>>;
	stateExpression: Record<string, string>;
	components: Component[];
}
export interface ComponentWithLayout<Props = any> extends Omit<Component<Props>, "layout"> {
	layout: NonNullable<Component["layout"]>;
}
