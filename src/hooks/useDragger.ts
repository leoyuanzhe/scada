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
const selector = reactive({ left: 0, top: 0, width: 0, height: 0 });
// 吸附对齐线
const snapLine = reactive({ v: null as number | null, h: null as number | null });
// 拖拽中的组件
const dataTransfer = reactive({
	dragStartAsset: null as Asset | null,
	dragStartComponent: null as Component | null,
	dragOverComponent: null as Component | null,
	layerPosition: null as "before" | "after" | null,
});
const assetOnDragStart = (asset: Asset) => {
	const assetStore = useAsset();
	const schemaStore = useSchema();
	const item = assetStore.assets.find((v) => v.id === asset.id);
	if (item) {
		schemaStore.deactivateAllComponent();
		selector.left = 0;
		selector.top = 0;
		selector.width = 0;
		selector.height = 0;
		dataTransfer.dragStartAsset = item;
	}
};
const rendererOnWheel = (e: WheelEvent) => {
	const clientStore = useClient();
	if ((e.ctrlKey || e.metaKey) && clientStore.oRenderer) {
		e.preventDefault();
		console.log(e);
		const offsetX = e.clientX - clientStore.oRenderer.offsetLeft - clientStore.canvas.left;
		const offsetY = e.clientY - clientStore.oRenderer.offsetTop - clientStore.canvas.top;
		const originalOffsetX = offsetX / clientStore.canvas.scale;
		const originalOffsetY = offsetY / clientStore.canvas.scale;
		let newScale = 0;
		if (e.deltaY > 0) newScale = Math.max(clientStore.canvas.scale - e.deltaY / 800, 0.1);
		else newScale = Math.min(clientStore.canvas.scale - e.deltaY / 800, 5);
		const newOffsetX = originalOffsetX * newScale;
		const newOffsetY = originalOffsetY * newScale;
		const newLeft = clientStore.canvas.left + (offsetX - newOffsetX);
		const newTop = clientStore.canvas.top + (offsetY - newOffsetY);
		clientStore.canvas.left = newLeft;
		clientStore.canvas.top = newTop;
		clientStore.canvas.scale = newScale;
		computedSelector();
	}
};
const rendererOnMouseMove = (e: MouseEvent) => {
	const clientStore = useClient();
	if (clientStore.oRenderer && !clientStore.previewing) {
		clientStore.mousePosition.x = getScaledOffset(
			e.clientX - clientStore.oRenderer.offsetLeft - clientStore.canvas.left
		);
		clientStore.mousePosition.y = getScaledOffset(
			e.clientY - clientStore.oRenderer.offsetTop - clientStore.canvas.top
		);
	}
};
const rendererOnMouseDown = (e: MouseEvent) => {
	if (e.button === 0) {
		const clientStore = useClient();
		const schemaStore = useSchema();
		if (!clientStore.previewing && !clientStore.enabledOperate && clientStore.oRenderer) {
			const offsetX = e.pageX - clientStore.oRenderer.offsetLeft; // 选择器的offsetX
			const offsetY = e.pageY - clientStore.oRenderer.offsetTop;
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
						schemaStore.moveableVisibleUnlockedSelectableComponents.forEach((component) => {
							const left = getActualLeft(component.layout.left);
							const top = getActualTop(component.layout.top);
							const width = getUnscaledOffset(component.layout.width);
							const height = getUnscaledOffset(component.layout.height);
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
						schemaStore.moveableVisibleUnlockedSelectableComponents.forEach((component) => {
							const left = getActualLeft(component.layout.left);
							const top = getActualTop(component.layout.top);
							const width = getUnscaledOffset(component.layout.width);
							const height = getUnscaledOffset(component.layout.height);
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
const rendererOnDrop = (router: Router) => {
	const schemaStore = useSchema();
	const commandStore = useCommand();
	if (dataTransfer.dragStartAsset) {
		const newComponent = assetTransferComponent(dataTransfer.dragStartAsset);
		if (newComponent.layout) {
			newComponent.layout.left = 0;
			newComponent.layout.top = 0;
		}
		commandStore.createRootComponent(newComponent);
		schemaStore.deactivateAllComponent();
		dataTransfer.dragStartAsset = null;
		router.replace("/editor?id=" + newComponent.id);
	}
};
const componentOnMouseDown = (e: MouseEvent, component: Component) => {
	const clientStore = useClient();
	const schemaStore = useSchema();
	if (clientStore.keyboard.spaceKey || !component.selectable) return;
	if (!schemaStore.isRoot(component.id)) e.stopPropagation();
	if (clientStore.previewing || clientStore.enabledOperate || schemaStore.isRoot(component.id)) return;
	const parent = schemaStore.findParent(component.id).parent;
	if (parent && !schemaStore.isRoot(parent.id) && !schemaStore.isSchema(parent)) {
		componentOnMouseDown(e, parent);
		return;
	}
	focusComponent(e, component);
	if (!component.moveable || schemaStore.getComponentLevel(component.id) !== 2) return;
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
						...schemaStore.unactivedMoveableComponents
							.filter((v) => {
								return schemaStore.activedMoveableFlatedComponents.some(
									(v2) => !schemaStore.isContains(v2, v.id)
								);
							})
							.flatMap((v) => [
								getActualLeft(v.layout.left),
								getActualLeft(v.layout.left + v.layout.width / 2),
								getActualLeft(v.layout.left + v.layout.width),
								...v.layout.snap.v.map((v2) => getActualLeft(v.layout.left + v.layout.width * v2)),
							]),
						...clientStore.guide.line.v.map((v) => getActualLeft(v)),
					],
					h: [
						getActualTop(0),
						getActualTop((schemaStore.currentRootComponent?.layout?.height ?? 0) / 2),
						getActualTop(schemaStore.currentRootComponent?.layout?.height ?? 0),
						...schemaStore.unactivedMoveableComponents
							.filter((v) => {
								return schemaStore.activedMoveableFlatedComponents.some(
									(v2) => !schemaStore.isContains(v2, v.id)
								);
							})
							.flatMap((v) => [
								getActualTop(v.layout.top),
								getActualTop(v.layout.top + v.layout.height / 2),
								getActualTop(v.layout.top + v.layout.height),
								...v.layout.snap.h.map((v2) => getActualTop(v.layout.top + v.layout.height * v2)),
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
		const leftV = snapLines.v.find((v) => Math.abs(v - dragLeft) < getUnscaledOffset(clientStore.snap.distance)); // 组件的左边定位到的垂直吸附线
		const middleV = snapLines.v.find(
			(v) => Math.abs(v - dragLeft - selector.width / 2) < getUnscaledOffset(clientStore.snap.distance)
		);
		const rightV = snapLines.v.find(
			(v) => Math.abs(v - dragLeft - selector.width) < getUnscaledOffset(clientStore.snap.distance)
		);
		if (leftV !== undefined) {
			const left = getLogicalLeft(leftV); // 将吸附线left值转换为画布的left值
			schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
				component.layout.left =
					getScaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
			});
			snapLine.v = left;
		} else if (middleV !== undefined) {
			const middle = getLogicalLeft(middleV);
			const left = middle - getScaledOffset(selector.width / 2);
			schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
				component.layout.left =
					getScaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
			});
			snapLine.v = middle;
		} else if (rightV !== undefined) {
			const right = getLogicalLeft(rightV);
			const left = right - getScaledOffset(selector.width);
			schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
				component.layout.left =
					getScaledOffset(startActiveComponentsPosition[index].left - startSelectorLeft) + left;
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
		const topH = snapLines.h.find((v) => Math.abs(v - dragTop) < getUnscaledOffset(clientStore.snap.distance)); // 组件的左边定位到的垂直吸附线
		const middleH = snapLines.h.find(
			(v) => Math.abs(v - dragTop - selector.height / 2) < clientStore.snap.distance
		);
		const bottomH = snapLines.h.find((v) => Math.abs(v - dragTop - selector.height) < clientStore.snap.distance);
		if (topH !== undefined) {
			const top = getLogicalTop(topH); // 将吸附线left值转换为画布的left值
			schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
				component.layout.top =
					getScaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
			});
			snapLine.h = top;
		} else if (middleH !== undefined) {
			const middle = getLogicalTop(middleH);
			const top = middle - getScaledOffset(selector.height / 2);
			schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
				component.layout.top =
					getScaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
			});
			snapLine.h = middle;
		} else if (bottomH !== undefined) {
			const right = getLogicalTop(bottomH);
			const top = right - getScaledOffset(selector.height);
			schemaStore.activedMoveableFlatedComponents.forEach((component, index) => {
				component.layout.top =
					getScaledOffset(startActiveComponentsPosition[index].top - startSelectorTop) + top;
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
const componentOnDrop = (e: DragEvent, parent: Component) => {
	const commandStore = useCommand();
	const schemaStore = useSchema();
	if (parent.nestable) {
		let newComponent = null;
		if (dataTransfer.dragStartAsset) {
			newComponent = assetTransferComponent(dataTransfer.dragStartAsset);
		} else if (dataTransfer.dragStartComponent) {
			newComponent = dataTransfer.dragStartComponent;
			schemaStore.deleteComponent(newComponent.id);
		}
		if (newComponent) {
			const { left, top } = getOffsetFromRoot(parent);
			if (parent.autoReplace) {
				if (newComponent?.layout && parent.layout) {
					newComponent.layout.left = left;
					newComponent.layout.top = top;
					newComponent.layout.width = parent.layout.width;
					newComponent.layout.height = parent.layout.height;
				}
				const { parent: parentParent } = schemaStore.findParent(parent.id);
				if (parentParent && !schemaStore.isSchema(parentParent)) {
					schemaStore.deleteComponent(parent.id);
					commandStore.createComponent(newComponent);
					schemaStore.joinGroup(newComponent, parentParent);
				}
			} else {
				if (newComponent.layout) {
					newComponent.layout.left = e.offsetX + left - (newComponent.layout.width ?? 0) / 2;
					newComponent.layout.top = e.offsetY + top - (newComponent.layout.height ?? 0) / 2;
				}
				commandStore.createComponent(newComponent);
				schemaStore.joinGroup(newComponent, parent);
			}
			dataTransfer.dragStartAsset = null;
			dataTransfer.dragStartComponent = null;
			dataTransfer.dragOverComponent = null;
			dataTransfer.layerPosition = null;
		}
	}
};
const layerOnMouseDown = (e: MouseEvent, component: Component, router?: Router) => {
	const schemaStore = useSchema();
	const root = schemaStore.findRoot(component);
	if (root && root.id !== schemaStore.currentRootId) {
		router?.replace("/editor?id=" + root.id);
	}
	focusComponent(e, component, router);
};
const layerOnDragStart = (component: Component) => {
	const schemaStore = useSchema();
	schemaStore.deactivateAllComponent();
	dataTransfer.dragStartComponent = component;
};
const layerOnDragOver = (e: DragEvent, component: Component) => {
	const schemaStore = useSchema();
	if (
		dataTransfer.dragStartComponent!.id !== component.id &&
		!schemaStore.isContains(dataTransfer.dragStartComponent!, component.id)
	) {
		e.stopPropagation();
		schemaStore.deactivateAllComponent();
		if (e.offsetY <= 5) {
			// 组件的上边
			dataTransfer.layerPosition = "before";
			dataTransfer.dragOverComponent = component;
			component.actived = true;
		} else if (e.offsetY >= (e.target as HTMLDetailsElement).offsetHeight - 5) {
			// 组件的下边
			dataTransfer.layerPosition = "after";
			dataTransfer.dragOverComponent = component;
			component.actived = true;
		} else if (component.nestable) {
			dataTransfer.layerPosition = null;
			dataTransfer.dragOverComponent = component;
			component.actived = true;
		}
	}
};
const layerOnDragLeave = (component: Component) => {
	component.actived = false;
	dataTransfer.dragOverComponent = null;
	dataTransfer.layerPosition = null;
};
const layerOnDrop = () => {
	const schemaStore = useSchema();
	const commandStore = useCommand();
	const dragger = useDragger();
	if (dataTransfer.dragStartComponent && dataTransfer.dragOverComponent) {
		if (dataTransfer.layerPosition === null && dataTransfer.dragOverComponent!.nestable) {
			if (dataTransfer.dragOverComponent.autoReplace)
				commandStore.replaceComponent(dataTransfer.dragStartComponent, dataTransfer.dragOverComponent);
			else commandStore.joinGroup(dataTransfer.dragStartComponent.id, dataTransfer.dragOverComponent.id);
		} else if (dataTransfer.layerPosition === "before") {
			commandStore.insertBefore(dataTransfer.dragStartComponent.id, dataTransfer.dragOverComponent.id);
		} else if (dataTransfer.layerPosition === "after") {
			commandStore.insertAfter(dataTransfer.dragStartComponent.id, dataTransfer.dragOverComponent.id);
		}
		schemaStore.deactivateAllComponent();
		schemaStore.targetComponentId = dataTransfer.dragStartComponent.id;
		dataTransfer.dragStartComponent.actived = true;
		dragger.computedSelector();
	}
	dataTransfer.dragStartAsset = null;
	dataTransfer.dragStartComponent = null;
	dataTransfer.dragOverComponent = null;
	dataTransfer.layerPosition = null;
};
const boneDragOver = (component: Component) => {
	dataTransfer.dragOverComponent = component;
};
const boneDragLeave = () => {
	dataTransfer.dragOverComponent = null;
	dataTransfer.layerPosition = null;
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
			const moveX = Math.round(getScaledOffset(e.clientX - startX)); // 移动的X轴距离
			const moveY = Math.round(getScaledOffset(e.clientY - startY)); // 移动的X轴距离
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
	if (!e.shiftKey && !component.actived) schemaStore.deactivateAllComponent();
	component.actived = true;
	schemaStore.targetComponentId = component.id;
	computedSelector();
	if (schemaStore.isRoot(component.id)) {
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
// 获取逻辑左边距（像素->画布逻辑单位）
function getLogicalLeft(left: number) {
	const clientStore = useClient();
	return (left - clientStore.canvas.left) / clientStore.canvas.scale;
}
// 获取逻辑上边距
function getLogicalTop(top: number) {
	const clientStore = useClient();
	return (top - clientStore.canvas.top) / clientStore.canvas.scale;
}
// 获取实际左边距（画布逻辑单位->像素）
function getActualLeft(left: number) {
	const clientStore = useClient();
	return left * clientStore.canvas.scale + clientStore.canvas.left;
}
// 获取实际上边距
function getActualTop(top: number) {
	const clientStore = useClient();
	return top * clientStore.canvas.scale + clientStore.canvas.top;
}
// 获取实际坐标（画布逻辑单位->像素）
function getUnscaledOffset(number: number) {
	const clientStore = useClient();
	return number * clientStore.canvas.scale;
}
// 获取逻辑坐标（像素->画布逻辑单位）
function getScaledOffset(number: number) {
	const clientStore = useClient();
	return number / clientStore.canvas.scale;
}

export const useDragger = () => ({
	selector,
	snapLine,
	dataTransfer,
	assetOnDragStart,
	rendererOnWheel,
	rendererOnMouseMove,
	rendererOnMouseDown,
	rendererOnDrop,
	layerOnMouseDown,
	layerOnDragStart,
	layerOnDragOver,
	layerOnDragLeave,
	layerOnDrop,
	componentOnMouseDown,
	componentOnDragOver,
	componentOnDragLeave,
	componentOnDrop,
	boneDragOver,
	boneDragLeave,
	selectorDirectionOnMouseDown,
	computedSelector,
	focusComponent,
	getOffsetFromParentParent,
	getOffsetFromRoot,
	getLogicalLeft,
	getLogicalTop,
	getActualLeft,
	getActualTop,
	getUnscaledOffset,
	getScaledOffset,
});
