import { defineStore } from "pinia";
import type { Material, MaterialWithLayout } from "@/types/Material";
import { Page } from "@/materials/page/Page";
import { Container } from "@/materials/container/Container";
import { Text } from "@/materials/text/Text";

export const useMaterial = defineStore("material", {
	state() {
		return {
			materials: [] as (Material | MaterialWithLayout)[],
		};
	},
	actions: {
		init() {
			this.materials.length = 0;
			this.materials.push(Page());
			this.materials.push(Container());
			this.materials.push(Text());
		},
	},
});
