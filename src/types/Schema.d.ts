import type { Action, Component, DataSource } from "./Component";

export interface Schema {
	title: string;
	currentRootId: string;
	targetComponentId: string;
	state: Record<keyof Schema["stateExpression"], any>;
	dataSources: DataSource[];
	actions: Action[];
	components: Component[];
	stateExpression: Record<string, string>;
}
