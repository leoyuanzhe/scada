import type { Action, Component } from "./Component";

export interface Schema {
	title: string;
	state: Record<keyof Schema["stateExpression"], any>;
	actions: Action[];
	current: string;
	components: Component[];
	stateExpression: Record<string, string>;
}
