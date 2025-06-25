import type { Component } from "./Component";

export interface Schema<Props = any> {
	key: "schema";
	layout: {
		width: number;
		height: number;
	};
	props: Props;
	state: Record<keyof Schema["stateExpression"], any>;
	propsExpression: Partial<Record<keyof Props, string>>;
	stateExpression: Record<string, string>;
	components: Component[];
}
