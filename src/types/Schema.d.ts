import type { SchemaKey } from "./ComponentKey";
import type { Action, Component, DataSource, Watcher } from "./Component";

export interface Schema {
	id: "schema";
	key: SchemaKey;
	title: string;
	currentRootId: string;
	targetComponentId: string;
	state: Record<keyof Schema["stateExpression"], any>;
	watchers: Watcher[];
	dataSources: DataSource[];
	actions: Action[];
	components: Component[];
	stateExpression: Record<string, string>;
}
