import type { EChartsOption, Color } from "echarts";

type EChartsOptionV2Target = "blank" | "self";
type EChartsOptionV2FontStyle = "normal" | "italic" | "oblique";
type EChartsOptionV2FontWeight = "normal" | "bold" | "bolder" | "lighter" | number;
type EChartsOptionV2BorderType = "solid" | "dashed" | "dotted" | number | number[];
type EChartsOptionV2Align = "left" | "center" | "right" | null;
type EChartsOptionV2VerticalAlign = "top" | "middle" | "bottom" | null;
type EChartsOptionV2VerticalOrient = "horizontal" | "vertical";
type EChartsOptionV2Symbol =
	| "circle"
	| "rect"
	| "roundRect"
	| "triangle"
	| "diamond"
	| "pin"
	| "arrow"
	| "none"
	| string;
type EChartsOptionV2Overflow = "none" | "truncate" | "break" | "breakAll";
type EchartsOptionV2Position = {
	left: "auto" | "left" | "center" | "right" | string | number;
	top: "auto" | "top" | "middle" | "bottom" | string | number;
	right: "auto" | string | number;
	bottom: "auto" | string | number;
};
type EchartsOptionV2Size = {
	width: number | string | null;
	height: number | string | null;
};
type EChartsOptionV2Font = {
	color: Color;
	fontStyle: EChartsOptionV2FontStyle;
	fontWeight: EChartsOptionV2FontWeight;
	fontFamily: string;
	fontSize: number;
};
type EChartsOptionV2TextBackgroundColor =
	| string
	| ({
			image: string;
	  } & EchartsOptionV2Size);
type EChartsOptionV2TextBorder = {
	textBorderColor: Color;
	textBorderWidth: number;
	textBorderType: EChartsOptionV2BorderType;
	textBorderDashOffset: number;
};
type EChartsOptionV2TextShadow = {
	textShadowColor: Color;
	textShadowBlur: number;
	textShadowOffsetX: number;
	textShadowOffsetY: number;
};
type EChartsOptionV2Border = {
	borderColor: Color;
	borderWidth: number;
	borderType: EChartsOptionV2BorderType;
	borderDashOffset: number;
	borderRadius: number | number[];
	borderCap: "butt" | "round" | "square";
	borderJoin: "bevel" | "round" | "miter";
	borderMiterLimit: number;
};
type EChartsOptionV2LineBorder = {
	type: EChartsOptionV2Border["borderType"];
	dashOffset: EChartsOptionV2Border["borderDashOffset"];
	cap: EChartsOptionV2Border["borderCap"];
	cap: EChartsOptionV2Border["borderJoin"];
	miterLimit: EChartsOptionV2Border["borderMiterLimit"];
};
type EChartsOptionV2Shadow = {
	shadowColor: Color;
	shadowBlur: number;
	shadowOffsetX: number;
	shadowOffsetY: number;
};
type EChartsOptionV2Rich = Record<
	string,
	{
		align: EChartsOptionV2Align;
		verticalAlign: EChartsOptionV2VerticalAlign;
		lineHeight: number | null;
		backgroundColor: EChartsOptionV2TextBackgroundColor;
		padding: number | number[];
	} & EChartsOptionV2Size &
		EChartsOptionV2Font &
		EChartsOptionV2TextBorder &
		EChartsOptionV2TextShadow &
		EChartsOptionV2Border &
		EChartsOptionV2Shadow
>;
type EChartsOptionV2CoordinateSystem = {
	coordinateSystem: string;
	coordinateSystemUsage: "box" | "data";
	coord: Array | number | string;
	calendarIndex: number;
	calendarId: number | null;
	matrixIndex: number;
	matrixId: number | null;
};
type EChartsOptionV2Decal =
	| "none"
	| {
			symbol: EChartsOptionV2Symbol | EChartsOptionV2Symbol[];
			symbolSize: number;
			symbolKeepAspect: boolean;
			color: string;
			backgroundColor: string;
			dashArrayX: number | number[];
			dashArrayY: number | number[];
			rotation: number;
			maxTileWidth: number;
			maxTileHeight: number;
	  };
type EChartsOptionV2Tooltip = {};
export interface EChartsOptionV2 extends EChartsOption {
	title: {
		id: string | null;
		show: boolean;
		text: string;
		link: string;
		target: EChartsOptionV2Target;
		textStyle: {
			lineHeight: number | null;
			overflow: EChartsOptionV2Overflow;
			ellipsis: string;
			rich: EChartsOptionV2Rich;
			richInheritPlainLabel: boolean;
		} & EChartsOptionV2Size &
			EChartsOptionV2Font &
			EChartsOptionV2TextBorder &
			EChartsOptionV2TextShadow;
		subtext: string;
		sublink: string;
		subtarget: EChartsOptionV2Target;
		subtextStyle: {
			align: EChartsOptionV2Align;
			verticalAlign: EChartsOptionV2VerticalAlign;
			lineHeight: number | null;
			overflow: EChartsOptionV2Overflow;
			ellipsis: string;
			rich: EChartsOptionV2Rich;
			richInheritPlainLabel: boolean;
		} & EChartsOptionV2Size &
			EChartsOptionV2Font &
			EChartsOptionV2TextBorder &
			EChartsOptionV2TextShadow;
		textAlign: "auto" | "left" | "right" | "center";
		textVerticalAlign: "auto" | "top" | "bottom" | "middle";
		triggerEvent: boolean;
		padding: number | number[];
		itemGap: number;
		zlevel: number;
		z: number;
		backgroundColor: Color;
	} & EchartsOptionV2Position &
		EChartsOptionV2Border &
		EChartsOptionV2Shadow &
		EChartsOptionV2CoordinateSystem;
	legend: {
		type: "plain" | "scroll";
		id: string | null;
		show: boolean;
		zlevel: number;
		z: number;
		orient: EChartsOptionV2VerticalOrient;
		align: EChartsOptionV2Align;
		padding: number | number[];
		itemGap: number;
		itemWidth: number;
		itemHeight: number;
		itemStyle: {
			color: Color;
			opacity: number;
			decal: EChartsOptionV2Decal;
		} & EChartsOptionV2Border &
			EChartsOptionV2Shadow;
		lineStyle: {
			color: Color;
			width: "auto" | number;
			opacity: number;
			inactiveColor: Color;
			inactiveWidth: number;
		} & EChartsOptionV2LineBorder &
			EChartsOptionV2Shadow;
		symbolRotate: "inherit" | number;
		formatter: string | ((params: any) => string);
		selectedMode: boolean | "single" | "multiple";
		inactiveColor: Color;
		inactiveBorderColor: Color;
		inactiveBorderWidth: "auto" | "inherit" | number;
		selected: Record<string, boolean>;
		textStyle: {
			lineHeight: number | null;
			backgroundColor: EChartsOptionV2TextBackgroundColor;
			padding: number | number[];
			overflow: EChartsOptionV2Overflow;
			ellipsis: string;
			rich: EChartsOptionV2Rich;
			richInheritPlainLabel: boolean;
		} & EchartsOptionV2Size &
			EChartsOptionV2Font &
			EChartsOptionV2Border &
			EChartsOptionV2Shadow &
			EChartsOptionV2TextBorder &
			EChartsOptionV2TextShadow;
		tooltip: EChartsOptionV2Tooltip;
		icon: EChartsOptionV2Symbol;
		data: ({
			name: string;
			icon: EChartsOptionV2Symbol;
			itemStyle: {
				color: Color;
				opacity: number;
				decal: EChartsOptionV2Decal;
			} & EChartsOptionV2Border &
				EChartsOptionV2Shadow;
			lineStyle: {
				color: Color;
				width: "auto" | number;
				opacity: number;
				inactiveColor: Color;
				inactiveWidth: number;
			} & EChartsOptionV2LineBorder &
				EChartsOptionV2Shadow;
			symbolRotate: "inherit" | number;
			inactiveColor: Color;
			inactiveBorderColor: Color;
			inactiveBorderWidth: "auto" | "inherit" | number;
			textStyle: {
				lineHeight: number | null;
				backgroundColor: EChartsOptionV2TextBackgroundColor;
				padding: number | number[];
				overflow: EChartsOptionV2Overflow;
				ellipsis: string;
			} & EchartsOptionV2Size &
				EChartsOptionV2Font &
				EChartsOptionV2TextBorder &
				EChartsOptionV2TextShadow;
			backgroundColor: Color;
			scrollDataIndex: number;
			pageButtonItemGap: number;
			pageButtonGap: number;
			pageButtonPosition: "start" | "end";
			pageFormatter: string | ((params: any) => string);
			pageIcons: {
				horizontal: string[];
				vertical: string[];
			};
			pageIconColor: string;
			pageIconInactiveColor: string;
			pageIconSize: number | number[];
			pageTextStyle: {
				overflow: EChartsOptionV2Overflow;
				ellipsis: string;
			} & EchartsOptionV2Size &
				EChartsOptionV2Font &
				EChartsOptionV2TextBorder &
				EChartsOptionV2TextShadow;
			animation: boolean;
			animationDurationUpdate: number;
			emphasis: {
				selectorLabel: {
					show: boolean;
					distance: number;
					rotate: number;
					offset: number[];
					align: EChartsOptionV2Align;
					verticalAlign: EChartsOptionV2VerticalAlign;
					lineHeight: number | null;
					backgroundColor: EChartsOptionV2TextBackgroundColor;
					padding: number | number[];
					overflow: EChartsOptionV2Overflow;
					ellipsis: string;
					rich: EChartsOptionV2Rich;
					richInheritPlainLabel: boolean;
				} & EchartsOptionV2Size &
					EChartsOptionV2Font &
					EChartsOptionV2Border &
					EChartsOptionV2Shadow &
					EChartsOptionV2TextBorder &
					EChartsOptionV2TextShadow;
			};
			selector: boolean | string[] | { type: "all" | "inverse"; title: string }[];
			selectorLabel: {
				show: boolean;
				distance: number;
				rotate: number;
				offset: number[];
				align: EChartsOptionV2Align;
				verticalAlign: EChartsOptionV2VerticalAlign;
				lineHeight: number | null;
				backgroundColor: EChartsOptionV2TextBackgroundColor;
				padding: number | number[];
				overflow: EChartsOptionV2Overflow;
				ellipsis: string;
				rich: EChartsOptionV2Rich;
				richInheritPlainLabel: boolean;
			} & EchartsOptionV2Size &
				EChartsOptionV2Font &
				EChartsOptionV2Border &
				EChartsOptionV2Shadow &
				EChartsOptionV2TextBorder &
				EChartsOptionV2TextShadow;
			selectorPosition: "auto" | "start" | "end";
			selectorItemGap: number;
			selectorButtonGap: number;
			triggerEvent: boolean;
		} & EChartsOptionV2Border &
			EChartsOptionV2Shadow)[];
	} & EchartsOptionV2Position &
		EChartsOptionV2Size &
		EChartsOptionV2CoordinateSystem;
	tooltip: EChartsOptionV2Tooltip;
	legend: {
		data: string[];
	};
	xAxis: {
		data: string[];
	};
	yAxis: {};
	series: [
		{
			name: string;
			type: "bar";
			data: number[];
		}
	];
}
