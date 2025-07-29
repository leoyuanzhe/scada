import type { SchemaKey } from "./ComponentKey";
import type { Action, Component, DataSource } from "./Component";

export interface Schema {
	key: SchemaKey;
	title: string;
	currentRootId: string;
	targetComponentId: string;
	state: Record<keyof Schema["stateExpression"], any>;
	dataSources: DataSource[];
	actions: Action[];
	components: Component[];
	stateExpression: Record<string, string>;
}
