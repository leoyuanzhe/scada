import type { Component } from "./Component";

export interface Schema {
	key: "schema";
	props: {
		width: number;
		height: number;
		backgroundColor: string;
	};
	components: Component[];
}
