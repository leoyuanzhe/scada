export interface Action {
	handler: string;
}
export interface Component<Props = any> {
	version: string;
	id: string;
	key: "text" | "container";
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
	emits: Record<string, Action[]>;
	expressions: Partial<Record<keyof Props, string>>;
	components: Component[];
}
export interface ComponentWithLayout<Props = any> extends Omit<Component<Props>, "layout"> {
	layout: NonNullable<Component["layout"]>;
}
