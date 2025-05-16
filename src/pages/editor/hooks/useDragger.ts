import { useClient } from "@/stores/useClient";
import { useProperty } from "@/stores/useProperty";
import { useSchema } from "@/stores/useSchema";
import type { Component } from "@/types/Component";

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
const rendererMousedown = () => {
	const clientStore = useClient();
	document.body.addEventListener("mousemove", mousemove);
	document.body.addEventListener("mouseup", mouseup);
	function mousemove(e: MouseEvent) {
		if (clientStore.spaceKey) {
			clientStore.canvasLeft += e.movementX;
			clientStore.canvasTop += e.movementY;
		}
	}
	function mouseup() {
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

export const useDragger = () => ({
	propertyDragstart,
	rendererWheel,
	rendererMousedown,
	canvasDrap,
});
