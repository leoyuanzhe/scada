import { reactive } from "vue";
import { useClient } from "@/stores/useClient";
import { useProperty } from "@/stores/useProperty";
import { useSchema } from "@/stores/useSchema";
import type { Component } from "@/types/Component";
import type { SelectorDirection } from "../types/Selector";

const selector = reactive({
	left: 0,
	top: 0,
	width: 0,
	height: 0,
});
const propertyDragstart = (e: DragEvent, propertyId: string) => {
	const propertyStore = useProperty();
	const item = propertyStore.properties.find((v) => v.id === propertyId);
	if (item) {
		e.dataTransfer?.setData("propertyId", item.id);
	}
};
const rendererWheel = (e: WheelEvent) => {
	const clientStore = useClient();
	if (e.ctrlKey) {
		e.preventDefault();
		if (e.deltaY > 0) {
			clientStore.canvasScale = Math.max(clientStore.canvasScale - 0.04, 0.01);
		} else {
			clientStore.canvasScale += 0.04;
		}
	}
};
const rendererMousedown = (e: MouseEvent) => {
	const clientStore = useClient();
	const schemaStore = useSchema();
	selector.left = 0;
	selector.top = 0;
	selector.width = 0;
	selector.height = 0;
	if (!clientStore.spaceKey) {
		schemaStore.components.forEach((v) => v.active && (v.active = false));
		schemaStore.targetComponentId = "";
	}
	const oRenderer = document.querySelector(".renderer") as HTMLDivElement;
	const startX = e.clientX; // 鼠标按下时的X坐标
	const startY = e.clientY;
	const startLeft = e.pageX - oRenderer.offsetLeft; // 鼠标按下时的选择器的Left
	const startTop = e.pageY - oRenderer.offsetTop;
	let left = startLeft; // 选择器的Left
	let top = startTop;
	let width = 0; // 选择器的Width
	let height = 0;
	document.body.addEventListener("mousemove", mousemove);
	document.body.addEventListener("mouseup", mouseup);
	function mousemove(e: MouseEvent) {
		if (clientStore.spaceKey) {
			clientStore.canvasLeft += e.movementX;
			clientStore.canvasTop += e.movementY;
		} else {
			const moveX = e.clientX - startX; // 移动的X轴距离
			const moveY = e.clientY - startY;
			// 鼠标向左框选
			if (e.clientX < startX) {
				left = startLeft - -moveX;
				width = -moveX;
			} else {
				left = startLeft;
				width = moveX;
			}
			if (e.clientY < startY) {
				top = startTop - -moveY;
				height = -moveY;
			} else {
				top = startTop;
				height = moveY;
			}
			selector.left = left;
			selector.top = top;
			selector.width = width;
			selector.height = height;
		}
	}
	function mouseup(e: MouseEvent) {
		if (!e.shiftKey) {
			schemaStore.components.forEach((v) => v.active && (v.active = false));
		}
		// 正框选（从左往右框选）
		if (startX < e.clientX) {
			schemaStore.components.forEach((component) => {
				const rect = getComponentRect(component);
				if (rect.left >= selector.left && rect.left + rect.width <= selector.left + selector.width && rect.top >= selector.top && rect.top + rect.height <= selector.top + selector.height) {
					component.active = true;
				}
			});
		} else {
			schemaStore.components.forEach((component) => {
				const rect = getComponentRect(component);
				if (rect.left < selector.left + selector.width && rect.left + rect.width > selector.left && rect.top < selector.top + selector.height && rect.top + rect.height > selector.top) {
					component.active = true;
				}
			});
		}
		selector.left = 0;
		selector.top = 0;
		selector.width = 0;
		selector.height = 0;
		computedSelector();
		document.body.removeEventListener("mousemove", mousemove);
		document.body.removeEventListener("mouseup", mouseup);
	}
};
const canvasDrap = (e: DragEvent) => {
	const propertyStore = useProperty();
	const schemaStore = useSchema();
	const propertyId = e.dataTransfer?.getData("propertyId");
	const property = propertyStore.properties.find((v) => v.id === propertyId);
	if (property) {
		e.dataTransfer?.setData("propertyId", property.id);
		const component: Component = {
			id: Date.now().toString(),
			name: property.material.name,
			title: property.material.title,
			active: true,
			nestable: property.material.nestable,
			locked: property.material.locked,
			hidden: property.material.hidden,
			snap: property.material.snap,
			left: e.offsetX - property.material.width / 2,
			top: e.offsetY - property.material.height / 2,
			width: property.material.width,
			height: property.material.height,
			props: property.material.props,
			children: property.material.children,
		};
		schemaStore.components.push(component);
		computedSelector();
	}
};
const componentMousedown = (e: MouseEvent, component: Component) => {
	const schemaStore = useSchema();
	if (!e.shiftKey) {
		if (!component.active) schemaStore.components.forEach((v) => v.active && (v.active = false));
	}
	component.active = true;
	schemaStore.targetComponentId = component.id;
	computedSelector();
	document.body.addEventListener("mousemove", mousemove);
	document.body.addEventListener("mouseup", mouseup);
	function mousemove(e: MouseEvent) {
		schemaStore.activeComponents.forEach((component) => {
			component.left += getScaledOffset(e.movementX);
			component.top += getScaledOffset(e.movementY);
		});
		computedSelector();
	}
	function mouseup() {
		document.body.removeEventListener("mousemove", mousemove);
		document.body.removeEventListener("mouseup", mouseup);
	}
};
const selectorMousedown = (direction: SelectorDirection) => {
	const schemaStore = useSchema();
	document.body.addEventListener("mousemove", mousemove);
	document.body.addEventListener("mouseup", mouseup);
	function mousemove(e: MouseEvent) {
		if (schemaStore.targetComponent) {
			const movementX = getScaledOffset(e.movementX);
			const movementY = getScaledOffset(e.movementY);
			switch (direction) {
				case "t":
					if (schemaStore.targetComponent.height + -movementY > 0) {
						schemaStore.targetComponent.top += movementY;
						schemaStore.targetComponent.height += -movementY;
					}
					break;

				case "tr":
					if (schemaStore.targetComponent.height + -movementY > 0 && schemaStore.targetComponent.width + movementX > 0) {
						schemaStore.targetComponent.top += movementY;
						schemaStore.targetComponent.width += movementX;
						schemaStore.targetComponent.height += -movementY;
					}
					break;
				case "r":
					if (schemaStore.targetComponent.width + movementX > 0) {
						schemaStore.targetComponent.width += movementX;
					}
					break;
				case "rb":
					if (schemaStore.targetComponent.height + movementY > 0 && schemaStore.targetComponent.width + movementX > 0) {
						schemaStore.targetComponent.width += movementX;
						schemaStore.targetComponent.height += movementY;
					}
					break;
				case "b":
					if (schemaStore.targetComponent.height + movementY > 0) {
						schemaStore.targetComponent.height += movementY;
					}
					break;
				case "lb":
					if (schemaStore.targetComponent.height + movementY > 0 && schemaStore.targetComponent.width + -movementX > 0) {
						schemaStore.targetComponent.left += movementX;
						schemaStore.targetComponent.width += -movementX;
						schemaStore.targetComponent.height += movementY;
					}
					break;
				case "l":
					if (schemaStore.targetComponent.width + -movementX > 0) {
						schemaStore.targetComponent.left += movementX;
						schemaStore.targetComponent.width += -movementX;
					}
					break;
				case "lt":
					if (schemaStore.targetComponent.height + -movementY > 0 && schemaStore.targetComponent.width + -movementX > 0) {
						schemaStore.targetComponent.left += movementX;
						schemaStore.targetComponent.top += movementY;
						schemaStore.targetComponent.width += -movementX;
						schemaStore.targetComponent.height += -movementY;
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
};
const computedSelector = () => {
	const schemaStore = useSchema();
	if (schemaStore.activeComponents.length > 0) {
		const rect = getComponentRect(schemaStore.activeComponents[0]);
		selector.left = rect.left;
		selector.top = rect.top;
		selector.width = rect.width;
		selector.height = rect.height;
	}
	schemaStore.activeComponents.forEach((component) => {
		const rect = getComponentRect(component);
		if (rect.left < selector.left) {
			selector.width += selector.left - rect.left;
			selector.left = rect.left;
		}
		if (rect.top < selector.top) {
			selector.height += selector.top - rect.top;
			selector.top = rect.top;
		}
		selector.width = Math.max(selector.width, rect.left + rect.width - selector.left);
		selector.height = Math.max(selector.height, rect.top + rect.height - selector.top);
	});
};
// 获取组件相对于渲染器的真实坐标
function getComponentRect(component: Component) {
	const clientStore = useClient();
	return {
		left: component.left * clientStore.canvasScale + clientStore.canvasLeft,
		top: component.top * clientStore.canvasScale + clientStore.canvasTop,
		width: component.width * clientStore.canvasScale,
		height: component.height * clientStore.canvasScale,
	};
}
// 获取偏移量与画布的缩放比例计算后的真实偏移量
function getScaledOffset(offset: number) {
	const clientStore = useClient();
	return offset / clientStore.canvasScale;
}

export const useDragger = () => ({
	selector,
	propertyDragstart,
	rendererWheel,
	rendererMousedown,
	canvasDrap,
	componentMousedown,
	selectorMousedown,
	computedSelector,
});
