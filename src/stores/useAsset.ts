import { defineStore } from "pinia";
import type { Asset } from "@/types/Asset";
import { generateId } from "@/utils/tool";
import { Container } from "@/materials/container/Container";
import { Text } from "@/materials/text/Text";
import containerCover from "@/assets/images/container_cover.png";
import textCover from "@/assets/images/text_cover.png";

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
				categories: ["模版"],
				component: (() => {
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
				categories: ["容器"],
				cover: containerCover,
				component: Container(),
			});
			this.assets.push({
				id: generateId(),
				title: "文本",
				categories: ["信息"],
				cover: textCover,
				component: Text(),
			});
		},
	},
});
