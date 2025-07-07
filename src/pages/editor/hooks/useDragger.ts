import { reactive } from "vue";
import { useClient } from "@/stores/useClient";
import { useAsset } from "@/stores/useAsset";
import { useSchema } from "@/stores/useSchema";
import type { Component } from "@/types/Component";
import type { Asset } from "@/types/Asset";
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
const assetDragstart = (e: DragEvent, assetId: string) => {
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
			clientStore.canvas.scale = Number(Math.max(clientStore.canvas.scale - 0.02, 0.1).toFixed(2));
		} else {
			clientStore.canvas.scale = Number(Math.min(clientStore.canvas.scale + 0.02, 5).toFixed(2));
		}
		computedSelector();
	}
};
const rendererMousedown = (e: MouseEvent) => {
	if (e.button === 0) {
		const clientStore = useClient();
		const schemaStore = useSchema();
		const targetComponent = useTargetComponent();
		if (!clientStore.previewing && !clientStore.enabledOperate) {
			const oRenderer = document.querySelector<HTMLDivElement>(".renderer");
			const offsetX = e.pageX - oRenderer!.offsetLeft; // 选择器的offsetX
			const offsetY = e.pageY - oRenderer!.offsetTop;
			if (clientStore.keyboard.spaceKey) {
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
			} else if (
				offsetX < selector.left ||
				offsetX > selector.left + selector.width ||
				offsetY < selector.top ||
				offsetY > selector.top + selector.height
			) {
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
				schemaStore.activedFlatedComponents.forEach((v) => schemaStore.deactivateComponent(v));
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
						schemaStore.activedFlatedComponents.forEach((v) => schemaStore.deactivateComponent(v));
					}
					// 正框选（从左往右框选）
					if (startX < e.clientX) {
						schemaStore.moveableVisibleUnlockedComponents.forEach((component) => {
							const left = getActualLeft(component.layout.left);
							const top = getActualTop(component.layout.top);
							const width = getScaledOffset(component.layout.width);
							const height = getScaledOffset(component.layout.height);
							if (
								left >= selector.left &&
								left + width <= selector.left + selector.width &&
								top >= selector.top &&
								top + height <= selector.top + selector.height
							) {
								schemaStore.activateComponent(component);
							}
						});
					} else {
						schemaStore.moveableVisibleUnlockedComponents.forEach((component) => {
							const left = getActualLeft(component.layout.left);
							const top = getActualTop(component.layout.top);
							const width = getScaledOffset(component.layout.width);
							const height = getScaledOffset(component.layout.height);
							if (
								left < selector.left + selector.width &&
								left + width > selector.left &&
								top < selector.top + selector.height &&
								top + height > selector.top
							) {
								schemaStore.activateComponent(component);
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
				// 吸附线
				const snapLines = clientStore.snap.enable
					? {
							v: [
								getActualLeft(0),
								getActualLeft(schemaStore.layout.width / 2),
								getActualLeft(schemaStore.layout.width),
								...schemaStore.unactivedMoveableComponents.flatMap((v) => [
									getActualLeft(v.layout.left),
									getActualLeft(v.layout.left + v.layout.width / 2),
									getActualLeft(v.layout.left + v.layout.width),
								]),
							],
							h: [
								getActualTop(0),
								getActualTop(schemaStore.layout.height / 2),
								getActualTop(schemaStore.layout.height),
								...schemaStore.unactivedMoveableComponents.flatMap((v) => [
									getActualTop(v.layout.top),
									getActualTop(v.layout.top + v.layout.height / 2),
									getActualTop(v.layout.top + v.layout.height),
								]),
							],
					  }
					: { v: [], h: [] };
				const startActiveComponentsPosition = schemaStore.activedMoveableComponents.map((v) => ({
					left: getActualLeft(v.layout.left),
					top: getActualTop(v.layout.top),
				})); // 激活组件拖拽开始时的坐标
				document.body.addEventListener("mousemove", mousemove);
				document.body.addEventListener("mouseup", mouseup);
				function mousemove(e: MouseEvent) {
					const moveX = e.clientX - startX; // 移动的X轴距离
					const dragLeft = startSelectorLeft + moveX; // 拖拽后的相对于渲染器的left值
					const leftV = snapLines.v.find(
						(v) => Math.abs(v - dragLeft) < getScaledOffset(clientStore.snap.distance)
					); // 组件的左边定位到的垂直吸附线
					const middleV = snapLines.v.find(
						(v) => Math.abs(v - dragLeft - selector.width / 2) < clientStore.snap.distance
					);
					const rightV = snapLines.v.find(
						(v) => Math.abs(v - dragLeft - selector.width) < clientStore.snap.distance
					);
					if (leftV !== undefined) {
						const left = getLogicalLeft(leftV); // 将吸附线left值转换为画布的left值
						schemaStore.activedMoveableComponents.forEach((component, index) => {
							component.layout.left =
								getUnscaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
						});
						alignLine.v = left;
					} else if (middleV !== undefined) {
						const middle = getLogicalLeft(middleV);
						const left = middle - getUnscaledOffset(selector.width / 2);
						schemaStore.activedMoveableComponents.forEach((component, index) => {
							component.layout.left =
								getUnscaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
						});
						alignLine.v = middle;
					} else if (rightV !== undefined) {
						const right = getLogicalLeft(rightV);
						const left = right - getUnscaledOffset(selector.width);
						schemaStore.activedMoveableComponents.forEach((component, index) => {
							component.layout.left =
								getUnscaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
						});
						alignLine.v = right;
					} else {
						const logicalDragLeft = getLogicalLeft(dragLeft); // 将当前位置转换为逻辑坐标（未缩放）
						const snappedLogicalLeft = Math.round(getNearestGridLinePosition(logicalDragLeft)); // 获取最接近的网格线位置（逻辑坐标）
						schemaStore.activedMoveableComponents.forEach((component, index) => {
							const originalLeft = getLogicalLeft(startActiveComponentsPosition[index].left);
							component.layout.left =
								originalLeft + (snappedLogicalLeft - getLogicalLeft(startSelectorLeft));
						});
						alignLine.v = null;
					}
					const moveY = e.clientY - startY;
					const dragTop = startSelectorTop + moveY; // 拖拽后的相对于渲染器的left值
					const topH = snapLines.h.find(
						(v) => Math.abs(v - dragTop) < getScaledOffset(clientStore.snap.distance)
					); // 组件的左边定位到的垂直吸附线
					const middleH = snapLines.h.find(
						(v) => Math.abs(v - dragTop - selector.height / 2) < clientStore.snap.distance
					);
					const bottomH = snapLines.h.find(
						(v) => Math.abs(v - dragTop - selector.height) < clientStore.snap.distance
					);
					if (topH !== undefined) {
						const top = getLogicalTop(topH); // 将吸附线left值转换为画布的left值
						schemaStore.activedMoveableComponents.forEach((component, index) => {
							component.layout.top =
								getUnscaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
						});
						alignLine.h = top;
					} else if (middleH !== undefined) {
						const middle = getLogicalTop(middleH);
						const top = middle - getUnscaledOffset(selector.height / 2);
						schemaStore.activedMoveableComponents.forEach((component, index) => {
							component.layout.top =
								getUnscaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
						});
						alignLine.h = middle;
					} else if (bottomH !== undefined) {
						const right = getLogicalTop(bottomH);
						const top = right - getUnscaledOffset(selector.height);
						schemaStore.activedMoveableComponents.forEach((component, index) => {
							component.layout.top =
								getUnscaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
						});
						alignLine.h = right;
					} else {
						const logicalDragTop = getLogicalTop(dragTop);
						const snappedLogicalTop = Math.round(getNearestGridLinePosition(logicalDragTop));
						schemaStore.activedMoveableComponents.forEach((component, index) => {
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
		}
	}
};
const canvasDrop = (e: DragEvent) => {
	const assetStore = useAsset();
	const schemaStore = useSchema();
	const assetId = e.dataTransfer?.getData("assetId");
	const asset = deepClone(assetStore.assets.find((v) => v.id === assetId));
	if (asset) {
		const newComponent: Component = assetTransferComponent(asset);
		if (newComponent.layout) {
			newComponent.layout.left = e.offsetX - (newComponent.layout.width ?? 0) / 2;
			newComponent.layout.top = e.offsetY - (newComponent.layout.height ?? 0) / 2;
		}
		schemaStore.createComponent(newComponent);
		computedSelector();
	}
};
const componentDrop = (e: DragEvent, component: Component) => {
	const assetStore = useAsset();
	const schemaStore = useSchema();
	const assetId = e.dataTransfer?.getData("assetId");
	const asset = deepClone(assetStore.assets.find((v) => v.id === assetId));
	if (asset) {
		const newComponent: Component = assetTransferComponent(asset);
		if (newComponent.layout) {
			newComponent.layout.left =
				e.offsetX + schemaStore.getOffsetFromSchema(component).left - (newComponent.layout.width ?? 0) / 2;
			newComponent.layout.top =
				e.offsetY + schemaStore.getOffsetFromSchema(component).top - (newComponent.layout.height ?? 0) / 2;
		}
		schemaStore.createComponent(newComponent);
		computedSelector();
	}
};
function assetTransferComponent(asset: Asset): Component {
	const cloneAsset = deepClone(asset);
	return {
		version: cloneAsset.material.version,
		id: "",
		key: cloneAsset.material.key,
		title: cloneAsset.material.title,
		actived: true,
		nestable: cloneAsset.material.nestable,
		locked: cloneAsset.material.locked,
		hidden: cloneAsset.material.hidden,
		layout: cloneAsset.material.layout,
		props: cloneAsset.material.props,
		state: cloneAsset.material.state,
		actions: cloneAsset.material.actions,
		emits: cloneAsset.material.emits,
		components: cloneAsset.material.components,
		propsExpression: cloneAsset.material.propsExpression,
		stateExpression: cloneAsset.material.stateExpression,
	};
}
const componentMousedown = (e: MouseEvent, component: Component) => {
	const clientStore = useClient();
	const schemaStore = useSchema();
	const targetComponent = useTargetComponent();
	if (!clientStore.previewing && !clientStore.enabledOperate) {
		if (!e.shiftKey) {
			if (!component.actived)
				schemaStore.activedFlatedComponents.forEach((v) => schemaStore.deactivateComponent(v));
		}
		schemaStore.activateComponent(component);
		targetComponent.componentId.value = component.id;
		computedSelector();
	}
};
const selectorMousedown = (e: MouseEvent, direction: "t" | "tr" | "r" | "rb" | "b" | "lb" | "l" | "lt") => {
	const targetComponent = useTargetComponent();
	if (targetComponent.component.value?.layout) {
		const startX = e.clientX; // 鼠标按下时的X坐标
		const startY = e.clientY;
		const startLeft = targetComponent.component.value.layout.left;
		const startTop = targetComponent.component.value.layout.top;
		const startWidth = targetComponent.component.value.layout.width;
		const startHeight = targetComponent.component.value.layout.height;
		document.body.addEventListener("mousemove", mousemove);
		document.body.addEventListener("mouseup", mouseup);
		function mousemove(e: MouseEvent) {
			const moveX = Math.round(getUnscaledOffset(e.clientX - startX)); // 移动的X轴距离
			const moveY = Math.round(getUnscaledOffset(e.clientY - startY)); // 移动的X轴距离
			const dragLeft = startLeft + moveX;
			const dragTop = startTop + moveY;
			switch (direction) {
				case "t":
					if (startHeight + -moveY > 0) {
						targetComponent.component.value!.layout!.top = dragTop;
						targetComponent.component.value!.layout!.height = startHeight + -moveY;
					}
					break;

				case "tr":
					if (startWidth + moveX > 0) {
						targetComponent.component.value!.layout!.width = startWidth + moveX;
					}
					if (startHeight + -moveY > 0) {
						targetComponent.component.value!.layout!.top = dragTop;
						targetComponent.component.value!.layout!.height = startHeight + -moveY;
					}
					break;
				case "r":
					if (startWidth + moveX > 0) {
						targetComponent.component.value!.layout!.width = startWidth + moveX;
					}
					break;
				case "rb":
					if (startWidth + moveX > 0) {
						targetComponent.component.value!.layout!.width = startWidth + moveX;
					}
					if (startHeight + moveY > 0) {
						targetComponent.component.value!.layout!.height = startHeight + moveY;
					}
					break;
				case "b":
					if (startHeight + moveY > 0) {
						targetComponent.component.value!.layout!.height = startHeight + moveY;
					}
					break;
				case "lb":
					if (startWidth + -moveX > 0) {
						targetComponent.component.value!.layout!.left = dragLeft;
						targetComponent.component.value!.layout!.width = startWidth + -moveX;
					}
					if (startHeight + moveY > 0) {
						targetComponent.component.value!.layout!.height = startHeight + moveY;
					}
					break;
				case "l":
					if (startWidth + -moveX > 0) {
						targetComponent.component.value!.layout!.left = dragLeft;
						targetComponent.component.value!.layout!.width = startWidth + -moveX;
					}
					break;
				case "lt":
					if (startWidth + -moveX > 0) {
						targetComponent.component.value!.layout!.left = dragLeft;
						targetComponent.component.value!.layout!.width = startWidth + -moveX;
					}
					if (startHeight + -moveY > 0) {
						targetComponent.component.value!.layout!.top = dragTop;
						targetComponent.component.value!.layout!.height = startHeight + -moveY;
					}
					break;
			}
			computedSelector();
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
	if (schemaStore.activedMoveableComponents.length) {
		let left = Infinity;
		let top = Infinity;
		let right = -Infinity;
		let bottom = -Infinity;
		schemaStore.activedMoveableComponents.forEach((component) => {
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
	if (clientStore.grid.enable) {
		return Math.round(position / clientStore.grid.span) * clientStore.grid.span;
	} else return position;
}
// 获取逻辑左边距（组件相对于渲染器->组件相对于画布）
function getLogicalLeft(left: number) {
	const clientStore = useClient();
	return (left - clientStore.canvas.left) / clientStore.canvas.scale;
}
// 获取逻辑上边距
function getLogicalTop(top: number) {
	const clientStore = useClient();
	return (top - clientStore.canvas.top) / clientStore.canvas.scale;
}
// 获取实际左边距（组件相对于画布->组件相对于渲染器）
function getActualLeft(left: number) {
	const clientStore = useClient();
	return left * clientStore.canvas.scale + clientStore.canvas.left;
}
// 获取实际上边距
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
	assetDragstart,
	rendererWheel,
	rendererMousedown,
	canvasDrop,
	componentDrop,
	componentMousedown,
	selectorMousedown,
	computedSelector,
	getActualLeft,
	getActualTop,
});
