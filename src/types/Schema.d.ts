import type { Component } from "./Component";

export interface Schema {
	canvas: {
		width: number;
		height: number;
		backgroundColor: string;
	};
	targetComponentId: string;
	components: Component[];
}
