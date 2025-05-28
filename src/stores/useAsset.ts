import { defineStore } from "pinia";
import type { Material } from "@/types/Material";
import { Container } from "@/materials/container/Container";
import { Text } from "@/materials/text/Text";

export const useAsset = defineStore("asset", {
	state() {
		return {
			assets: [] as { id: string; title: string; cover: string; material: Material }[],
		};
	},
	actions: {
		init() {
			this.assets.length = 0;
			this.assets.push({
				id: "container",
				title: "容器",
				cover: "",
				material: Container(),
			});
			this.assets.push({
				id: "text",
				title: "文本",
				cover: "",
				material: Text(),
			});
		},
	},
});
