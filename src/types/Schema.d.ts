import type { Component } from "./Component";

export interface Schema {
	key: "schema";
	layout: {
		width: number;
		height: number;
	};
	props: {
		backgroundColor: string;
	};
	state: Record<string, any>;
	components: Component[];
}
