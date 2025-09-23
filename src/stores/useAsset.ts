import { defineStore } from "pinia";
import type { Asset } from "@/types/Asset";
import { generateId } from "@/utils/tool";
import { Page } from "@/materials/page/Page";
import { Bone } from "@/materials/bone/Bone";
import { Container } from "@/materials/container/Container";
import { Text } from "@/materials/text/Text";
import { Dialog } from "@/materials/dialog/Dialog";
import { Chart } from "@/materials/chart/Chart";
import pageCover from "@/assets/images/page_cover.png";
import boneCover from "@/assets/images/bone_cover.png";
import containerCover from "@/assets/images/container_cover.png";
import textCover from "@/assets/images/text_cover.png";
import dialogCover from "@/assets/images/dialog_cover.png";
import commonChartCover from "@/assets/images/common_chart_cover.png";

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
				cover: boneCover,
				categories: ["模版"],
				component: (() => {
					const page = Page();
					page.title = "页面";
					page.props.backgroundColor = "#000000";
					page.layout.width = 1980;
					page.layout.height = 1080;
					const container = Container();
					container.layout.left = 10;
					container.layout.top = 10;
					container.layout.width = 980;
					container.layout.height = 980;
					const b1 = Bone();
					b1.layout.left = 10;
					b1.layout.top = 10;
					const b2 = Bone();
					b2.layout.left = 10;
					b2.layout.top = 320;
					const b3 = Bone();
					b3.layout.left = 320;
					b3.layout.top = 10;
					const b4 = Bone();
					b4.layout.left = 320;
					b4.layout.top = 320;
					container.components.push(b1, b2, b3, b4);
					page.components.push(container);
					return page;
				})(),
			});
			this.assets.push({
				id: generateId(),
				title: "页面",
				categories: ["基础"],
				cover: pageCover,
				component: Page(),
			});
			this.assets.push({
				id: generateId(),
				title: "骨架",
				categories: ["开发"],
				cover: boneCover,
				component: Bone(),
			});
			this.assets.push({
				id: generateId(),
				title: "容器",
				categories: ["基础"],
				cover: containerCover,
				component: Container(),
			});
			this.assets.push({
				id: generateId(),
				title: "文本",
				categories: ["基础"],
				cover: textCover,
				component: Text(),
			});
			this.assets.push({
				id: generateId(),
				title: "对话框",
				categories: ["反馈"],
				cover: dialogCover,
				component: Dialog(),
			});
			this.assets.push({
				id: generateId(),
				title: "通用图表",
				categories: ["图表"],
				cover: commonChartCover,
				component: Chart(),
			});
		},
	},
});
