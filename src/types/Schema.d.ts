import type { Component, EmitEvent } from "./Component";
export interface SchemaProps {
	backgroundColor: string;
}
export interface Schema<Props = Record<string, string>> extends Omit<Component, "key" | "layout" | "props" | "active" | "nestable" | "locked" | "hidden"> {
	key: "schema";
	layout: {
		width: number;
		height: number;
	};
	props: Props;
}
