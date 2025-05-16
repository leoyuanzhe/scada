import type { Component } from "./Component";

export interface Material extends Component {
	render: (component) => JSX.Element;
}
