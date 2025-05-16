import type { Component } from "./Component";

export interface Material<Props = any> extends Component<Props> {
	render: (component: Component<Props>) => JSX.Element;
}
