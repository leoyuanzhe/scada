<script lang="ts" setup>
import { computed, type StyleValue } from "vue";
import type { Material } from "@/types/Material";
import type { Component } from "@/types/Component";
import { useClient } from "@/stores/useClient";
import { useMaterial } from "@/stores/useMaterial";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/hooks/useDragger";
import { computedMousePosition, openComponentMenu } from "@/helpers/contextMenu";

interface Props {
	component: Component;
	relative?: boolean;
}
const clientStore = useClient();
const materialStore = useMaterial();
const schemaStore = useSchema();
const dragger = useDragger();
const props = withDefaults(defineProps<Props>(), {
	relative: false,
});
const styleV2 = computed(() => {
	const res: StyleValue = {};
	if (!props.relative && props.component.layout) {
		res.position = "absolute";
		res.left = props.component.layout.left + "px";
		res.top = props.component.layout.top + "px";
		res.width = props.component.layout.width + "px";
		res.height = props.component.layout.height + "px";
	}
	if (!clientStore.previewing && props.component.actived) {
		res.boxShadow = "0 0 1px 1px " + clientStore.component.activedColor;
	}
	if (!clientStore.previewing && props.component.id === schemaStore.targetComponentId) {
		res.boxShadow = "0 0 3px 3px " + clientStore.component.activedColor;
	}
	return res;
});
const RenderComponent = () =>
	(materialStore.materials.find((v) => v.key == props.component.key) as ReturnType<Material["render"]>)?.render(
		props.component
	);
</script>

<template>
	<Component
		:is="RenderComponent"
		:class="{
			component: true,
			root: schemaStore.isRoot(props.component.id),
			locked: !clientStore.previewing && props.component.locked,
			target: schemaStore.targetComponentId === props.component.id,
			moveable: schemaStore.getComponentLevel(component.id) === 2,
		}"
		v-show="!props.component.hidden"
		:style="styleV2"
		@mousedown="dragger.componentOnMouseDown($event, component)"
		@dragover.prevent="dragger.componentOnDragOver($event, component)"
		@dragleave.stop="dragger.componentOnDragLeave(component)"
		@drop.stop="dragger.componentOnDrop($event, component)"
		@contextmenu.prevent.stop="openComponentMenu(computedMousePosition($event))"
	/>
</template>

<style lang="scss" scoped>
.component {
	transition: box-shadow 0.2s;
	&.root {
		&::after {
			content: none;
		}
	}
	&.locked {
		pointer-events: none;
	}
	&.target {
		&::after {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	&.moveable {
		&::after {
			cursor: move;
		}
	}
}
</style>
