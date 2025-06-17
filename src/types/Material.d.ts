import type { Component, ComponentWithLayout } from "./Component";

export interface Material<Props = any> extends Component<Props> {
	render: (component: Component<Props>) => JSX.Element;
}

export interface MaterialWithLayout<Props = any> extends ComponentWithLayout<Props> {
	render: (component: ComponentWithLayout<Props>) => JSX.Element;
}
