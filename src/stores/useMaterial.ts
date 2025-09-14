import { defineStore } from "pinia";
import type { Material, MaterialWithLayout } from "@/types/Material";
import { Page } from "@/materials/page/Page";
import { Bone } from "@/materials/bone/Bone";
import { Container } from "@/materials/container/Container";
import { Text } from "@/materials/text/Text";
import { Dialog } from "@/materials/dialog/Dialog";
import { Chart } from "@/materials/chart/Chart";

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
			this.materials.push(Bone());
			this.materials.push(Container());
			this.materials.push(Text());
			this.materials.push(Dialog());
			this.materials.push(Chart());
		},
	},
});
