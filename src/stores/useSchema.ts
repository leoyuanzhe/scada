import type { Component } from "@/types/Component";
import { defineStore } from "pinia";

export const useSchema = defineStore("schema", {
	state() {
		return {
			canvas: {
				width: 1920,
				height: 1080,
				backgroundColor: "#000000",
			},
			components: [] as Component[],
		};
	},
	getters: {
		flattenedComponents() {
			return this.components.flatMap((component) => (component.children ? [component, ...component.children] : [component]));
		},
	},
	actions: {},
});
