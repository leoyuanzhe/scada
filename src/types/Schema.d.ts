import type { Component } from "./Component";

export interface Schema {
	key: "schema";
	props: {
		width: number;
		height: number;
		backgroundColor: string;
	};
	state: Record<string, any>;
	components: Component[];
}
