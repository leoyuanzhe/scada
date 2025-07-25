<script setup lang="ts">
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";

const clientStore = useClient();
const schemaStore = useSchema();
</script>

<template>
	<div
		class="root-component"
		:style="{
			left: clientStore.canvas.left + 'px',
			top: clientStore.canvas.top + 'px',
			width: schemaStore.currentComponent?.layout?.width + 'px',
			height: schemaStore.currentComponent?.layout?.height + 'px',
			transform: 'scale(' + clientStore.canvas.scale + ')',
		}"
	>
		<ComponentCreator v-if="schemaStore.currentComponent" :component="schemaStore.currentComponent">
			<ComponentCreator v-for="v in schemaStore.currentComponent?.components ?? []" :key="v.id" :component="v" />
		</ComponentCreator>
	</div>
</template>

<style scoped lang="scss">
.root-component {
	position: absolute;
	transform-origin: 0 0;
}
</style>
