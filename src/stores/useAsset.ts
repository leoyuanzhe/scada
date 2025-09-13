import { defineStore } from "pinia";
import type { Asset } from "@/types/Asset";
import { generateId } from "@/utils/tool";
import { Page } from "@/materials/page/Page";
import { Container } from "@/materials/container/Container";
import { Text } from "@/materials/text/Text";
import pageCover from "@/assets/images/page_cover.png";
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
					const page = Page();
					page.title = "页面";
					page.props.backgroundColor = "#000000";
					page.layout.width = 1980;
					page.layout.height = 1080;
					return page;
				})(),
			});
			this.assets.push({
				id: generateId(),
				title: "页面",
				categories: ["容器"],
				cover: pageCover,
				component: Page(),
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
