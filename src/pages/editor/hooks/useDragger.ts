import { reactive } from "vue";
import { useClient } from "@/stores/useClient";
import { useProperty } from "@/stores/useProperty";
import { useSchema } from "@/stores/useSchema";
import type { Component } from "@/types/Component";

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
	if (clientStore.ctrlKey) {
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
	if (!clientStore.spaceKey) {
		schemaStore.components.forEach((v) => v.active && (v.active = false));
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
	function mouseup() {
		selector.left = 0;
		selector.top = 0;
		selector.width = 0;
		selector.height = 0;
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
		console.log(schemaStore.components);
	}
};
const componentMousedown = (e: MouseEvent, component: Component) => {
	const clientStore = useClient();
	const schemaStore = useSchema();
	if (e.ctrlKey) {
		e.preventDefault();
	} else {
		schemaStore.components.forEach((v) => v.active && (v.active = false));
	}
	component.active = true;
	document.body.addEventListener("mousemove", mousemove);
	document.body.addEventListener("mouseup", mouseup);
	function mousemove(e: MouseEvent) {}
	function mouseup() {
		document.body.removeEventListener("mousemove", mousemove);
		document.body.removeEventListener("mouseup", mouseup);
	}
};

export const useDragger = () => ({
	selector,
	propertyDragstart,
	rendererWheel,
	rendererMousedown,
	canvasDrap,
	componentMousedown,
});
