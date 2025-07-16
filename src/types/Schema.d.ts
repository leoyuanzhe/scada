import type { Action, Component } from "./Component";

export interface Schema {
	title: string;
	current: string;
	targetComponentId: string;
	state: Record<keyof Schema["stateExpression"], any>;
	actions: Action[];
	components: Component[];
	stateExpression: Record<string, string>;
}
