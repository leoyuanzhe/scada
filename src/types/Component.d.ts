export interface Component<Props = any> {
	id: string;
	key: "text" | "container";
	title: string;
	active: boolean;
	nestable: boolean;
	resizable: boolean;
	locked: boolean;
	hidden: boolean;
	snap: { v: number[]; h: number[] };
	left: number;
	top: number;
	width: number;
	height: number;
	props: Props;
	components: Component[];
}
