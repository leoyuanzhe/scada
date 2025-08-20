import type { Component, ComponentWithLayout } from "./Component";

export interface Asset {
	id: string;
	title: string;
	cover: string;
	categories: string[];
	component: Component | ComponentWithLayout;
}
