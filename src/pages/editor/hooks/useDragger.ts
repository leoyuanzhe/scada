import { reactive } from "vue";
import { useClient } from "@/stores/useClient";
import { useAsset } from "@/stores/useAsset";
import { useSchema } from "@/stores/useSchema";
import type { Component } from "@/types/Component";
import { deepClone } from "@/utils/conversion";
import { useTargetComponent } from "@/hooks/useTargetComponent";

// 框选器
const selector = reactive({
	left: 0,
	top: 0,
	width: 0,
	height: 0,
});
// 吸附对齐线
const alignLine = reactive({
	v: null as number | null,
	h: null as number | null,
});
const propertyDragstart = (e: DragEvent, assetId: string) => {
	const assetStore = useAsset();
	const item = assetStore.assets.find((v) => v.id === assetId);
	if (item) {
		e.dataTransfer?.setData("assetId", item.id);
	}
};
const rendererWheel = (e: WheelEvent) => {
	const clientStore = useClient();
	if (e.ctrlKey) {
		e.preventDefault();
		if (e.deltaY > 0) {
			clientStore.canvas.scale = Math.max(clientStore.canvas.scale - 0.1, 0.1);
		} else {
			clientStore.canvas.scale = Math.min(clientStore.canvas.scale + 0.1, 5);
		}
		computedSelector();
	}
};
const rendererMousedown = (e: MouseEvent) => {
	const clientStore = useClient();
	const schemaStore = useSchema();
	const targetComponent = useTargetComponent();
	const oRenderer = document.querySelector<HTMLDivElement>(".renderer");
	const offsetX = e.pageX - oRenderer!.offsetLeft; // 选择器的offsetX
	const offsetY = e.pageY - oRenderer!.offsetTop;
	if (clientStore.spaceKey) {
		// 移动画布
		document.body.addEventListener("mousemove", mousemove);
		document.body.addEventListener("mouseup", mouseup);
		function mousemove(e: MouseEvent) {
			clientStore.canvas.left += e.movementX;
			clientStore.canvas.top += e.movementY;
			computedSelector();
		}
		function mouseup() {
			document.body.removeEventListener("mousemove", mousemove);
			document.body.removeEventListener("mouseup", mouseup);
		}
	} else if (offsetX < selector.left || offsetX > selector.left + selector.width || offsetY < selector.top || offsetY > selector.top + selector.height) {
		// 鼠标不在选择区域内（框选）
		const startX = e.clientX; // 鼠标按下时的X坐标
		const startY = e.clientY;
		let left = offsetX; // 选择器的Left
		let top = offsetY;
		let width = 0; // 选择器的Width
		let height = 0;
		selector.left = 0;
		selector.top = 0;
		selector.width = 0;
		selector.height = 0;
		schemaStore.flatComponents.forEach((v) => v.active && (v.active = false));
		targetComponent.componentId.value = "";
		document.body.addEventListener("mousemove", mousemove);
		document.body.addEventListener("mouseup", mouseup);
		function mousemove(e: MouseEvent) {
			const moveX = e.clientX - startX; // 移动的X轴距离
			const moveY = e.clientY - startY;
			// 鼠标向左框选
			if (e.clientX < startX) {
				left = offsetX - -moveX;
				width = -moveX;
			} else {
				width = moveX;
			}
			if (e.clientY < startY) {
				top = offsetY - -moveY;
				height = -moveY;
			} else {
				height = moveY;
			}
			selector.left = left;
			selector.top = top;
			selector.width = width;
			selector.height = height;
		}
		function mouseup(e: MouseEvent) {
			if (!e.shiftKey) {
				schemaStore.flatComponents.forEach((v) => v.active && (v.active = false));
			}
			// 正框选（从左往右框选）
			if (startX < e.clientX) {
				schemaStore.moveableComponents.forEach((component) => {
					const left = getActualLeft(component.layout.left);
					const top = getActualTop(component.layout.top);
					const width = getScaledOffset(component.layout.width);
					const height = getScaledOffset(component.layout.height);
					if (left >= selector.left && left + width <= selector.left + selector.width && top >= selector.top && top + height <= selector.top + selector.height) {
						component.active = true;
					}
				});
			} else {
				schemaStore.moveableComponents.forEach((component) => {
					const left = getActualLeft(component.layout.left);
					const top = getActualTop(component.layout.top);
					const width = getScaledOffset(component.layout.width);
					const height = getScaledOffset(component.layout.height);
					if (left < selector.left + selector.width && left + width > selector.left && top < selector.top + selector.height && top + height > selector.top) {
						component.active = true;
					}
				});
			}
			computedSelector();
			document.body.removeEventListener("mousemove", mousemove);
			document.body.removeEventListener("mouseup", mouseup);
		}
	} else {
		// 移动组件
		const startX = e.clientX; // 鼠标按下时的X坐标
		const startY = e.clientY;
		const startSelectorLeft = selector.left;
		const startSelectorTop = selector.top;
		const snapLines = {
			v: [
				getActualLeft(0),
				getActualLeft(schemaStore.layout.width / 2),
				getActualLeft(schemaStore.layout.width),
				...schemaStore.unactiveMoveableComponents.flatMap((v) => [getActualLeft(v.layout.left), getActualLeft(v.layout.left + v.layout.width / 2), getActualLeft(v.layout.left + v.layout.width)]),
			],
			h: [
				getActualTop(0),
				getActualTop(schemaStore.layout.height / 2),
				getActualTop(schemaStore.layout.height),
				...schemaStore.unactiveMoveableComponents.flatMap((v) => [getActualTop(v.layout.top), getActualTop(v.layout.top + v.layout.height / 2), getActualTop(v.layout.top + v.layout.height)]),
			],
		}; // 吸附线
		const startActiveComponentsPosition = schemaStore.activeMoveableComponents.map((v) => ({ left: getActualLeft(v.layout.left), top: getActualTop(v.layout.top) })); // 激活组件拖拽开始时的坐标
		document.body.addEventListener("mousemove", mousemove);
		document.body.addEventListener("mouseup", mouseup);
		function mousemove(e: MouseEvent) {
			const moveX = e.clientX - startX; // 移动的X轴距离
			const dragLeft = startSelectorLeft + moveX; // 拖拽后的相对于渲染器的left值
			const leftV = snapLines.v.find((v) => Math.abs(v - dragLeft) < clientStore.snap.distance); // 组件的左边定位到的垂直吸附线
			const middleV = snapLines.v.find((v) => Math.abs(v - dragLeft - selector.width / 2) < clientStore.snap.distance);
			const rightV = snapLines.v.find((v) => Math.abs(v - dragLeft - selector.width) < clientStore.snap.distance);
			if (leftV !== undefined) {
				const left = getLogicalLeft(leftV); // 将吸附线left值转换为画布的left值
				schemaStore.activeMoveableComponents.forEach((component, index) => {
					component.layout.left = getUnscaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
				});
				alignLine.v = left;
			} else if (middleV !== undefined) {
				const middle = getLogicalLeft(middleV);
				const left = middle - getUnscaledOffset(selector.width / 2);
				schemaStore.activeMoveableComponents.forEach((component, index) => {
					component.layout.left = getUnscaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
				});
				alignLine.v = middle;
			} else if (rightV !== undefined) {
				const right = getLogicalLeft(rightV);
				const left = right - getUnscaledOffset(selector.width);
				schemaStore.activeMoveableComponents.forEach((component, index) => {
					component.layout.left = getUnscaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
				});
				alignLine.v = right;
			} else {
				const logicalDragLeft = getLogicalLeft(dragLeft); // 将当前位置转换为逻辑坐标（未缩放）
				const snappedLogicalLeft = getNearestGridLinePosition(logicalDragLeft); // 获取最接近的网格线位置（逻辑坐标）
				schemaStore.activeMoveableComponents.forEach((component, index) => {
					const originalLeft = getLogicalLeft(startActiveComponentsPosition[index].left);
					component.layout.left = originalLeft + (snappedLogicalLeft - getLogicalLeft(startSelectorLeft));
				});
				alignLine.v = null;
			}
			const moveY = e.clientY - startY;
			const dragTop = startSelectorTop + moveY; // 拖拽后的相对于渲染器的left值
			const topH = snapLines.h.find((v) => Math.abs(v - dragTop) < clientStore.snap.distance); // 组件的左边定位到的垂直吸附线
			const middleH = snapLines.h.find((v) => Math.abs(v - dragTop - selector.height / 2) < clientStore.snap.distance);
			const bottomH = snapLines.h.find((v) => Math.abs(v - dragTop - selector.height) < clientStore.snap.distance);
			if (topH !== undefined) {
				const top = getLogicalTop(topH); // 将吸附线left值转换为画布的left值
				schemaStore.activeMoveableComponents.forEach((component, index) => {
					component.layout.top = getUnscaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
				});
				alignLine.h = top;
			} else if (middleH !== undefined) {
				const middle = getLogicalTop(middleH);
				const top = middle - getUnscaledOffset(selector.height / 2);
				schemaStore.activeMoveableComponents.forEach((component, index) => {
					component.layout.top = getUnscaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
				});
				alignLine.h = middle;
			} else if (bottomH !== undefined) {
				const right = getLogicalTop(bottomH);
				const top = right - getUnscaledOffset(selector.height);
				schemaStore.activeMoveableComponents.forEach((component, index) => {
					component.layout.top = getUnscaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
				});
				alignLine.h = right;
			} else {
				const logicalDragTop = getLogicalTop(dragTop);
				const snappedLogicalTop = getNearestGridLinePosition(logicalDragTop);
				schemaStore.activeMoveableComponents.forEach((component, index) => {
					const originalTop = getLogicalTop(startActiveComponentsPosition[index].top);
					component.layout.top = originalTop + (snappedLogicalTop - getLogicalTop(startSelectorTop));
				});
				alignLine.h = null;
			}
			computedSelector();
		}
		function mouseup() {
			document.body.removeEventListener("mousemove", mousemove);
			document.body.removeEventListener("mouseup", mouseup);
			alignLine.v = null;
			alignLine.h = null;
		}
	}
};
const canvasDrap = (e: DragEvent) => {
	const assetStore = useAsset();
	const schemaStore = useSchema();
	const assetId = e.dataTransfer?.getData("assetId");
	const asset = deepClone(assetStore.assets.find((v) => v.id === assetId));
	if (asset) {
		e.dataTransfer?.setData("assetId", asset.id);
		const component: Component = {
			version: asset.material.version,
			id: Date.now().toString(),
			key: asset.material.key,
			title: asset.material.title,
			active: true,
			nestable: asset.material.nestable,
			locked: asset.material.locked,
			hidden: asset.material.hidden,
			layout: deepClone(asset.material.layout),
			props: asset.material.props,
			expressions: asset.material.expressions,
			components: asset.material.components,
		};
		if (component.layout) {
			component.layout.left = e.offsetX - (component.layout.width ?? 0) / 2;
			component.layout.top = e.offsetY - (component.layout.height ?? 0) / 2;
		}
		schemaStore.components.push(component);
		computedSelector();
	}
};
const componentMousedown = (e: MouseEvent, component: Component) => {
	const schemaStore = useSchema();
	const targetComponent = useTargetComponent();
	if (!e.shiftKey) {
		if (!component.active) schemaStore.flatComponents.forEach((v) => v.active && (v.active = false));
	}
	component.active = true;
	targetComponent.componentId.value = component.id;
	computedSelector();
};
const selectorMousedown = (direction: "t" | "tr" | "r" | "rb" | "b" | "lb" | "l" | "lt") => {
	const targetComponent = useTargetComponent();
	if (targetComponent.component.value?.layout) {
		document.body.addEventListener("mousemove", mousemove);
		document.body.addEventListener("mouseup", mouseup);
		function mousemove(e: MouseEvent) {
			if (targetComponent.component.value) {
				const movementX = getUnscaledOffset(e.movementX);
				const movementY = getUnscaledOffset(e.movementY);
				switch (direction) {
					case "t":
						if (targetComponent.component.value.layout!.height + -movementY > 0) {
							targetComponent.component.value.layout!.top += movementY;
							targetComponent.component.value.layout!.height += -movementY;
						}
						break;

					case "tr":
						if (targetComponent.component.value.layout!.height + -movementY > 0 && targetComponent.component.value.layout!.width + movementX > 0) {
							targetComponent.component.value.layout!.top += movementY;
							targetComponent.component.value.layout!.width += movementX;
							targetComponent.component.value.layout!.height += -movementY;
						}
						break;
					case "r":
						if (targetComponent.component.value.layout!.width + movementX > 0) {
							targetComponent.component.value.layout!.width += movementX;
						}
						break;
					case "rb":
						if (targetComponent.component.value.layout!.height + movementY > 0 && targetComponent.component.value.layout!.width + movementX > 0) {
							targetComponent.component.value.layout!.width += movementX;
							targetComponent.component.value.layout!.height += movementY;
						}
						break;
					case "b":
						if (targetComponent.component.value.layout!.height + movementY > 0) {
							targetComponent.component.value.layout!.height += movementY;
						}
						break;
					case "lb":
						if (targetComponent.component.value.layout!.height + movementY > 0 && targetComponent.component.value.layout!.width + -movementX > 0) {
							targetComponent.component.value.layout!.left += movementX;
							targetComponent.component.value.layout!.width += -movementX;
							targetComponent.component.value.layout!.height += movementY;
						}
						break;
					case "l":
						if (targetComponent.component.value.layout!.width + -movementX > 0) {
							targetComponent.component.value.layout!.left += movementX;
							targetComponent.component.value.layout!.width += -movementX;
						}
						break;
					case "lt":
						if (targetComponent.component.value.layout!.height + -movementY > 0 && targetComponent.component.value.layout!.width + -movementX > 0) {
							targetComponent.component.value.layout!.left += movementX;
							targetComponent.component.value.layout!.top += movementY;
							targetComponent.component.value.layout!.width += -movementX;
							targetComponent.component.value.layout!.height += -movementY;
						}
						break;
				}
				computedSelector();
			}
		}
		function mouseup() {
			document.body.removeEventListener("mousemove", mousemove);
			document.body.removeEventListener("mouseup", mouseup);
		}
	}
};
// 计算选择器坐标、宽高
const computedSelector = () => {
	const schemaStore = useSchema();
	if (schemaStore.activeMoveableComponents.length) {
		let left = Infinity;
		let top = Infinity;
		let right = -Infinity;
		let bottom = -Infinity;
		schemaStore.activeMoveableComponents.forEach((component) => {
			left = Math.min(left, getActualLeft(component.layout.left));
			top = Math.min(top, getActualTop(component.layout.top));
			right = Math.max(right, getActualLeft(component.layout.left + component.layout.width));
			bottom = Math.max(bottom, getActualTop(component.layout.top + component.layout.height));
		});
		const width = right - left;
		const height = bottom - top;
		selector.left = left;
		selector.top = top;
		selector.width = width;
		selector.height = height;
	} else {
		selector.left = 0;
		selector.top = 0;
		selector.width = 0;
		selector.height = 0;
	}
};
// 获取离当前offset最接近的网格线位置
function getNearestGridLinePosition(position: number) {
	const clientStore = useClient();
	if (clientStore.grid.enableSnap) {
		return Math.round(position / clientStore.grid.span) * clientStore.grid.span;
	} else return position;
}
// 获取逻辑左边距（渲染器左边距相对于画布的左边距）
function getLogicalLeft(left: number) {
	const clientStore = useClient();
	return (left - clientStore.canvas.left) / clientStore.canvas.scale;
}
// 获取逻辑上边距（渲染器上边距相对于画布的上边距）
function getLogicalTop(top: number) {
	const clientStore = useClient();
	return (top - clientStore.canvas.top) / clientStore.canvas.scale;
}
// 获取实际左边距（画布左边距相对于渲染器的左边距）
function getActualLeft(left: number) {
	const clientStore = useClient();
	return left * clientStore.canvas.scale + clientStore.canvas.left;
}
// 获取实际上边距（画布上边距相对于渲染器的上边距）
function getActualTop(top: number) {
	const clientStore = useClient();
	return top * clientStore.canvas.scale + clientStore.canvas.top;
}
// 获取缩放的值
function getScaledOffset(number: number) {
	const clientStore = useClient();
	return number * clientStore.canvas.scale;
}
// 获取未缩放的值
function getUnscaledOffset(number: number) {
	const clientStore = useClient();
	return number / clientStore.canvas.scale;
}

export const useDragger = () => ({
	selector,
	alignLine,
	propertyDragstart,
	rendererWheel,
	rendererMousedown,
	canvasDrap,
	componentMousedown,
	selectorMousedown,
	computedSelector,
	getActualLeft,
	getActualTop,
});
