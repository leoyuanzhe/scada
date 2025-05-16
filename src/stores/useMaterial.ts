import { defineStore } from "pinia";
import type { Material } from "@/types/Material";
import { Text } from "@/materials/text/Text";

export const useMaterial = defineStore("material", {
	state() {
		return {
			materials: [] as Material[],
		};
	},
	actions: {
		init() {
			this.materials.length = 0;
			this.materials.push(Text());
		},
	},
});
