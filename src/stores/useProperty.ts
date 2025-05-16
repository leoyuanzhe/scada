import { defineStore } from "pinia";
import type { Material } from "@/types/Material";
import { Text } from "@/materials/text/Text";

export const useProperty = defineStore("property", {
	state() {
		return {
			properties: [] as { id: string; title: string; cover: string; material: Material }[],
		};
	},
	actions: {
		init() {
			this.properties.length = 0;
			this.properties.push({
				id: "text",
				title: "文本",
				cover: "",
				material: Text(),
			});
		},
	},
});
