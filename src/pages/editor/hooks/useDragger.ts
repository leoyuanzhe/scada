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
		selector.left = e.offsetX;
		selector.top = e.offsetY;
	}
	document.body.addEventListener("mousemove", mousemove);
	document.body.addEventListener("mouseup", mouseup);
	function mousemove(e: MouseEvent) {
		console.log(e.target);
		if (clientStore.spaceKey) {
			clientStore.canvasLeft += e.movementX;
			clientStore.canvasTop += e.movementY;
		} else {
			selector.height += e.movementY;
			// 鼠标在选择器左边
			console.log(e);

			if (selector.left + e.movementX > e.offsetX) {
				if (e.movementX > 0) {
					selector.left += e.movementX;
					selector.width -= e.movementX;
				} else {
					selector.left += e.movementX;
					selector.width += -e.movementX;
				}
			} else {
				console.log("aaa");
				selector.width += e.movementX;
			}
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
			id: property.material.id,
			name: property.material.name,
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
	}
};
const componentMousedown = (component: Component) => {
	const schemaStore = useSchema();
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
