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
		flattenedComponents(): Component[] {
			return this.components.filter((v) => v.active);
		},
	},
	actions: {},
});
