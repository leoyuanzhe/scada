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
			targetComponentId: "",
			components: [] as Component[],
		};
	},
	getters: {
		targetComponent(): Component | null {
			if (this.activeFlatComponents.length == 0) {
				this.targetComponentId = "";
				return null;
			} else if (this.activeFlatComponents.length === 1) {
				this.targetComponentId = this.activeFlatComponents[0].id;
				return this.activeFlatComponents[0];
			} else if (this.targetComponentId) {
				return this.activeFlatComponents.find((v) => v.id === this.targetComponentId) || null;
			} else {
				this.targetComponentId = this.activeFlatComponents[this.activeFlatComponents.length - 1].id;
				return this.activeFlatComponents[this.activeFlatComponents.length - 1];
			}
		},
		activeComponents(): Component[] {
			return this.components.filter((v) => v.active);
		},
		activeFlatComponents(): Component[] {
			return this.flatComponents.filter((v) => v.active);
		},
		flatComponents(): Component[] {
			return this.components.flatMap((v) => flat(v));
			function flat(component: Component): Component[] {
				return [component, ...component.children.flatMap(flat)];
			}
		},
	},
	actions: {},
});
