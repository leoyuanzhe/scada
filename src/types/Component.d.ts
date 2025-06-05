export interface Component<Props = any> {
	id: string;
	key: "text" | "container";
	title: string;
	active: boolean;
	moveable: boolean;
	resizable: boolean;
	nestable: boolean;
	locked: boolean;
	hidden: boolean;
	snap: { v: number[]; h: number[] };
	props: Props;
	components: Component[];
}
