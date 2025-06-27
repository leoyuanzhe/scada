<script lang="ts" setup>
import type { Material } from "@/types/Material";
import type { Component } from "@/types/Component";
import { useMaterial } from "@/stores/useMaterial";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import { useClient } from "@/stores/useClient";

interface Props {
	component: Component;
}
const clientStore = useClient();
const materialStore = useMaterial();
const targetComponent = useTargetComponent();
const dragger = useDragger();
const props = withDefaults(defineProps<Props>(), {});
const RenderComponent = () => (materialStore.materials.find((v) => v.key == props.component.key) as ReturnType<Material["render"]>)?.render(props.component);
</script>

<template>
	<div
		v-if="props.component.layout"
		:class="{
			component: true,
			active: props.component.active,
			target: props.component.id === targetComponent.componentId.value,
			locked: !clientStore.isPreview && props.component.locked,
			action: clientStore.action.enable,
		}"
		v-show="!props.component.hidden"
		:style="{
			left: props.component.layout.left + 'px',
			top: props.component.layout.top + 'px',
			width: props.component.layout.width + 'px',
			height: props.component.layout.height + 'px',
		}"
		@mousedown="dragger.componentMousedown($event, component)"
		@drop.stop="dragger.componentDrop($event, component)"
	>
		<Component :is="RenderComponent" />
	</div>
	<Component v-else :is="RenderComponent" @mousedown="dragger.componentMousedown($event, component)" />
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
	&.active {
		box-shadow: 0 0 1px 1px #ff0000cc;
	}
	&.target {
		box-shadow: 0 0 3px 1px #ff0000;
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
