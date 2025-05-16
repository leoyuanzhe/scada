export interface Component {
	id: string;
	name: string;
	cover: string;
	nestable: boolean;
	locked: boolean;
	hidden: boolean;
	snap: { v: number[]; h: number[] };
	left: number;
	top: number;
	width: number;
	height: number;
	property: {
		text: string;
		color: string;
	};
}
