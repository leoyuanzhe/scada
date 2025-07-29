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
			width: schemaStore.currentRootComponent?.layout?.width + 'px',
			height: schemaStore.currentRootComponent?.layout?.height + 'px',
			transform: 'scale(' + clientStore.canvas.scale + ')',
		}"
	>
		<ComponentCreator v-if="schemaStore.currentRootComponent" :component="schemaStore.currentRootComponent">
			<ComponentCreator
				v-for="v in schemaStore.currentRootComponent?.components ?? []"
				:key="v.id"
				:component="v"
			/>
		</ComponentCreator>
	</div>
</template>

<style scoped lang="scss">
.root-component {
	position: absolute;
	transform-origin: 0 0;
}
</style>
