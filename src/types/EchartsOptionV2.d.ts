import type { EChartsOption, Color } from "echarts";

type EChartsOptionV2Target = "blank" | "self";
type EChartsOptionV2FontStyle = "normal" | "italic" | "oblique";
type EChartsOptionV2FontWeight = "normal" | "bold" | "bolder" | "lighter" | number;
type EChartsOptionV2BorderType = "solid" | "dashed" | "dotted" | number | number[];
type EChartsOptionV2Align = "left" | "center" | "right" | null;
type EChartsOptionV2VerticalAlign = "top" | "middle" | "bottom" | null;
type EChartsOptionV2VOrient = "horizontal" | "vertical";
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
type EChartsOptionV2Position = {
	left?: "auto" | "left" | "center" | "right" | string | number;
	top?: "auto" | "top" | "middle" | "bottom" | string | number;
	right?: "auto" | string | number;
	bottom?: "auto" | string | number;
};
type EChartsOptionV2Size = {
	width?: number | string | null;
	height?: number | string | null;
};
type EChartsOptionV2Font = {
	color?: Color;
	fontStyle?: EChartsOptionV2FontStyle;
	fontWeight?: EChartsOptionV2FontWeight;
	fontFamily?: string;
	fontSize?: number;
	lineHeight?: number | null;
	backgroundColor?: EChartsOptionV2TextBackgroundColor;
	padding?: number | number[];
};
type EChartsOptionV2TextBackgroundColor =
	| string
	| ({
			image?: string;
	  } & EChartsOptionV2Size);
type EChartsOptionV2TextBorder = {
	textBorderColor?: Color;
	textBorderWidth?: number;
	textBorderType?: EChartsOptionV2BorderType;
	textBorderDashOffset?: number;
};
type EChartsOptionV2TextShadow = {
	textShadowColor?: Color;
	textShadowBlur?: number;
	textShadowOffsetX?: number;
	textShadowOffsetY?: number;
};
type EChartsOptionV2TextStyle = {
	align?: EChartsOptionV2Align;
	verticalAlign?: EChartsOptionV2VerticalAlign;
	overflow?: EChartsOptionV2Overflow;
	ellipsis?: string;
	rich?: EChartsOptionV2Rich;
	richInheritPlainLabel?: boolean;
} & EChartsOptionV2Size &
	EChartsOptionV2Font &
	EChartsOptionV2TextBorder &
	EChartsOptionV2TextShadow;
type EChartsOptionV2Label = {
	show?: boolean;
	distance?: number;
	rotate?: number;
	offset?: number[];
} & EChartsOptionV2TextStyle;
type EChartsOptionV2Rich = Record<
	string,
	{
		align?: EChartsOptionV2Align;
		verticalAlign?: EChartsOptionV2VerticalAlign;
	} & EChartsOptionV2Size &
		EChartsOptionV2Font &
		EChartsOptionV2TextBorder &
		EChartsOptionV2TextShadow &
		EChartsOptionV2Border &
		EChartsOptionV2Shadow
>;
type EChartsOptionV2AreaStyle = {
	color?: string[];
} & EChartsOptionV2Shadow;
type EChartsOptionV2LineStyle = {
	color?: Color;
	width?: number;
	opacity?: number;
} & EChartsOptionV2LineBorder &
	EChartsOptionV2Shadow;
type EChartsOptionV2ItemStyle = {
	color?: Color;
	opacity?: number;
} & EChartsOptionV2Border &
	EChartsOptionV2Shadow;
type EChartsOptionV2EmphasisIconStyle = {
	textPosition?: "left" | "right" | "top" | "bottom";
	textFill?: string;
	textAlign?: "left" | "center" | "right";
	textBackgroundColor?: string;
	textBorderRadius?: number;
	textPadding?: number;
} & EChartsOptionV2ItemStyle;
type EChartsOptionV2Border = {
	borderColor?: Color;
	borderWidth?: number;
	borderType?: EChartsOptionV2BorderType;
	borderDashOffset?: number;
	borderRadius?: number | number[];
	borderCap?: "butt" | "round" | "square";
	borderJoin?: "bevel" | "round" | "miter";
	borderMiterLimit?: number;
};
type EChartsOptionV2LineBorder = {
	type?: EChartsOptionV2Border["borderType"];
	dashOffset?: EChartsOptionV2Border["borderDashOffset"];
	cap?: EChartsOptionV2Border["borderCap"];
	cap?: EChartsOptionV2Border["borderJoin"];
	miterLimit?: EChartsOptionV2Border["borderMiterLimit"];
};
type EChartsOptionV2Shadow = {
	shadowColor?: Color;
	shadowBlur?: number;
	shadowOffsetX?: number;
	shadowOffsetY?: number;
};
type EChartsOptionV2CoordinateSystem = {
	coordinateSystem?: string | null;
	coordinateSystemUsage?: "box" | "data";
	coord?: Array | number | string;
	calendarIndex?: number;
	calendarId?: number | null;
	matrixIndex?: number;
	matrixId?: number | null;
};
type EChartsOptionV2Decal =
	| "none"
	| {
			symbol?: EChartsOptionV2Symbol | EChartsOptionV2Symbol[];
			symbolSize?: number;
			symbolKeepAspect?: boolean;
			color?: string;
			backgroundColor?: string;
			dashArrayX?: number | number[];
			dashArrayY?: number | number[];
			rotation?: number;
			maxTileWidth?: number;
			maxTileHeight?: number;
	  };
type EChartsOptionV2Animation = {
	animation?: boolean;
	animationThreshold?: number;
	animationDuration?: number;
	animationEasing?: "cubicOut";
	animationDelay?: number | ((params?: any) => number);
	animationDurationUpdate?: number | ((params?: any) => number);
	animationEasingUpdate?: "exponentialOut";
	animationDelayUpdate?: number | ((params?: any) => number);
};
type EChartsOptionV2TooltipAxisPointer = {
	type?: "line" | "shadow" | "none" | "cross";
	axis?: "auto" | "x" | "y" | "radius" | "angle";
	snap?: boolean;
	z?: number;
	label?: {
		show?: boolean;
		precision?: number | string;
		formatter?: string | ((params?: any) => string);
		margin?: number;
		overflow?: EChartsOptionV2Overflow;
		ellipsis?: string;
	} & EChartsOptionV2Size &
		EChartsOptionV2Font &
		EChartsOptionV2TextBorder &
		EChartsOptionV2TextShadow &
		EChartsOptionV2Border &
		EChartsOptionV2Shadow;
	lineStyle?: EChartsOptionV2LineStyle;
	shadowStyle?: {
		color?: Color;
		opacity?: number;
	} & EChartsOptionV2Shadow;
	crossStyle?: EChartsOptionV2LineStyle;
} & EChartsOptionV2Animation;
type EChartsOptionV2Tooltip = {
	show?: boolean;
	trigger?: "item" | "axis" | "none";
	axisPointer?: EChartsOptionV2TooltipAxisPointer;
	showContent?: boolean;
	alwaysShowContent?: boolean;
	triggerOn?: string;
	showDelay?: number;
	hideDelay?: number;
	enterable?: boolean;
	renderMode?: string;
	confine?: boolean;
	appendTo?: string | HTMLElement | ((chartContainer?: HTMLElement) => HTMLElement | undefined | null) | null;
	className?: string;
	transitionDuration?: number;
	displayTransition?: boolean;
	position?: string | (string | number)[];
	formatter?: string | ((params?: any) => string);
	valueFormatter?: string | ((value?: number | string, dataIndex?: number) => string);
	backgroundColor?: Color;
	padding?: number | number[];
	textStyle?: EChartsOptionV2TextStyle;
	extraCssText?: string;
	order?: "seriesAsc" | "seriesDesc" | "valueAsc" | "valueDesc";
} & EChartsOptionV2Border;
type EChartsOptionV2Name = {
	name?: string;
	nameLocation?: "start" | "middle" | "center" | "end";
	nameTextStyle?: EChartsOptionV2TextStyle;
	nameGap?: number;
	nameRotate?: number;
	nameTruncate?: {
		maxWidth?: number;
		ellipsis?: string;
	};
};
type EChartsOptionV2Handle = {
	show?: boolean;
	icon?: EChartsOptionV2Symbol;
	size?: number | number[];
	margin?: number;
	color?: Color;
	throttle?: number;
} & EChartsOptionV2Shadow;
type EChartsOptionV2Axis = {
	id?: string;
	show?: boolean;
	gridIndex?: number;
	alignTicks?: boolean;
	position?: "top" | "bottom";
	offset?: number;
	type?: "value" | "category" | "time" | "log";
	nameMoveOverlap?: boolean;
	inverse?: boolean;
	boundaryGap?: boolean | string[];
	min?: number | string | ((params?: any) => number);
	max?: number | string | ((params?: any) => number);
	scale?: boolean;
	splitNumber?: number;
	minInterval?: number;
	maxInterval?: number;
	interval?: number;
	logBase?: number;
	startValue?: number;
	silent?: boolean;
	triggerEvent?: boolean;
	jitter?: number;
	jitterOverlap?: boolean;
	jitterMargin?: number;
	breaks?: {
		start?: string | number | Date;
		end?: string | number | Date;
		gap?: number | string;
		isExpanded?: boolean;
	}[];
	breakArea?: {
		show?: boolean;
		itemStyle?: EChartsOptionV2ItemStyle;
		zigzagAmplitude?: number;
		zigzagMinSpan?: number;
		zigzagMaxSpan?: number;
		zigzagZ?: number;
		expandOnClick?: boolean;
	};
	breakLabelLayout?: {
		moveOverlap?: "auto" | boolean;
	};
	axisLine?: {
		show?: boolean;
		onZero?: boolean;
		onZeroAxisIndex?: number;
		symbol?: EChartsOptionV2Symbol | EChartsOptionV2Symbol[];
		symbolSize?: number[];
		symbolOffset?: number[];
		lineStyle?: EChartsOptionV2LineStyle;
	};
	axisTick?: {
		show?: boolean;
		alignWithLabel?: boolean;
		interval?: number | ((index?: number, value?: string) => boolean);
		inside?: boolean;
		length?: number;
		lineStyle?: EChartsOptionV2LineStyle;
		customValues?: number[];
	};
	minorTick?: {
		show?: boolean;
		splitNumber?: number;
		length?: number;
		lineStyle?: EChartsOptionV2LineStyle;
	};
	axisLabel?: {
		show?: boolean;
		interval?: number | ((index?: number, value?: string) => boolean);
		inside?: boolean;
		rotate?: number;
		margin?: number;
		formatter?: string | ((params?: any) => string);
		showMinLabel?: boolean;
		showMaxLabel?: boolean;
		alignMinLabel?: "left" | "center" | "right" | null;
		alignMaxLabel?: "left" | "center" | "right" | null;
		hideOverlap?: boolean;
		customValues?: number[];
	} & EChartsOptionV2TextStyle &
		EChartsOptionV2Border &
		EChartsOptionV2Shadow;
	splitLine?: {
		show?: boolean;
		showMinLine?: boolean;
		showMaxLine?: boolean;
		interval?: number | ((index?: number, value?: string) => boolean);
		lineStyle?: EChartsOptionV2LineStyle;
	};
	minorSplitLine?: {
		show?: boolean;
		lineStyle?: EChartsOptionV2LineStyle;
	};
	splitArea?: {
		show?: boolean;
		interval?: number | ((index?: number, value?: string) => boolean);
		areaStyle?: EChartsOptionV2AreaStyle;
	};
	axisPointer?: {
		show?: boolean;
		type?: "line" | "shadow" | "none";
		snap?: boolean;
		z?: number;
		label?: {
			show?: boolean;
			precision?: number | string;
			formatter?: string | ((params?: any) => string);
			margin?: number;
			overflow?: EChartsOptionV2Overflow;
			ellipsis?: string;
		} & EChartsOptionV2Size &
			EChartsOptionV2Font &
			EChartsOptionV2TextBorder &
			EChartsOptionV2TextShadow &
			EChartsOptionV2Border &
			EChartsOptionV2Shadow;
		lineStyle?: EChartsOptionV2LineStyle;
		shadowStyle?: {
			color?: Color;
			opacity?: number;
		} & EChartsOptionV2Shadow;
		triggerEmphasis?: boolean;
		triggerTooltip?: boolean;
		value?: number;
		status?: "show" | "hide";
		handle?: EChartsOptionV2Handle;
	};
	tooltip?: {
		show?: boolean;
		position?: string | (string | number)[];
		formatter?: string | ((params?: any) => string);
		backgroundColor?: Color;
		padding?: number | number[];
		textStyle?: EChartsOptionV2TextStyle;
		extraCssText?: string;
	} & EChartsOptionV2Border;
	zlevel?: number;
	z?: number;
	data?: (
		| string
		| {
				value?: string;
				textStyle?: EChartsOptionV2TextStyle;
		  }
	)[];
} & EChartsOptionV2Name &
	EChartsOptionV2Animation;
export type EChartsOptionV2 = EChartsOption & {
	title?: {
		id?: string | null;
		show?: boolean;
		text?: string;
		link?: string;
		target?: EChartsOptionV2Target;
		textStyle?: EChartsOptionV2TextStyle;
		subtext?: string;
		sublink?: string;
		subtarget?: EChartsOptionV2Target;
		subtextStyle?: EChartsOptionV2TextStyle;
		textAlign?: "auto" | "left" | "right" | "center";
		textVerticalAlign?: "auto" | "top" | "bottom" | "middle";
		triggerEvent?: boolean;
		padding?: number | number[];
		itemGap?: number;
		zlevel?: number;
		z?: number;
		backgroundColor?: Color;
	} & EChartsOptionV2Position &
		EChartsOptionV2Border &
		EChartsOptionV2Shadow &
		EChartsOptionV2CoordinateSystem;
	legend?: {
		type?: "plain" | "scroll";
		id?: string | null;
		show?: boolean;
		zlevel?: number;
		z?: number;
		orient?: EChartsOptionV2VOrient;
		align?: EChartsOptionV2Align;
		padding?: number | number[];
		itemGap?: number;
		itemWidth?: number;
		itemHeight?: number;
		itemStyle?: {
			decal?: EChartsOptionV2Decal;
		} & EChartsOptionV2ItemStyle;
		lineStyle?: EChartsOptionV2LineStyle;
		symbolRotate?: "inherit" | number;
		formatter?: string | ((params?: any) => string);
		selectedMode?: boolean | "single" | "multiple";
		inactiveColor?: Color;
		inactiveBorderColor?: Color;
		inactiveBorderWidth?: "auto" | "inherit" | number;
		selected?: Record<string, boolean>;
		textStyle?: EChartsOptionV2TextStyle & EChartsOptionV2Border & EChartsOptionV2Shadow;
		tooltip?: EChartsOptionV2Tooltip;
		icon?: EChartsOptionV2Symbol;
		data?: (
			| string
			| ({
					name?: string;
					icon?: EChartsOptionV2Symbol;
					itemStyle?: {
						decal?: EChartsOptionV2Decal;
					} & EChartsOptionV2ItemStyle;
					lineStyle?: EChartsOptionV2LineStyle;
					symbolRotate?: "inherit" | number;
					inactiveColor?: Color;
					inactiveBorderColor?: Color;
					inactiveBorderWidth?: "auto" | "inherit" | number;
					textStyle?: EChartsOptionV2TextStyle;
					backgroundColor?: Color;
					scrollDataIndex?: number;
					pageButtonItemGap?: number;
					pageButtonGap?: number;
					pageButtonPosition?: "start" | "end";
					pageFormatter?: string | ((params?: any) => string);
					pageIcons?: {
						horizontal?: string[];
						vertical?: string[];
					};
					pageIconColor?: string;
					pageIconInactiveColor?: string;
					pageIconSize?: number | number[];
					pageTextStyle?: EChartsOptionV2TextStyle;
					animation?: boolean;
					animationDurationUpdate?: number;
					emphasis?: {
						selectorLabel?: EChartsOptionV2Label;
					};
					selector?: boolean | string[] | { type?: "all" | "inverse"; title?: string }[];
					selectorLabel?: EChartsOptionV2Label;
					selectorPosition?: "auto" | "start" | "end";
					selectorItemGap?: number;
					selectorButtonGap?: number;
					triggerEvent?: boolean;
			  } & EChartsOptionV2Border &
					EChartsOptionV2Shadow)
		)[];
	} & EChartsOptionV2Position &
		EChartsOptionV2Size &
		EChartsOptionV2CoordinateSystem;
	grid?: {
		id?: string;
		show?: boolean;
		zlevel?: number;
		z?: number;
		containLabel?: boolean;
		outerBoundsMode?: "auto" | "none" | "same";
		outerBounds?: EChartsOptionV2Position & EChartsOptionV2Size;
		outerBoundsContain?: "auto" | "all" | "axisLabel";
		backgroundColor?: Color;
		tooltip?: {
			show?: boolean;
			trigger?: "item" | "axis" | "none";
			axisPointer?: EChartsOptionV2TooltipAxisPointer;
			position?: string | (string | number)[];
			formatter?: string | ((params?: any) => string);
			valueFormatter?: string | ((value?: number | string, dataIndex?: number) => string);
			backgroundColor?: Color;
			padding?: number | number[];
			textStyle?: EChartsOptionV2TextStyle;
			extraCssText?: string;
		};
	} & EChartsOptionV2Position &
		EChartsOptionV2Size &
		EChartsOptionV2Border &
		EChartsOptionV2Shadow &
		EChartsOptionV2CoordinateSystem;
	xAxis?: EChartsOptionV2Axis;
	yAxis?: EChartsOptionV2Axis;
	polar?: {
		id?: string;
		zlevel?: number;
		z?: number;
		center?: (number | string)[];
		radius?: number | string | (number | string)[];
		tooltip?: {
			show?: boolean;
			trigger?: "item" | "axis" | "none";
			axisPointer?: EChartsOptionV2TooltipAxisPointer;
			position?: string | (string | number)[];
			formatter?: string | ((params?: any) => string);
			valueFormatter?: string | ((value?: number | string, dataIndex?: number) => string);
			backgroundColor?: Color;
			padding?: number | number[];
			textStyle?: EChartsOptionV2TextStyle;
			extraCssText?: string;
		} & EChartsOptionV2Border;
	} & EChartsOptionV2CoordinateSystem;
	radiusAxis?: {
		id?: string;
		polarIndex?: number;
		type?: "value" | "category" | "time" | "log";
		inverse?: boolean;
		boundaryGap?: boolean | string[];
		min?: number | string | ((params?: any) => number);
		max?: number | string | ((params?: any) => number);
		scale?: boolean;
		splitNumber?: number;
		minInterval?: number;
		maxInterval?: number;
		interval?: number;
		logBase?: number;
		startValue?: number;
		silent?: boolean;
		triggerEvent?: boolean;
		axisLine?: {
			show?: boolean;
			symbol?: EChartsOptionV2Symbol | EChartsOptionV2Symbol[];
			symbolSize?: number[];
			symbolOffset?: number[];
			lineStyle?: EChartsOptionV2LineStyle;
		};
		axisTick?: {
			show?: boolean;
			alignWithLabel?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			inside?: boolean;
			length?: number;
			lineStyle?: EChartsOptionV2LineStyle;
			customValues?: number[];
		};
		minorTick?: {
			show?: boolean;
			splitNumber?: number;
			length?: number;
			lineStyle?: EChartsOptionV2LineStyle;
		};
		axisLabel?: {
			show?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			inside?: boolean;
			rotate?: number;
			margin?: number;
			formatter?: string | ((params?: any) => string);
			showMinLabel?: boolean;
			showMaxLabel?: boolean;
			alignMinLabel?: "left" | "center" | "right" | null;
			alignMaxLabel?: "left" | "center" | "right" | null;
			hideOverlap?: boolean;
			customValues?: number[];
		} & EChartsOptionV2TextStyle &
			EChartsOptionV2Border &
			EChartsOptionV2Shadow;
		splitLine?: {
			show?: boolean;
			showMinLine?: boolean;
			showMaxLine?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			lineStyle?: EChartsOptionV2LineStyle;
		};
		minorSplitLine?: {
			show?: boolean;
			lineStyle?: EChartsOptionV2LineStyle;
		};
		splitArea?: {
			show?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			areaStyle?: EChartsOptionV2AreaStyle;
		};
		axisPointer?: {
			show?: boolean;
			type?: "line" | "shadow" | "none";
			snap?: boolean;
			z?: number;
			label?: {
				show?: boolean;
				precision?: number | string;
				formatter?: string | ((params?: any) => string);
				margin?: number;
				overflow?: EChartsOptionV2Overflow;
				ellipsis?: string;
			} & EChartsOptionV2Size &
				EChartsOptionV2Font &
				EChartsOptionV2TextBorder &
				EChartsOptionV2TextShadow &
				EChartsOptionV2Border &
				EChartsOptionV2Shadow;
			lineStyle?: EChartsOptionV2LineStyle;
			shadowStyle?: {
				color?: Color;
				opacity?: number;
			} & EChartsOptionV2Shadow;
			triggerEmphasis?: boolean;
			triggerTooltip?: boolean;
			value?: number;
			status?: "show" | "hide";
			handle?: EChartsOptionV2Handle;
		};
		tooltip?: {
			show?: boolean;
			position?: string | (string | number)[];
			formatter?: string | ((params?: any) => string);
			backgroundColor?: Color;
			padding?: number | number[];
			textStyle?: EChartsOptionV2TextStyle;
			extraCssText?: string;
		} & EChartsOptionV2Border;
		zlevel?: number;
		z?: number;
		data?: {
			value?: string;
			textStyle?: EChartsOptionV2TextStyle;
		}[];
	} & EChartsOptionV2Name &
		EChartsOptionV2Animation;
	angleAxis?: {
		id?: string;
		polarIndex?: number;
		startAngle?: number;
		endAngle?: number;
		clockwise?: boolean;
		type?: "value" | "category" | "time" | "log";
		inverse?: boolean;
		boundaryGap?: boolean | string[];
		min?: number | string | ((params?: any) => number);
		max?: number | string | ((params?: any) => number);
		scale?: boolean;
		splitNumber?: number;
		minInterval?: number;
		maxInterval?: number;
		interval?: number;
		logBase?: number;
		startValue?: number;
		silent?: boolean;
		triggerEvent?: boolean;
		axisLine?: {
			show?: boolean;
			symbol?: EChartsOptionV2Symbol | EChartsOptionV2Symbol[];
			symbolSize?: number[];
			symbolOffset?: number[];
			lineStyle?: EChartsOptionV2LineStyle;
		};
		axisTick?: {
			show?: boolean;
			alignWithLabel?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			inside?: boolean;
			length?: number;
			lineStyle?: EChartsOptionV2LineStyle;
			customValues?: number[];
		};
		minorTick?: {
			show?: boolean;
			splitNumber?: number;
			length?: number;
			lineStyle?: EChartsOptionV2LineStyle;
		};
		axisLabel?: {
			show?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			inside?: boolean;
			rotate?: number;
			margin?: number;
			formatter?: string | ((params?: any) => string);
			showMinLabel?: boolean;
			showMaxLabel?: boolean;
			alignMinLabel?: "left" | "center" | "right" | null;
			alignMaxLabel?: "left" | "center" | "right" | null;
			hideOverlap?: boolean;
			customValues?: number[];
		} & EChartsOptionV2TextStyle &
			EChartsOptionV2Border &
			EChartsOptionV2Shadow;
		splitLine?: {
			show?: boolean;
			showMinLine?: boolean;
			showMaxLine?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			lineStyle?: EChartsOptionV2LineStyle;
		};
		minorSplitLine?: {
			show?: boolean;
			lineStyle?: EChartsOptionV2LineStyle;
		};
		splitArea?: {
			show?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			areaStyle?: EChartsOptionV2AreaStyle;
		};
		axisPointer?: {
			show?: boolean;
			type?: "line" | "shadow" | "none";
			snap?: boolean;
			z?: number;
			label?: {
				show?: boolean;
				precision?: number | string;
				formatter?: string | ((params?: any) => string);
				margin?: number;
				overflow?: EChartsOptionV2Overflow;
				ellipsis?: string;
			} & EChartsOptionV2Size &
				EChartsOptionV2Font &
				EChartsOptionV2TextBorder &
				EChartsOptionV2TextShadow &
				EChartsOptionV2Border &
				EChartsOptionV2Shadow;
			lineStyle?: EChartsOptionV2LineStyle;
			shadowStyle?: {
				color?: Color;
				opacity?: number;
			} & EChartsOptionV2Shadow;
			triggerEmphasis?: boolean;
			triggerTooltip?: boolean;
			value?: number;
			status?: "show" | "hide";
			handle?: EChartsOptionV2Handle;
		};
		tooltip?: {
			show?: boolean;
			position?: string | (string | number)[];
			formatter?: string | ((params?: any) => string);
			backgroundColor?: Color;
			padding?: number | number[];
			textStyle?: EChartsOptionV2TextStyle;
			extraCssText?: string;
		} & EChartsOptionV2Border;
		zlevel?: number;
		z?: number;
		data?: {
			value?: string;
			textStyle?: EChartsOptionV2TextStyle;
		}[];
	} & EChartsOptionV2Name &
		EChartsOptionV2Animation;
	radar?: {
		id?: string;
		zlevel?: number;
		z?: number;
		center?: (number | string)[];
		radius?: (number | string)[];
		startAngle?: number;
		axisName?: {
			show?: boolean;
			formatter?: string | ((params?: any) => string);
			overflow?: EChartsOptionV2Overflow;
			ellipsis?: string;
			rich?: EChartsOptionV2Rich;
			richInheritPlainLabel?: boolean;
		} & EChartsOptionV2Size &
			EChartsOptionV2Font &
			EChartsOptionV2TextBorder &
			EChartsOptionV2TextShadow &
			EChartsOptionV2Border &
			EChartsOptionV2Shadow;
		axisNameGap?: number;
		splitNumber?: number;
		shape?: "polygon" | "circle";
		scale?: boolean;
		silent?: boolean;
		triggerEvent?: boolean;
		axisLine?: {
			show?: boolean;
			symbol?: EChartsOptionV2Symbol | EChartsOptionV2Symbol[];
			symbolSize?: number[];
			symbolOffset?: number[];
			lineStyle?: EChartsOptionV2LineStyle;
		};
		axisTick?: {
			show?: boolean;
			alignWithLabel?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			inside?: boolean;
			length?: number;
			lineStyle?: EChartsOptionV2LineStyle;
			customValues?: number[];
		};
		axisLabel?: {
			show?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			inside?: boolean;
			rotate?: number;
			margin?: number;
			formatter?: string | ((params?: any) => string);
			showMinLabel?: boolean;
			showMaxLabel?: boolean;
			alignMinLabel?: "left" | "center" | "right" | null;
			alignMaxLabel?: "left" | "center" | "right" | null;
			hideOverlap?: boolean;
			customValues?: number[];
		} & EChartsOptionV2TextStyle &
			EChartsOptionV2Border &
			EChartsOptionV2Shadow;
		splitLine?: {
			show?: boolean;
			showMinLine?: boolean;
			showMaxLine?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			lineStyle?: EChartsOptionV2LineStyle;
		};
		splitArea?: {
			show?: boolean;
			interval?: number | ((index?: number, value?: string) => boolean);
			areaStyle?: EChartsOptionV2AreaStyle;
		};
		indicator?: {
			name?: string;
			max?: number;
			min?: number;
			color?: string;
		}[];
	} & EChartsOptionV2CoordinateSystem &
		EChartsOptionV2Name &
		EChartsOptionV2Animation;
	dataZoom?: (
		| {
				type?: "inside";
				id?: string;
				disabled?: boolean;
				xAxisIndex?: number | number[];
				yAxisIndex?: number | number[];
				radiusAxisIndex?: number | number[];
				angleAxisIndex?: number | number[];
				filterMode?: "filter" | "weakFilter" | "empty" | "none";
				start?: number;
				end?: number;
				startValue?: number | string | Date;
				endValue?: number | string | Date;
				minSpan?: number;
				maxSpan?: number;
				minValueSpan?: number | string | Date;
				maxValueSpan?: number | string | Date;
				orient?: EChartsOptionV2VOrient;
				zoomLock?: boolean;
				throttle?: number;
				rangeMode?: string[];
				zoomOnMouseWheel?: boolean | "shift" | "ctrl" | "alt";
				moveOnMouseMove?: boolean | "shift" | "ctrl" | "alt";
				moveOnMouseWheel?: boolean | "shift" | "ctrl" | "alt";
				preventDefaultMouseMove?: boolean;
		  }
		| ({
				type?: "slider";
				id?: string;
				show?: boolean;
				backgroundColor?: Color;
				dataBackground?: {
					lineStyle?: EChartsOptionV2LineStyle;
					areaStyle?: EChartsOptionV2AreaStyle;
				};
				selectedDataBackground?: {
					lineStyle?: EChartsOptionV2LineStyle;
					areaStyle?: EChartsOptionV2AreaStyle;
				};
				fillerColor?: Color;
				disabled?: boolean;
				handleIcon?: EChartsOptionV2Symbol;
				handleSize?: number | string;
				handleStyle?: EChartsOptionV2ItemStyle;
				handleLabel?: {
					show?: boolean;
				};
				moveHandleIcon?: EChartsOptionV2Symbol;
				moveHandleSize?: number | string;
				moveHandleStyle?: EChartsOptionV2ItemStyle;
				labelPrecision?: "auto" | number;
				labelFormatter?: string | ((params?: any) => string);
				showDetail?: boolean;
				showDataShadow?: "auto";
				realtime?: boolean;
				textStyle?: EChartsOptionV2TextStyle;
				xAxisIndex?: number | number[];
				yAxisIndex?: number | number[];
				radiusAxisIndex?: number | number[];
				angleAxisIndex?: number | number[];
				filterMode?: "filter" | "weakFilter" | "empty" | "none";
				start?: number;
				end?: number;
				startValue?: number | string | Date;
				endValue?: number | string | Date;
				minSpan?: number;
				maxSpan?: number;
				minValueSpan?: number | string | Date;
				maxValueSpan?: number | string | Date;
				orient?: EChartsOptionV2VOrient;
				zoomLock?: boolean;
				throttle?: number;
				rangeMode?: string[];
				brushSelect?: boolean;
				brushStyle?: EChartsOptionV2ItemStyle;
				emphasis?: {
					handleStyle?: EChartsOptionV2ItemStyle;
					handleLabel?: {
						show?: boolean;
					};
					moveHandleStyle?: EChartsOptionV2ItemStyle;
				};
		  } & EChartsOptionV2Position &
				EChartsOptionV2Size &
				EChartsOptionV2Border &
				EChartsOptionV2CoordinateSystem)
	)[];
	visualMap?: (
		| ({
				type?: "continuous";
				id?: string;
				min?: number;
				max?: number;
				range?: number[];
				unboundedRange?: boolean;
				calculable?: boolean;
				realtime?: boolean;
				inverse?: boolean;
				precision?: number;
				itemWidth?: number;
				itemHeight?: number;
				align?: "auto" | "left" | "right" | "top" | "bottom";
				text?: string[];
				textGap?: number;
				show?: boolean;
				dimension?: number;
				seriesIndex?: number | string | (number | string)[];
				seriesId?: number | string | (number | string)[];
				hoverLink?: boolean;
				inRange?: any;
				outOfRange?: any;
				controller?: {
					inRange?: any;
					outOfRange?: any;
				};
				zlevel?: number;
				z?: number;
				orient?: EChartsOptionV2VOrient;
				padding?: number | number[];
				backgroundColor?: Color;
				color?: string[];
				textStyle?: EChartsOptionV2TextStyle;
				formatter?: string | ((params?: any) => string);
				handleIcon?: EChartsOptionV2Symbol;
				handleSize?: number | string;
				handleStyle?: EChartsOptionV2ItemStyle;
				indicatorIcon?: EChartsOptionV2Symbol;
				indicatorSize?: number | string;
				indicatorStyle?: EChartsOptionV2ItemStyle;
		  } & EChartsOptionV2Position &
				EChartsOptionV2Border &
				EChartsOptionV2CoordinateSystem)
		| ({
				type?: "piecewise";
				id?: string;
				splitNumber?: number;
				pieces?: any[];
				categories?: string[];
				min?: number;
				max?: number;
				minOpen?: boolean;
				maxOpen?: boolean;
				selectedMode?: "multiple" | "single" | boolean;
				inverse?: boolean;
				precision?: boolean;
				itemWidth?: number;
				itemHeight?: number;
				align?: "auto" | "left" | "right";
				text?: string[];
				textGap?: number;
				showLabel?: boolean;
				itemGap?: number;
				itemSymbol?: EChartsOptionV2Symbol;
				show?: boolean;
				dimension?: number[][];
				seriesIndex?: number | string | (number | string)[];
				seriesId?: number | string | (number | string)[];
				hoverLink?: boolean;
				inRange?: any;
				outOfRange?: any;
				controller?: {
					inRange?: any;
					outOfRange?: any;
				};
				zlevel?: number;
				z?: number;
				orient?: EChartsOptionV2VOrient;
				padding?: number | number[];
				backgroundColor?: Color;
				color?: string[];
				textStyle?: EChartsOptionV2TextStyle;
				formatter?: string | ((params?: any) => string);
		  } & EChartsOptionV2Position &
				EChartsOptionV2Border &
				EChartsOptionV2CoordinateSystem)
	)[];
	tooltip?: EChartsOptionV2Tooltip;
	axisPointer?: {
		id?: string;
		show?: boolean;
		type?: "line" | "shadow" | "none";
		snap?: boolean;
		z?: number;
		label?: {
			show?: boolean;
			precision?: number | string;
			formatter?: string | ((params?: any) => string);
			margin?: number;
			overflow?: EChartsOptionV2Overflow;
			ellipsis?: string;
		} & EChartsOptionV2Size &
			EChartsOptionV2Font &
			EChartsOptionV2TextBorder &
			EChartsOptionV2TextShadow &
			EChartsOptionV2Border &
			EChartsOptionV2Shadow;
		lineStyle?: EChartsOptionV2LineStyle;
		shadowStyle?: {
			color?: Color;
			opacity?: number;
		} & EChartsOptionV2Shadow;
		triggerEmphasis?: boolean;
		triggerTooltip?: boolean;
		value?: number;
		status?: "show" | "hide";
		handle?: EChartsOptionV2Handle;
		link?: any[];
		triggerOn?: string;
	};
	toolbox?: {
		id?: string;
		show?: boolean;
		orient?: EChartsOptionV2VOrient;
		itemSize?: number;
		itemGap?: number;
		showTitle?: boolean;
		feature?: {
			saveAsImage?: {
				type?: "png" | "jpg" | "svg";
				name?: string;
				backgroundColor?: Color;
				connectedBackgroundColor?: Color;
				excludeComponents?: string[];
				show?: boolean;
				title?: string;
				icon?: EChartsOptionV2Symbol;
				iconStyle?: EChartsOptionV2ItemStyle;
				emphasis?: {
					iconStyle?: EChartsOptionV2EmphasisIconStyle;
				};
				pixelRatio?: number;
			};
			restore?: {
				show?: boolean;
				title?: string;
				icon?: EChartsOptionV2Symbol;
				iconStyle?: EChartsOptionV2ItemStyle;
				emphasis?: {
					iconStyle?: EChartsOptionV2EmphasisIconStyle;
				};
			};
			dataView?: {
				show?: boolean;
				title?: string;
				icon?: EChartsOptionV2Symbol;
				iconStyle?: EChartsOptionV2ItemStyle;
				emphasis?: {
					iconStyle?: EChartsOptionV2EmphasisIconStyle;
				};
				readOnly?: boolean;
				optionToContent?: (option?: any) => string;
				contentToOption?: (container?: HTMLDomElement, option?: any) => any;
				lang?: string[];
				backgroundColor?: string;
				textareaColor?: string;
				textareaBorderColor?: string;
				textColor?: string;
				buttonColor?: string;
				buttonTextColor?: string;
			};
			dataZoom?: {
				show?: boolean;
				title?: {
					zoom?: string;
					back?: string;
				};
				title?: {
					zoom?: string;
					back?: string;
				};
				iconStyle?: EChartsOptionV2ItemStyle;
				emphasis?: {
					iconStyle?: EChartsOptionV2EmphasisIconStyle;
				};
				filterMode?: "filter";
				xAxisIndex?: number | number[];
				yAxisIndex?: number | number[];
				brushStyle?: EChartsOptionV2ItemStyle;
			};
			magicType?: {
				show?: boolean;
				type?: string[];
				title?: {
					line?: string;
					bar?: string;
					stack?: string;
					tiled?: string;
				};
				icon?: {
					line?: EChartsOptionV2Symbol;
					bar?: EChartsOptionV2Symbol;
					stack?: EChartsOptionV2Symbol;
				};
				iconStyle?: EChartsOptionV2ItemStyle;
				emphasis?: {
					iconStyle?: EChartsOptionV2EmphasisIconStyle;
				};
				option?: {
					line?: any;
					bar?: any;
					stack?: any;
				};
				seriesIndex?: {
					line?: number | string | (number | string)[];
					bar?: number | string | (number | string)[];
				};
			};
			brush?: {
				type?: "rect" | "polygon" | "lineX" | "lineY" | "keep" | "clear";
				icon?: {
					rect?: EChartsOptionV2Symbol;
					polygon?: EChartsOptionV2Symbol;
					lineX?: EChartsOptionV2Symbol;
					lineY?: EChartsOptionV2Symbol;
					keep?: EChartsOptionV2Symbol;
					clear?: EChartsOptionV2Symbol;
				};
				title?: {
					rect?: string;
					polygon?: string;
					lineX?: string;
					lineY?: string;
					keep?: string;
					clear?: string;
				};
			};
		};
		iconStyle?: EChartsOptionV2ItemStyle;
		emphasis?: {
			iconStyle?: EChartsOptionV2EmphasisIconStyle;
		};
		zlevel?: number;
		z?: number;
		tooltip?: EChartsOptionV2Tooltip;
	} & EChartsOptionV2Position &
		EChartsOptionV2Size &
		EChartsOptionV2CoordinateSystem;
	brush?: {
		id?: string;
		toolbox?: ("rect" | "polygon" | "lineX" | "lineY" | "keep" | "clear")[];
		brushLink?: "all" | number[] | null;
		seriesIndex?: number | string | (number | string)[];
		geoIndex?: number | string | (number | string)[];
		xAxisIndex?: number | string | (number | string)[];
		yAxisIndex?: number | string | (number | string)[];
		brushType?: "rect" | "polygon" | "lineX" | "lineY";
		brushMode?: "single" | "multiple";
		transformable?: boolean;
		brushStyle?: any;
		throttleType?: "debounce" | "fixRate";
		throttleDelay?: number;
		removeOnClick?: boolean;
		inBrush?: any;
		outOfBrush?: any;
		z?: number;
	};
	geo?: {
		id?: string;
		show?: boolean;
		map?: string;
		projection?: {
			project?: (coord?: [number, number]) => [number, number];
			unproject?: (point?: [number, number]) => [number, number];
			stream?: Function;
		};
		center?: (number | string)[];
		zoom?: number;
		scaleLimit?: {
			min?: number;
			max?: number;
		};
		roam?: boolean | "scale" | "zoom" | "move" | "pan";
		roamTrigger?: "selfRect" | "global";
		aspectScale?: number;
		boundingCoords?: number[][];
		nameMap?: Record<string, string>;
		nameProperty?: any[];
		selectedMode?: boolean;
		label?: {
			position?: stirng | (string | number)[];
			formatter?: string | ((params?: any) => string);
		} & EChartsOptionV2Label;
		itemStyle?: {
			areaColor?: Color;
		} & EChartsOptionV2ItemStyle;
		emphasis?: {
			disabled?: boolean;
			focus?: "none" | "self";
			label?: {
				position?: stirng | (string | number)[];
				formatter?: string | ((params?: any) => string);
			} & EChartsOptionV2Label;
			itemStyle?: {
				areaColor?: Color;
			} & EChartsOptionV2ItemStyle;
		};
		select?: {
			disabled?: boolean;
			label?: {
				position?: stirng | (string | number)[];
				formatter?: string | ((params?: any) => string);
			} & EChartsOptionV2Label;
			itemStyle?: {
				areaColor?: Color;
			} & EChartsOptionV2ItemStyle;
		};
		blur?: {
			label?: {
				position?: stirng | (string | number)[];
				formatter?: string | ((params?: any) => string);
			} & EChartsOptionV2Label;
			itemStyle?: {
				areaColor?: Color;
			} & EChartsOptionV2ItemStyle;
		};
		zlevel?: number;
		z?: number;
		layoutCenter?: (stirng | number)[];
		layoutSize?: string | number;
		preserveAspect?: boolean | string;
		preserveAspectAlign?: string;
		preserveAspectVerticalAlign?: string;
		clip?: boolean;
		regions?: {
			name?: string;
			selected?: boolean;
			itemStyle?: {
				areaColor?: Color;
			} & EChartsOptionV2ItemStyle;
			emphasis?: {
				disabled?: boolean;
				focus?: "none" | "self";
				label?: {
					position?: stirng | (string | number)[];
					formatter?: string | ((params?: any) => string);
				} & EChartsOptionV2Label;
				itemStyle?: {
					areaColor?: Color;
				} & EChartsOptionV2ItemStyle;
			};
			select?: {
				disabled?: boolean;
				label?: {
					position?: stirng | (string | number)[];
					formatter?: string | ((params?: any) => string);
				} & EChartsOptionV2Label;
				itemStyle?: {
					areaColor?: Color;
				} & EChartsOptionV2ItemStyle;
			};
			blur?: {
				label?: {
					position?: stirng | (string | number)[];
					formatter?: string | ((params?: any) => string);
				} & EChartsOptionV2Label;
				itemStyle?: {
					areaColor?: Color;
				} & EChartsOptionV2ItemStyle;
			};
			silent?: boolean;
			tooltip?: {
				show?: boolean;
				position?: string | (string | number)[];
				formatter?: string | ((params?: any) => string);
				backgroundColor?: Color;
				padding?: number | number[];
				textStyle?: EChartsOptionV2TextStyle;
				extraCssText?: string;
			} & EChartsOptionV2Border;
		}[];
		silent?: boolean;
		tooltip?: {
			show?: boolean;
			position?: string | (string | number)[];
			formatter?: string | ((params?: any) => string);
			backgroundColor?: Color;
			padding?: number | number[];
			textStyle?: EChartsOptionV2TextStyle;
			extraCssText?: string;
		} & EChartsOptionV2Border;
	} & EChartsOptionV2Position &
		EChartsOptionV2Size &
		EChartsOptionV2CoordinateSystem;
	// ...
	series?: [
		{
			type?: "bar";
			id?: string;
			name?: string;
			colorBy?: "series" | "data";
			legendHoverLink?: boolean;
			xAxisIndex?: number;
			xAxisId?: string | null;
			yAxisIndex?: number;
			yAxisId?: string | null;
			polarIndex?: number;
			polarId?: string | null;
			roundCap?: boolean;
			realtimeSort?: boolean;
			showBackground?: boolean;
			backgroundStyle?: {
				color?: Color;
				opacity?: number;
			} & EChartsOptionV2Border &
				EChartsOptionV2Shadow;
			label?: {
				textMargin?: number | number[];
				minMargin?: number;
				formatter?: string | ((params?: any) => string);
			} & EChartsOptionV2Label;
			lableLine?: {
				show?: boolean;
				lineStyle?: EChartsOptionV2LineStyle;
			};
			itemStyle?: EChartsOptionV2ItemStyle;
			labelLayout?: {
				hideOverlap?: boolean;
				moveOverlap?: string;
				x?: number | string;
				y?: number | string;
				dx?: number;
				dy?: number;
				rotate?: number;
				align?: EChartsOptionV2Align;
				verticalAlign?: EChartsOptionV2VerticalAlign;
				fontSize?: number;
				draggable?: boolean;
				labelLinePoints?: number[][];
			} & EChartsOptionV2Size;
			emphasis?: {
				disabled?: boolean;
				focus?: "none" | "self";
				blurScope?: "coordinateSystem" | "series" | "global";
				label?: {
					formatter?: string | ((params?: any) => string);
				} & EChartsOptionV2Label;
				lableLine?: {
					show?: boolean;
					lineStyle?: EChartsOptionV2LineStyle;
				};
				itemStyle?: EChartsOptionV2ItemStyle;
			};
			select?: {
				disabled?: boolean;
				label?: {
					formatter?: string | ((params?: any) => string);
				} & EChartsOptionV2Label;
				lableLine?: {
					show?: boolean;
					lineStyle?: EChartsOptionV2LineStyle;
				};
				itemStyle?: EChartsOptionV2ItemStyle;
			};
			blur?: {
				disabled?: boolean;
				label?: {
					formatter?: string | ((params?: any) => string);
				} & EChartsOptionV2Label;
				lableLine?: {
					show?: boolean;
					lineStyle?: EChartsOptionV2LineStyle;
				};
				itemStyle?: EChartsOptionV2ItemStyle;
			};
			selectedMode?: boolean | string;
			stack?: "value" | "log";
			stackStrategy?: "samesign" | "all" | "positive" | "negative";
			stackOrder?: "seriesAsc" | "seriesDesc";
			sampling?: "lttb" | "average" | "min" | "max" | "minmax" | "sum";
			cursor?: string;
			barWidth?: number | string;
			barMaxWidth?: number | string;
			barMinWidth?: number | string;
			barMinHeight?: number;
			barMinAngle?: number;
			barGap?: string;
			barCategoryGap?: number | string;
			large?: boolean;
			largeThreshold?: number;
			progressive?: number;
			progressiveThreshold?: number;
			progressiveChunkMode?: "sequential" | "mod";
			dimensions?: any[];
			encode?: any;
			seriesLayoutBy?: "column" | "row";
			datasetIndex?: number;
			dataGroupId?: string;
			clip?: boolean;
			markPoint?: {
				symbol?: EChartsOptionV2Symbol;
				symbolSize?: number;
				symbolKeepAspect?: boolean;
				symbolOffset?: (number | string)[];
				silent?: boolean;
				label?: {
					formatter?: string | ((params?: any) => string);
				} & EChartsOptionV2Label;
				itemStyle?: EChartsOptionV2ItemStyle;
				emphasis?: {
					disabled?: boolean;
					label?: {
						formatter?: string | ((params?: any) => string);
					} & EChartsOptionV2Label;
					itemStyle?: EChartsOptionV2ItemStyle;
				};
				blur?: {
					disabled?: boolean;
					label?: {
						formatter?: string | ((params?: any) => string);
					} & EChartsOptionV2Label;
					itemStyle?: EChartsOptionV2ItemStyle;
				};
				z?: number;
				data?: {
					name?: string;
					type?: "min" | "max" | "average";
					valueIndex?: number;
					valueDim?: string;
					coord?: Array | number | string;
					x?: number;
					y?: number;
					z2?: number;
					relativeTo?: string;
					value?: number;
					symbol?: EChartsOptionV2Symbol;
					symbolSize?: number | number[];
					symbolRotate?: number;
					symbolKeepAspect?: boolean;
					symbolOffset?: number[];
					label?: {
						position?: stirng | (string | number)[];
						formatter?: string | ((params?: any) => string);
					} & EChartsOptionV2Label;
					itemStyle?: EChartsOptionV2ItemStyle;
					emphasis?: {
						disabled?: boolean;
						label?: {
							position?: stirng | (string | number)[];
							formatter?: string | ((params?: any) => string);
						} & EChartsOptionV2Label;
						itemStyle?: EChartsOptionV2ItemStyle;
					};
				}[];
			} & EChartsOptionV2Animation;
			markLine?: {
				silent?: boolean;
				symbol?: EChartsOptionV2Symbol;
				symbolSize?: number;
				symbolOffset?: (number | string)[];
				precision?: number;
				label?: {
					formatter?: string | ((params?: any) => string);
				} & EChartsOptionV2Label;
				lineStyle?: {
					curveness?: number;
				} & EChartsOptionV2LineStyle;
				emphasis?: {
					disabled?: boolean;
					label?: {
						formatter?: string | ((params?: any) => string);
					} & EChartsOptionV2Label;
					lineStyle?: {
						curveness?: number;
					} & EChartsOptionV2LineStyle;
				};
				blur?: {
					label?: {
						formatter?: string | ((params?: any) => string);
					} & EChartsOptionV2Label;
					lineStyle?: {
						curveness?: number;
					} & EChartsOptionV2LineStyle;
				};
				z?: number;
				data?: Record<
					0 | 1,
					{
						type?: "min" | "max" | "average" | "median";
						valueIndex?: number;
						valueDim?: string;
						coord?: Array | number | string;
						x?: number;
						y?: number;
						z2?: number;
						xAxis?: number | string;
						yAxis?: number | string;
						value?: number;
						symbol?: EChartsOptionV2Symbol;
						symbolSize?: number | number[];
						symbolRotate?: number;
						symbolKeepAspect?: boolean;
						symbolOffset?: number[];
						label?: {
							position?: stirng | (string | number)[];
							formatter?: string | ((params?: any) => string);
						} & EChartsOptionV2Label;
						lineStyle?: {
							curveness?: number;
						} & EChartsOptionV2LineStyle;
						emphasis?: {
							disabled?: boolean;
							label?: {
								position?: stirng | (string | number)[];
								formatter?: string | ((params?: any) => string);
							} & EChartsOptionV2Label;
							lineStyle?: {
								curveness?: number;
							} & EChartsOptionV2LineStyle;
						};
						blur?: {
							label?: {
								position?: stirng | (string | number)[];
								formatter?: string | ((params?: any) => string);
							} & EChartsOptionV2Label;
							lineStyle?: {
								curveness?: number;
							} & EChartsOptionV2LineStyle;
						};
					}
				>;
			} & EChartsOptionV2Animation;
			markArea?: {
				silent?: boolean;
				label?: {
					formatter?: string | ((params?: any) => string);
				} & EChartsOptionV2Label;
				itemStyle?: EChartsOptionV2ItemStyle;
				emphasis?: {
					disabled?: boolean;
					label?: {
						formatter?: string | ((params?: any) => string);
					} & EChartsOptionV2Label;
					itemStyle?: EChartsOptionV2ItemStyle;
				};
				blur?: {
					label?: {
						formatter?: string | ((params?: any) => string);
					} & EChartsOptionV2Label;
					itemStyle?: EChartsOptionV2ItemStyle;
				};
				z?: number;
				data?: Record<
					0 | 1,
					{
						type?: "min" | "max" | "average";
						valueIndex?: number;
						valueDim?: string;
						coord?: Array | number | string;
						x?: number;
						y?: number;
						z2?: number;
						value?: number;
						label?: {
							position?: stirng | (string | number)[];
							formatter?: string | ((params?: any) => string);
						} & EChartsOptionV2Label;
						itemStyle?: EChartsOptionV2ItemStyle;
						emphasis?: {
							disabled?: boolean;
							label?: {
								position?: stirng | (string | number)[];
								formatter?: string | ((params?: any) => string);
							} & EChartsOptionV2Label;
							itemStyle?: EChartsOptionV2ItemStyle;
						};
						blur?: {
							label?: {
								position?: stirng | (string | number)[];
								formatter?: string | ((params?: any) => string);
							} & EChartsOptionV2Label;
							itemStyle?: EChartsOptionV2ItemStyle;
						};
					}
				>;
			} & EChartsOptionV2Animation;
			universalTransition?: {
				enabled?: boolean;
				seriesKey?: string[];
				divideShape?: "split" | "clone";
				delay?: (index?: number, count?: number) => number;
			};
			tooltip?: {
				show?: boolean;
				position?: string | (string | number)[];
				formatter?: string | ((params?: any) => string);
				backgroundColor?: Color;
				padding?: number | number[];
				textStyle?: EChartsOptionV2TextStyle;
				extraCssText?: string;
			} & EChartsOptionV2Border;
			data?:
				| number[]
				| number[][]
				| {
						name?: string;
						value?: number;
						groupId?: string;
						childGroupId?: string;
						label?: {
							position?: string | (string | number)[];
							textMargin?: number | number[];
							minMargin?: number;
							formatter?: string | ((params?: any) => string);
						} & EChartsOptionV2Label;
						labelLine?: {
							show?: boolean;
						} & EChartsOptionV2LineStyle;
						itemStyle?: {
							decal?: EChartsOptionV2Decal;
						} & EChartsOptionV2ItemStyle;
						emphasis?: {
							disabled?: boolean;
							label?: {
								position?: string | (string | number)[];
								textMargin?: number | number[];
								minMargin?: number;
								formatter?: string | ((params?: any) => string);
							} & EChartsOptionV2Label;
							labelLine?: {
								show?: boolean;
							} & EChartsOptionV2LineStyle;
							itemStyle?: {
								decal?: EChartsOptionV2Decal;
							} & EChartsOptionV2ItemStyle;
						};
						blur?: {
							label?: {
								position?: string | (string | number)[];
								textMargin?: number | number[];
								minMargin?: number;
								formatter?: string | ((params?: any) => string);
							} & EChartsOptionV2Label;
							labelLine?: {
								show?: boolean;
							} & EChartsOptionV2LineStyle;
							itemStyle?: {
								decal?: EChartsOptionV2Decal;
							} & EChartsOptionV2ItemStyle;
						};
						select?: {
							disabled?: boolean;
							label?: {
								position?: string | (string | number)[];
								textMargin?: number | number[];
								minMargin?: number;
								formatter?: string | ((params?: any) => string);
							} & EChartsOptionV2Label;
							labelLine?: {
								show?: boolean;
							} & EChartsOptionV2LineStyle;
							itemStyle?: {
								decal?: EChartsOptionV2Decal;
							} & EChartsOptionV2ItemStyle;
						};
						clip?: boolean;
				  }[];
		} & EChartsOptionV2CoordinateSystem
		// ...
	];
	darkMode?: boolean;
	color?: string[];
	backgroundColor?: Color;
	textStyle?: EChartsOptionV2TextStyle;
	stateAnimation?: {
		duration?: number;
		easing?: string;
	};
	blendMode?: string;
	hoverLayerThreshold?: number;
	useUTC?: boolean;
	richInheritPlainLabel?: boolean;
	options?: any;
	media?: {
		query?: {
			minWidth?: number | null;
			maxWidth?: number | null;
			minAspectRatio?: number | null;
		};
		option?: any;
	}[];
} & EChartsOptionV2Animation;
