import { reactive } from "vue";
import type { Router } from "vue-router";
import type { Asset } from "@/types/Asset";
import type { Component } from "@/types/Component";
import { useClient } from "@/stores/useClient";
import { useAsset } from "@/stores/useAsset";
import { useSchema } from "@/stores/useSchema";
import { assetTransferComponent } from "@/helpers/schema";
import { deepClone } from "@/utils/conversion";
import { useCommand } from "@/stores/useCommand";

// 框选器
const selector = reactive({
	left: 0,
	top: 0,
	width: 0,
	height: 0,
});
// 吸附对齐线
const snapLine = reactive({
	v: null as number | null,
	h: null as number | null,
});
// 图层
const layer = reactive({
	dragging: false,
	dragStartComponent: null as Component | null,
	dragOverComponent: null as Component | null,
	position: null as "before" | "after" | null,
});
const assetOnDragStart = (e: DragEvent, asset: Asset) => {
	const assetStore = useAsset();
	const schemaStore = useSchema();
	const item = assetStore.assets.find((v) => v.id === asset.id);
	if (item) {
		schemaStore.deactivateAllComponent();
		selector.left = 0;
		selector.top = 0;
		selector.width = 0;
		selector.height = 0;
		e.dataTransfer?.setData("assetId", item.id);
	}
};
const layerOnDragStart = (component: Component) => {
	const schemaStore = useSchema();
	schemaStore.deactivateAllComponent();
	layer.dragging = true;
	layer.dragStartComponent = component;
};
const layerOnDragOver = (e: DragEvent, component: Component) => {
	const schemaStore = useSchema();
	if (
		layer.dragStartComponent!.id !== component.id &&
		!schemaStore.isContains(layer.dragStartComponent!, component.id)
	) {
		e.stopPropagation();
		schemaStore.deactivateAllComponent();
		// if (schemaStore.isRoot(component.id)) {
		// 	layer.position = null;
		// 	layer.dragOverComponent = component;
		// 	component.actived = true;
		// } else
		if (e.offsetY <= 5) {
			// 组件的上边
			layer.position = "before";
			layer.dragOverComponent = component;
			component.actived = true;
		} else if (e.offsetY >= (e.target as HTMLDetailsElement).offsetHeight - 5) {
			// 组件的下边
			layer.position = "after";
			layer.dragOverComponent = component;
			component.actived = true;
		} else if (component.nestable) {
			layer.position = null;
			layer.dragOverComponent = component;
			component.actived = true;
		}
	}
};
const layerOnDrop = () => {
	const schemaStore = useSchema();
	const commandStore = useCommand();
	const dragger = useDragger();
	if (layer.dragStartComponent && layer.dragOverComponent) {
		if (layer.position === null && layer.dragOverComponent!.nestable) {
			commandStore.joinGroup(layer.dragStartComponent.id, layer.dragOverComponent.id);
		} else if (layer.position === "before") {
			commandStore.insertBefore(layer.dragStartComponent.id, layer.dragOverComponent.id);
		} else if (layer.position === "after") {
			commandStore.insertAfter(layer.dragStartComponent.id, layer.dragOverComponent.id);
		}
		schemaStore.deactivateAllComponent();
		schemaStore.targetComponentId = layer.dragStartComponent.id;
		layer.dragStartComponent.actived = true;
		dragger.computedSelector();
	}
	layer.dragStartComponent = null;
	layer.dragOverComponent = null;
	layer.position = null;
	layer.dragging = false;
};
const rendererOnWheel = (e: WheelEvent) => {
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
const rendererOnMouseDown = (e: MouseEvent) => {
	if (e.button === 0) {
		const clientStore = useClient();
		const schemaStore = useSchema();
		if (!clientStore.previewing && !clientStore.enabledOperate) {
			const oRenderer = document.querySelector<HTMLDivElement>(".renderer");
			const offsetX = e.pageX - oRenderer!.offsetLeft; // 选择器的offsetX
			const offsetY = e.pageY - oRenderer!.offsetTop;
			if (clientStore.keyboard.spaceKey) {
				// 移动画布
				document.body.addEventListener("mousemove", mouseMove);
				document.body.addEventListener("mouseup", mouseUp);
				function mouseMove(e: MouseEvent) {
					clientStore.canvas.left += e.movementX;
					clientStore.canvas.top += e.movementY;
					computedSelector();
				}
				function mouseUp() {
					document.body.removeEventListener("mousemove", mouseMove);
					document.body.removeEventListener("mouseup", mouseUp);
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
				schemaStore.deactivateAllComponent();
				schemaStore.targetComponentId = "";
				document.body.addEventListener("mousemove", mouseMove);
				document.body.addEventListener("mouseup", mouseUp);
				function mouseMove(e: MouseEvent) {
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
				function mouseUp(e: MouseEvent) {
					if (!e.shiftKey) {
						schemaStore.deactivateAllComponent();
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
								component.actived = true;
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
								component.actived = true;
							}
						});
					}
					if (schemaStore.activedFlatedComponents[0]) {
						schemaStore.targetComponentId = schemaStore.activedFlatedComponents[0].id;
					}
					computedSelector();
					document.body.removeEventListener("mousemove", mouseMove);
					document.body.removeEventListener("mouseup", mouseUp);
				}
			}
		}
	}
};
const rendererOnDrop = (e: DragEvent, router: Router) => {
	const assetStore = useAsset();
	const schemaStore = useSchema();
	const commandStore = useCommand();
	const assetId = e.dataTransfer?.getData("assetId");
	const asset = deepClone(assetStore.assets.find((v) => v.id === assetId));
	if (asset) {
		const newComponent = assetTransferComponent(asset);
		if (newComponent.layout) {
			newComponent.layout.left = 0;
			newComponent.layout.top = 0;
		}
		commandStore.createRootComponent(newComponent);
		schemaStore.deactivateAllComponent();
		router.replace("/editor?id=" + newComponent.id);
	}
};
const componentOnMouseDown = (e: MouseEvent, component: Component) => {
	const clientStore = useClient();
	const schemaStore = useSchema();
	if (clientStore.keyboard.spaceKey) return;
	if (!schemaStore.isRoot(component.id)) e.stopPropagation();
	if (!clientStore.previewing && !clientStore.enabledOperate && !schemaStore.isRoot(component.id)) {
		focusComponent(e, component);
		const oldSchema = deepClone(schemaStore.$state);
		let moved = false; // 是否移动过（撤销队列使用）
		const startX = e.clientX; // 鼠标按下时的X坐标
		const startY = e.clientY;
		const startSelectorLeft = selector.left;
		const startSelectorTop = selector.top;
		// 激活组件拖拽开始时的坐标
		const snapLines =
			clientStore.snap.enable && !e.ctrlKey && !e.metaKey
				? {
						v: [
							getActualLeft(0),
							getActualLeft((schemaStore.currentRootComponent?.layout?.width ?? 0) / 2),
							getActualLeft(schemaStore.currentRootComponent?.layout?.width ?? 0),
							...schemaStore.unactivedMoveableFlatedComponents
								.filter((v) => {
									return schemaStore.activedMoveableFlatedComponents.some(
										(v2) => !schemaStore.isContains(v2, v.id)
									);
								})
								.flatMap((v) => [
									getActualLeft(v.layout.left),
									getActualLeft(v.layout.left + v.layout.width / 2),
									getActualLeft(v.layout.left + v.layout.width),
								]),
							...clientStore.guide.line.v.map((v) => getActualLeft(v)),
						],
						h: [
							getActualTop(0),
							getActualTop((schemaStore.currentRootComponent?.layout?.height ?? 0) / 2),
							getActualTop(schemaStore.currentRootComponent?.layout?.height ?? 0),
							...schemaStore.unactivedMoveableFlatedComponents
								.filter((v) => {
									return schemaStore.activedMoveableFlatedComponents.some(
										(v2) => !schemaStore.isContains(v2, v.id)
									);
								})
								.flatMap((v) => [
									getActualTop(v.layout.top),
									getActualTop(v.layout.top + v.layout.height / 2),
									getActualTop(v.layout.top + v.layout.height),
								]),
							...clientStore.guide.line.h.map((v) => getActualTop(v)),
						],
				  }
				: { v: [], h: [] };
		const startActiveComponentsPosition = schemaStore.activedMoveableFlatedComponents.map((v) => ({
			left: getActualLeft(v.layout.left),
			top: getActualTop(v.layout.top),
		}));
		document.body.addEventListener("mousemove", mouseMove);
		document.body.addEventListener("mouseup", mouseUp);
		function mouseMove(e: MouseEvent) {
			moved = true;
			const moveX = e.clientX - startX; // 移动的X轴距离
			const dragLeft = startSelectorLeft + moveX; // 拖拽后的相对于渲染器的left值
			const leftV = snapLines.v.find((v) => Math.abs(v - dragLeft) < getScaledOffset(clientStore.snap.distance)); // 组件的左边定位到的垂直吸附线
			const middleV = snapLines.v.find(
				(v) => Math.abs(v - dragLeft - selector.width / 2) < getScaledOffset(clientStore.snap.distance)
			);
			const rightV = snapLines.v.find(
				(v) => Math.abs(v - dragLeft - selector.width) < getScaledOffset(clientStore.snap.distance)
			);
			if (leftV !== undefined) {
				const left = getLogicalLeft(leftV); // 将吸附线left值转换为画布的left值
				schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
					component.layout.left =
						getUnscaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
				});
				snapLine.v = left;
			} else if (middleV !== undefined) {
				const middle = getLogicalLeft(middleV);
				const left = middle - getUnscaledOffset(selector.width / 2);
				schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
					component.layout.left =
						getUnscaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
				});
				snapLine.v = middle;
			} else if (rightV !== undefined) {
				const right = getLogicalLeft(rightV);
				const left = right - getUnscaledOffset(selector.width);
				schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
					component.layout.left =
						getUnscaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
				});
				snapLine.v = right;
			} else {
				const logicalDragLeft = getLogicalLeft(dragLeft); // 将当前位置转换为逻辑坐标（未缩放）
				const snappedLogicalLeft = Math.round(getNearestGridLinePosition(logicalDragLeft)); // 获取最接近的网格线位置（逻辑坐标）
				schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
					const originalLeft = getLogicalLeft(startActiveComponentsPosition[index].left);
					component.layout.left = originalLeft + (snappedLogicalLeft - getLogicalLeft(startSelectorLeft));
				});
				snapLine.v = null;
			}
			const moveY = e.clientY - startY;
			const dragTop = startSelectorTop + moveY; // 拖拽后的相对于渲染器的left值
			const topH = snapLines.h.find((v) => Math.abs(v - dragTop) < getScaledOffset(clientStore.snap.distance)); // 组件的左边定位到的垂直吸附线
			const middleH = snapLines.h.find(
				(v) => Math.abs(v - dragTop - selector.height / 2) < clientStore.snap.distance
			);
			const bottomH = snapLines.h.find(
				(v) => Math.abs(v - dragTop - selector.height) < clientStore.snap.distance
			);
			if (topH !== undefined) {
				const top = getLogicalTop(topH); // 将吸附线left值转换为画布的left值
				schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
					component.layout.top =
						getUnscaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
				});
				snapLine.h = top;
			} else if (middleH !== undefined) {
				const middle = getLogicalTop(middleH);
				const top = middle - getUnscaledOffset(selector.height / 2);
				schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
					component.layout.top =
						getUnscaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
				});
				snapLine.h = middle;
			} else if (bottomH !== undefined) {
				const right = getLogicalTop(bottomH);
				const top = right - getUnscaledOffset(selector.height);
				schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
					component.layout.top =
						getUnscaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
				});
				snapLine.h = right;
			} else {
				const logicalDragTop = getLogicalTop(dragTop);
				const snappedLogicalTop = Math.round(getNearestGridLinePosition(logicalDragTop));
				schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
					const originalTop = getLogicalTop(startActiveComponentsPosition[index].top);
					component.layout.top = originalTop + (snappedLogicalTop - getLogicalTop(startSelectorTop));
				});
				snapLine.h = null;
			}
			computedSelector();
		}
		function mouseUp() {
			snapLine.v = null;
			snapLine.h = null;
			if (moved) schemaStore.recordStack(oldSchema);
			document.body.removeEventListener("mousemove", mouseMove);
			document.body.removeEventListener("mouseup", mouseUp);
		}
	}
};
const componentOnDragOver = (e: DragEvent, component: Component) => {
	if (component.nestable) {
		e.stopPropagation();
		const schemaStore = useSchema();
		schemaStore.deactivateAllComponent();
		component.actived = true;
	}
};
const componentOnDragLeave = (component: Component) => {
	component.actived = false;
};
const componentOnDrop = (e: DragEvent, component: Component) => {
	if (component.nestable) {
		e.stopPropagation();
		const assetStore = useAsset();
		const commandStore = useCommand();
		const schemaStore = useSchema();
		const { left, top } = getOffsetFromRoot(component);
		const assetId = e.dataTransfer?.getData("assetId");
		const asset = deepClone(assetStore.assets.find((v) => v.id === assetId));
		if (asset) {
			const newComponent = assetTransferComponent(asset);
			if (newComponent.layout) {
				newComponent.layout.left = left + e.offsetX - (newComponent.layout.width ?? 0) / 2;
				newComponent.layout.top = top + e.offsetY - (newComponent.layout.height ?? 0) / 2;
			}
			commandStore.createComponent(newComponent);
			schemaStore.joinGroup(newComponent, component);
		}
	}
};
const selectorDirectionOnMouseDown = (e: MouseEvent, direction: "t" | "tr" | "r" | "rb" | "b" | "lb" | "l" | "lt") => {
	const schemaStore = useSchema();
	const oldSchema = deepClone(schemaStore.$state);
	if (schemaStore.targetComponent?.layout) {
		const startX = e.clientX; // 鼠标按下时的X坐标
		const startY = e.clientY;
		const startLeft = schemaStore.targetComponent.layout.left;
		const startTop = schemaStore.targetComponent.layout.top;
		const startWidth = schemaStore.targetComponent.layout.width;
		const startHeight = schemaStore.targetComponent.layout.height;
		document.body.addEventListener("mousemove", mouseMove);
		document.body.addEventListener("mouseup", mouseUp);
		function mouseMove(e: MouseEvent) {
			const moveX = Math.round(getUnscaledOffset(e.clientX - startX)); // 移动的X轴距离
			const moveY = Math.round(getUnscaledOffset(e.clientY - startY)); // 移动的X轴距离
			const dragLeft = startLeft + moveX;
			const dragTop = startTop + moveY;
			switch (direction) {
				case "t":
					if (startHeight + -moveY > 0) {
						schemaStore.targetComponent!.layout!.top = dragTop;
						schemaStore.targetComponent!.layout!.height = startHeight + -moveY;
					}
					break;

				case "tr":
					if (startWidth + moveX > 0) {
						schemaStore.targetComponent!.layout!.width = startWidth + moveX;
					}
					if (startHeight + -moveY > 0) {
						schemaStore.targetComponent!.layout!.top = dragTop;
						schemaStore.targetComponent!.layout!.height = startHeight + -moveY;
					}
					break;
				case "r":
					if (startWidth + moveX > 0) {
						schemaStore.targetComponent!.layout!.width = startWidth + moveX;
					}
					break;
				case "rb":
					if (startWidth + moveX > 0) {
						schemaStore.targetComponent!.layout!.width = startWidth + moveX;
					}
					if (startHeight + moveY > 0) {
						schemaStore.targetComponent!.layout!.height = startHeight + moveY;
					}
					break;
				case "b":
					if (startHeight + moveY > 0) {
						schemaStore.targetComponent!.layout!.height = startHeight + moveY;
					}
					break;
				case "lb":
					if (startWidth + -moveX > 0) {
						schemaStore.targetComponent!.layout!.left = dragLeft;
						schemaStore.targetComponent!.layout!.width = startWidth + -moveX;
					}
					if (startHeight + moveY > 0) {
						schemaStore.targetComponent!.layout!.height = startHeight + moveY;
					}
					break;
				case "l":
					if (startWidth + -moveX > 0) {
						schemaStore.targetComponent!.layout!.left = dragLeft;
						schemaStore.targetComponent!.layout!.width = startWidth + -moveX;
					}
					break;
				case "lt":
					if (startWidth + -moveX > 0) {
						schemaStore.targetComponent!.layout!.left = dragLeft;
						schemaStore.targetComponent!.layout!.width = startWidth + -moveX;
					}
					if (startHeight + -moveY > 0) {
						schemaStore.targetComponent!.layout!.top = dragTop;
						schemaStore.targetComponent!.layout!.height = startHeight + -moveY;
					}
					break;
			}
			computedSelector();
		}
		function mouseUp() {
			schemaStore.recordStack(oldSchema);
			document.body.removeEventListener("mousemove", mouseMove);
			document.body.removeEventListener("mouseup", mouseUp);
		}
	}
};
// 计算选择器坐标、宽高
const computedSelector = () => {
	const schemaStore = useSchema();
	if (schemaStore.activedMoveableFlatedComponents.length) {
		let left = Infinity;
		let top = Infinity;
		let right = -Infinity;
		let bottom = -Infinity;
		schemaStore.activedMoveableFlatedComponents.forEach((component) => {
			const { left: fromSchemaLeft, top: fromSchemaTop } = getOffsetFromRoot(component);
			left = Math.min(left, getActualLeft(fromSchemaLeft));
			top = Math.min(top, getActualTop(fromSchemaTop));
			right = Math.max(right, getActualLeft(fromSchemaLeft + component.layout.width));
			bottom = Math.max(bottom, getActualTop(fromSchemaTop + component.layout.height));
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
// 聚焦组件
function focusComponent(e: MouseEvent, component: Component, router?: Router) {
	const schemaStore = useSchema();
	if (!schemaStore.isRoot(component.id)) {
		if (!e.shiftKey && !component.actived) schemaStore.deactivateAllComponent();
		component.actived = true;
		schemaStore.targetComponentId = component.id;
		computedSelector();
	} else {
		router?.push("/editor?id=" + component.id);
	}
}
// 获取组件相对于父组件的父组件的偏移
function getOffsetFromParentParent(component: Component): { left: number; top: number } {
	const schemaStore = useSchema();
	let left = component?.layout?.left ?? 0;
	let top = component?.layout?.top ?? 0;
	const { parent } = schemaStore.findParent(component.id);
	if (parent && !schemaStore.isSchema(parent) && parent.layout) {
		left += parent.layout.left;
		top += parent.layout.top;
	}
	return { left, top };
}
// 获取组件相对于根组件的偏移
function getOffsetFromRoot(component: Component): { left: number; top: number } {
	const schemaStore = useSchema();
	let left = component?.layout?.left ?? 0;
	let top = component?.layout?.top ?? 0;
	const fn = (component: Component) => {
		const { parent } = schemaStore.findParent(component.id);
		if (parent && !schemaStore.isSchema(parent) && parent.layout) {
			left += parent.layout.left;
			top += parent.layout.top;
			fn(parent);
		}
	};
	fn(component);
	return { left, top };
}
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
	snapLine,
	layer,
	assetOnDragStart,
	rendererOnWheel,
	rendererOnMouseDown,
	rendererOnDrop,
	layerOnDragStart,
	layerOnDragOver,
	layerOnDrop,
	componentOnMouseDown,
	componentOnDragOver,
	componentOnDragLeave,
	componentOnDrop,
	selectorDirectionOnMouseDown,
	computedSelector,
	focusComponent,
	getOffsetFromParentParent,
	getOffsetFromRoot,
	getLogicalLeft,
	getLogicalTop,
	getActualLeft,
	getActualTop,
	getScaledOffset,
	getUnscaledOffset,
});
