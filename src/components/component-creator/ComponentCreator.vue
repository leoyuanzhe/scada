<script lang="ts" setup>
import type { Material } from "@/types/Material";
import type { Component } from "@/types/Component";
import { useClient } from "@/stores/useClient";
import { useMaterial } from "@/stores/useMaterial";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import { computedMousePosition, openComponentMenu } from "@/helpers/contextMenu";

interface Props {
	component: Component;
}
const clientStore = useClient();
const materialStore = useMaterial();
const schemaStore = useSchema();
const dragger = useDragger();
const props = withDefaults(defineProps<Props>(), {});
const RenderComponent = () =>
	(materialStore.materials.find((v) => v.key == props.component.key) as ReturnType<Material["render"]>)?.render(
		props.component
	);
</script>

<template>
	<div
		v-if="props.component.layout"
		:class="{
			component: true,
			root: schemaStore.isRoot(props.component.id),
			actived: props.component.actived,
			target: props.component.id === schemaStore.targetComponentId,
			locked: !clientStore.previewing && props.component.locked,
			action: clientStore.enabledOperate,
		}"
		v-show="!props.component.hidden"
		:style="{
			left: props.component.layout.left + 'px',
			top: props.component.layout.top + 'px',
			width: props.component.layout.width + 'px',
			height: props.component.layout.height + 'px',
		}"
		@mousedown="dragger.componentOnMouseDown($event, component)"
		@dragover.prevent.stop
		@dragenter.stop="dragger.componentOnDragEnter(component)"
		@drop.stop="dragger.componentOnDrop($event, component)"
		@contextmenu.prevent.stop="openComponentMenu(computedMousePosition($event))"
	>
		<Component :is="RenderComponent" />
	</div>
	<Component v-else :is="RenderComponent" @mousedown="dragger.componentOnMouseDown($event, component)" />
</template>

<style lang="scss" scoped>
.component {
	position: absolute;
	transition: box-shadow 0.2s;
	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	&.root {
		&::after {
			content: none;
		}
	}
	&.actived {
		box-shadow: 0 0 1px 1px #ff0000;
	}
	&.target {
		box-shadow: 0 0 6px 3px #ff0000;
	}
	&.locked {
		pointer-events: none;
	}
	&.action {
		&::after {
			display: none;
		}
	}
}
</style>
