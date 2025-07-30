import { defineStore } from "pinia";
import type { Asset } from "@/types/Asset";
import { generateId } from "@/utils/tool";
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
				id: generateId(),
				title: "模版1",
				cover: "",
				material: (() => {
					const container = Container();
					container.title = "页面";
					container.props.backgroundColor = "#000000";
					container.layout.width = 1980;
					container.layout.height = 1080;
					return container;
				})(),
			});
			this.assets.push({
				id: generateId(),
				title: "容器",
				cover: "",
				material: Container(),
			});
			this.assets.push({
				id: generateId(),
				title: "文本",
				cover: "",
				material: Text(),
			});
		},
	},
});
