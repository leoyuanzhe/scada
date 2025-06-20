import type { Component } from "./Component";

export interface Schema<Props = any> {
	key: "schema";
	layout: {
		width: number;
		height: number;
	};
	props: Props;
	state: Record<string, any>;
	propsExpression: Partial<Record<keyof Props, string>>;
	stateExpression: Partial<Record<keyof Schema["state"], string>>;
	components: Component[];
}
