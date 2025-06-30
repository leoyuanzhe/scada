import type { Component, ComponentWithLayout } from "./Component";

export interface Material<Props = any, EmitKey = string> extends Component<Props, EmitKey> {
	render: (component: Component<Props, EmitKey>) => JSX.Element;
}

export interface MaterialWithLayout<Props = any, EmitKey = string> extends ComponentWithLayout<Props, EmitKey> {
	render: (component: ComponentWithLayout<Props, EmitKey>) => JSX.Element;
}
