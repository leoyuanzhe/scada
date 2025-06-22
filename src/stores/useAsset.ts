import { defineStore } from "pinia";
import type { Asset } from "@/types/Asset";
import { Container } from "@/materials/container/Container";
import { Text } from "@/materials/text/Text";

export const useAsset = defineStore("asset", {
	state() {
		return {
			assets: [] as Asset[],
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
