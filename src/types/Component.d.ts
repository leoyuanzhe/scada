export interface Component<Props = any> {
	id: string;
	name: string;
	title: string;
	active: boolean;
	nestable: boolean;
	locked: boolean;
	hidden: boolean;
	snap: { v: number[]; h: number[] };
	left: number;
	top: number;
	width: number;
	height: number;
	props: Props;
	children: Component[];
}
