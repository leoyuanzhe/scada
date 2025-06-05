import type { Component } from "./Component";

export interface MoveableProps {
	left: number;
	top: number;
	width: number;
	height: number;
}
export interface Material<Props = any> extends Component<Props> {
	render: (component: Component<Props>) => JSX.Element;
}
