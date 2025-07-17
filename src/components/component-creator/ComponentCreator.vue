<script lang="ts" setup>
import type { Material } from "@/types/Material";
import type { Component } from "@/types/Component";
import { useClient } from "@/stores/useClient";
import { useMaterial } from "@/stores/useMaterial";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/pages/editor/hooks/useDragger";

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
			nestable: props.component.nestable,
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
		@dragover.prevent
		@dragenter.stop="dragger.componentOnDragEnter(component)"
		@dragleave.stop="dragger.componentOnDragLeave(component)"
		@drop.stop="dragger.componentOnDrop($event, component)"
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
	&.nestable {
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
