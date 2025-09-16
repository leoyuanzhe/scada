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
type EChartsOptionV2TextStyle = {
	align: EChartsOptionV2Align;
	verticalAlign: EChartsOptionV2VerticalAlign;
	lineHeight: number | null;
	backgroundColor: EChartsOptionV2TextBackgroundColor;
	padding: number | number[];
	overflow: EChartsOptionV2Overflow;
	ellipsis: string;
	rich: EChartsOptionV2Rich;
	richInheritPlainLabel: boolean;
} & EChartsOptionV2Size &
	EChartsOptionV2Font &
	EChartsOptionV2TextBorder &
	EChartsOptionV2TextShadow;
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
type EChartsOptionV2LineStyle = {
	color: Color;
	width: number;
	opacity: number;
	inactiveColor: Color;
	inactiveWidth: number;
} & EChartsOptionV2LineBorder &
	EChartsOptionV2Shadow;
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
type EChartsOptionV2CoordinateSystem = {
	coordinateSystem: string | null;
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
type EChartsOptionV2Animation = {
	animation: boolean;
	animationThreshold: number;
	animationDuration: number;
	animationEasing: "cubicOut";
	animationDelay: number | ((params: any) => number);
	animationDurationUpdate: number | ((params: any) => number);
	animationEasingUpdate: "exponentialOut";
	animationDelayUpdate: number | ((params: any) => number);
};
type EChartsOptionV2TooltipAxisPointer = {
	type: "line" | "shadow" | "none" | "cross";
	axis: "auto" | "x" | "y" | "radius" | "angle";
	snap: boolean;
	z: number;
	label: {
		show: boolean;
		precision: number | string;
		formatter: string | ((params: any) => string);
		margin: number;
		lineHeight: number | null;
		overflow: EChartsOptionV2Overflow;
		ellipsis: string;
		padding: number | number[];
		backgroundColor: string;
	} & EChartsOptionV2Size &
		EChartsOptionV2Font &
		EChartsOptionV2TextBorder &
		EChartsOptionV2TextShadow &
		EChartsOptionV2Border &
		EChartsOptionV2Shadow;
	lineStyle: EChartsOptionV2LineStyle;
	shadowStyle: {
		color: Color;
		opacity: number;
	} & EChartsOptionV2Shadow;
	crossStyle: {
		color: Color;
		width: number;
		opacity: number;
	} & EChartsOptionV2LineBorder &
		EChartsOptionV2Shadow;
} & EChartsOptionV2Animation;
type EChartsOptionV2Tooltip = {
	show: boolean;
	trigger: "item" | "axis" | "none";
	axisPointer: EChartsOptionV2TooltipAxisPointer;
	showContent: boolean;
	alwaysShowContent: boolean;
	triggerOn: string;
	showDelay: number;
	hideDelay: number;
	enterable: boolean;
	renderMode: string;
	confine: boolean;
	appendTo: string | HTMLElement | ((chartContainer: HTMLElement) => HTMLElement | undefined | null) | null;
	className: string;
	transitionDuration: number;
	displayTransition: boolean;
	position: string | (string | number)[];
	formatter: string | ((params: any) => string);
	valueFormatter: string | ((value: number | string, dataIndex: number) => string);
	backgroundColor: Color;
	padding: number | number[];
	textStyle: EChartsOptionV2TextStyle;
	extraCssText: string;
	order: "seriesAsc" | "seriesDesc" | "valueAsc" | "valueDesc";
} & EChartsOptionV2Border;
type EChartsOptionV2Name = {
	name: string;
	nameLocation: "start" | "middle" | "center" | "end";
	nameTextStyle: EChartsOptionV2TextStyle;
	nameGap: number;
	nameRotate: number;
	nameTruncate: {
		maxWidth: number;
		ellipsis: string;
	};
};
type EChartsOptionV2Axis = {
	id: string;
	show: boolean;
	gridIndex: number;
	alignTicks: boolean;
	position: "top" | "bottom";
	offset: number;
	type: "value" | "category" | "time" | "log";
	EChartsOptionV2Name;
	nameMoveOverlap: boolean;
	inverse: boolean;
	boundaryGap: boolean | string[];
	min: number | string | ((params: any) => number);
	max: number | string | ((params: any) => number);
	scale: boolean;
	splitNumber: number;
	minInterval: number;
	maxInterval: number;
	interval: number;
	logBase: number;
	startValue: number;
	silent: boolean;
	triggerEvent: boolean;
	jitter: number;
	jitterOverlap: boolean;
	jitterMargin: number;
	breaks: {
		start: string | number | Date;
		end: string | number | Date;
		gap: number | string;
		isExpanded: boolean;
	}[];
	breakArea: {
		show: boolean;
		itemStyle: {
			color: Color;
			opacity: number;
		} & EChartsOptionV2Border &
			EChartsOptionV2Shadow;
		zigzagAmplitude: number;
		zigzagMinSpan: number;
		zigzagMaxSpan: number;
		zigzagZ: number;
		expandOnClick: boolean;
	};
	breakLabelLayout: {
		moveOverlap: "auto" | boolean;
	};
	axisLine: {
		show: boolean;
		onZero: boolean;
		onZeroAxisIndex: number;
		symbol: EChartsOptionV2Symbol | EChartsOptionV2Symbol[];
		symbolSize: number[];
		symbolOffset: number[];
		lineStyle: EChartsOptionV2LineStyle;
	};
	axisTick: {
		show: boolean;
		alignWithLabel: boolean;
		interval: number | ((index: number, value: string) => boolean);
		inside: boolean;
		length: number;
		lineStyle: EChartsOptionV2LineStyle;
		customValues: number[];
	};
	minorTick: {
		show: boolean;
		splitNumber: number;
		length: number;
		lineStyle: EChartsOptionV2LineStyle;
	};
	axisLabel: {
		show: boolean;
		interval: number | ((index: number, value: string) => boolean);
		inside: boolean;
		rotate: number;
		margin: number;
		formatter: string | ((params: any) => string);
		showMinLabel: boolean;
		showMaxLabel: boolean;
		alignMinLabel: "left" | "center" | "right" | null;
		alignMaxLabel: "left" | "center" | "right" | null;
		hideOverlap: boolean;
		customValues: number[];
	} & EChartsOptionV2TextStyle &
		EChartsOptionV2Border &
		EChartsOptionV2Shadow;
	splitLine: {
		show: boolean;
		showMinLine: boolean;
		showMaxLine: boolean;
		interval: number | ((index: number, value: string) => boolean);
		lineStyle: EChartsOptionV2LineStyle;
	};
	minorSplitLine: {
		show: boolean;
		lineStyle: EChartsOptionV2LineStyle;
	};
	splitArea: {
		show: boolean;
		interval: number | ((index: number, value: string) => boolean);
		areaStyle: {
			color: string[];
		} & EChartsOptionV2Shadow;
	};
	axisPointer: {
		show: boolean;
		type: "line" | "shadow" | "none";
		snap: boolean;
		z: number;
		label: {
			show: boolean;
			precision: number | string;
			formatter: string | ((params: any) => string);
			margin: number;
			lineHeight: number | null;
			overflow: EChartsOptionV2Overflow;
			ellipsis: string;
			padding: number | number[];
			backgroundColor: string;
		} & EChartsOptionV2Size &
			EChartsOptionV2Font &
			EChartsOptionV2TextBorder &
			EChartsOptionV2TextShadow &
			EChartsOptionV2Border &
			EChartsOptionV2Shadow;
		lineStyle: EChartsOptionV2LineStyle;
		shadowStyle: {
			color: Color;
			opacity: number;
		} & EChartsOptionV2Shadow;
		triggerEmphasis: boolean;
		triggerTooltip: boolean;
		value: number;
		status: "show" | "hide";
		handle: {
			show: boolean;
			icon: EChartsOptionV2Symbol;
			size: number | number[];
			margin: number;
			color: Color;
			throttle: number;
		} & EChartsOptionV2Shadow;
	};
	tooltip: {
		show: boolean;
		position: string | (string | number)[];
		formatter: string | ((params: any) => string);
		backgroundColor: Color;
		padding: number | number[];
		textStyle: EChartsOptionV2TextStyle;
		extraCssText: string;
	} & EChartsOptionV2Border;
	zlevel: number;
	z: number;
	data: {
		value: string;
		textStyle: EChartsOptionV2TextStyle;
	}[];
} & EChartsOptionV2Name &
	EChartsOptionV2Animation;
export interface EChartsOptionV2 extends EChartsOption {
	title: {
		id: string | null;
		show: boolean;
		text: string;
		link: string;
		target: EChartsOptionV2Target;
		textStyle: EChartsOptionV2TextStyle;
		subtext: string;
		sublink: string;
		subtarget: EChartsOptionV2Target;
		subtextStyle: EChartsOptionV2TextStyle;
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
		lineStyle: EChartsOptionV2LineStyle;
		symbolRotate: "inherit" | number;
		formatter: string | ((params: any) => string);
		selectedMode: boolean | "single" | "multiple";
		inactiveColor: Color;
		inactiveBorderColor: Color;
		inactiveBorderWidth: "auto" | "inherit" | number;
		selected: Record<string, boolean>;
		textStyle: EChartsOptionV2TextStyle & EChartsOptionV2Border & EChartsOptionV2Shadow;
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
			lineStyle: EChartsOptionV2LineStyle;
			symbolRotate: "inherit" | number;
			inactiveColor: Color;
			inactiveBorderColor: Color;
			inactiveBorderWidth: "auto" | "inherit" | number;
			textStyle: EChartsOptionV2TextStyle;
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
			pageTextStyle: EChartsOptionV2TextStyle;
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
	grid: {
		id: string;
		show: boolean;
		zlevel: number;
		z: number;
		containLabel: boolean;
		outerBoundsMode: "auto" | "none" | "same";
		outerBounds: EchartsOptionV2Position & EChartsOptionV2Size;
		outerBoundsContain: "auto" | "all" | "axisLabel";
		backgroundColor: Color;
		tooltip: {
			show: boolean;
			trigger: "item" | "axis" | "none";
			axisPointer: EChartsOptionV2TooltipAxisPointer;
			position: string | (string | number)[];
			formatter: string | ((params: any) => string);
			valueFormatter: string | ((value: number | string, dataIndex: number) => string);
			backgroundColor: Color;
			padding: number | number[];
			textStyle: EChartsOptionV2TextStyle;
			extraCssText: string;
		};
	} & EchartsOptionV2Position &
		EChartsOptionV2Size &
		EChartsOptionV2Border &
		EChartsOptionV2Shadow &
		EChartsOptionV2CoordinateSystem;
	xAxis: EChartsOptionV2Axis;
	yAxis: EChartsOptionV2Axis;
	polar: {
		id: string;
		zlevel: number;
		z: number;
		center: (number | string)[];
		radius: number | string | (number | string)[];
		tooltip: {
			show: boolean;
			trigger: "item" | "axis" | "none";
			axisPointer: EChartsOptionV2TooltipAxisPointer;
			position: string | (string | number)[];
			formatter: string | ((params: any) => string);
			valueFormatter: string | ((value: number | string, dataIndex: number) => string);
			backgroundColor: Color;
			padding: number | number[];
			textStyle: EChartsOptionV2TextStyle;
			extraCssText: string;
		} & EChartsOptionV2Border;
	} & EChartsOptionV2CoordinateSystem;
	radiusAxis: {
		id: string;
		polarIndex: number;
		type: "value" | "category" | "time" | "log";
		inverse: boolean;
		boundaryGap: boolean | string[];
		min: number | string | ((params: any) => number);
		max: number | string | ((params: any) => number);
		scale: boolean;
		splitNumber: number;
		minInterval: number;
		maxInterval: number;
		interval: number;
		logBase: number;
		startValue: number;
		silent: boolean;
		triggerEvent: boolean;
		axisLine: {
			show: boolean;
			symbol: EChartsOptionV2Symbol | EChartsOptionV2Symbol[];
			symbolSize: number[];
			symbolOffset: number[];
			lineStyle: EChartsOptionV2LineStyle;
		};
		axisTick: {
			show: boolean;
			alignWithLabel: boolean;
			interval: number | ((index: number, value: string) => boolean);
			inside: boolean;
			length: number;
			lineStyle: EChartsOptionV2LineStyle;
			customValues: number[];
		};
		minorTick: {
			show: boolean;
			splitNumber: number;
			length: number;
			lineStyle: EChartsOptionV2LineStyle;
		};
		axisLabel: {
			show: boolean;
			interval: number | ((index: number, value: string) => boolean);
			inside: boolean;
			rotate: number;
			margin: number;
			formatter: string | ((params: any) => string);
			showMinLabel: boolean;
			showMaxLabel: boolean;
			alignMinLabel: "left" | "center" | "right" | null;
			alignMaxLabel: "left" | "center" | "right" | null;
			hideOverlap: boolean;
			customValues: number[];
		} & EChartsOptionV2TextStyle &
			EChartsOptionV2Border &
			EChartsOptionV2Shadow;
		splitLine: {
			show: boolean;
			showMinLine: boolean;
			showMaxLine: boolean;
			interval: number | ((index: number, value: string) => boolean);
			lineStyle: EChartsOptionV2LineStyle;
		};
		minorSplitLine: {
			show: boolean;
			lineStyle: EChartsOptionV2LineStyle;
		};
		splitArea: {
			show: boolean;
			interval: number | ((index: number, value: string) => boolean);
			areaStyle: {
				color: string[];
			} & EChartsOptionV2Shadow;
		};
		axisPointer: {
			show: boolean;
			type: "line" | "shadow" | "none";
			snap: boolean;
			z: number;
			label: {
				show: boolean;
				precision: number | string;
				formatter: string | ((params: any) => string);
				margin: number;
				lineHeight: number | null;
				overflow: EChartsOptionV2Overflow;
				ellipsis: string;
				padding: number | number[];
				backgroundColor: string;
			} & EChartsOptionV2Size &
				EChartsOptionV2Font &
				EChartsOptionV2TextBorder &
				EChartsOptionV2TextShadow &
				EChartsOptionV2Border &
				EChartsOptionV2Shadow;
			lineStyle: EChartsOptionV2LineStyle;
			shadowStyle: {
				color: Color;
				opacity: number;
			} & EChartsOptionV2Shadow;
			triggerEmphasis: boolean;
			triggerTooltip: boolean;
			value: number;
			status: "show" | "hide";
			handle: {
				show: boolean;
				icon: EChartsOptionV2Symbol;
				size: number | number[];
				margin: number;
				color: Color;
				throttle: number;
			} & EChartsOptionV2Shadow;
		};
		tooltip: {
			show: boolean;
			position: string | (string | number)[];
			formatter: string | ((params: any) => string);
			backgroundColor: Color;
			padding: number | number[];
			textStyle: EChartsOptionV2TextStyle;
			extraCssText: string;
		} & EChartsOptionV2Border;
		zlevel: number;
		z: number;
		data: {
			value: string;
			textStyle: EChartsOptionV2TextStyle;
		}[];
	} & EChartsOptionV2Name &
		EChartsOptionV2Animation;
	angleAxis: {};
	radar: {};
	dataZoom: {}[];
	visualMap: {}[];
	tooltip: EChartsOptionV2Tooltip;
	series: [
		{
			name: string;
			type: "bar";
			data: number[];
		}
	];
}
