<script lang="ts" setup>
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { useMaterial } from "@/stores/useMaterial";
import type { Component } from "@/types/Component";

interface Props {
	component: Component;
}
const materialStore = useMaterial();
const targetComponent = useTargetComponent();
const props = withDefaults(defineProps<Props>(), {});
const RenderComponent = () => materialStore.materials.find((v) => v.key == props.component.key)?.render(props.component);
</script>

<template>
	<div
		v-if="component.moveable"
		:class="{ component: true, active: props.component.active, target: props.component.id === targetComponent.componentId.value }"
		:style="{
			left: props.component.props.left + 'px',
			top: props.component.props.top + 'px',
			width: props.component.props.width + 'px',
			height: props.component.props.height + 'px',
		}"
	>
		<Component :is="RenderComponent" />
	</div>
	<Component v-else :is="RenderComponent" />
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
		box-shadow: 0 0 3px 3px #ff0000;
	}
}
</style>
