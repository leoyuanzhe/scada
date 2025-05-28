<script lang="ts" setup>
import { useMaterial } from "@/stores/useMaterial";
import { useSchema } from "@/stores/useSchema";
import type { Component } from "@/types/Component";

interface Props {
	component: Component;
}
const materialStore = useMaterial();
const schemaStore = useSchema();
const props = withDefaults(defineProps<Props>(), {});
const RenderComponent = () => materialStore.materials.find((v) => v.name == props.component.name)?.render(props.component);
</script>

<template>
	<div
		:class="{ component: true, active: props.component.active, target: props.component.id === schemaStore.targetComponentId }"
		:style="{
			left: props.component.left + 'px',
			top: props.component.top + 'px',
			width: props.component.width + 'px',
			height: props.component.height + 'px',
		}"
	>
		<Component :is="RenderComponent" />
	</div>
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
