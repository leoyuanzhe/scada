<script setup lang="ts">
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";
import { computed } from "vue";

const clientStore = useClient();
const schemaStore = useSchema();
const styleV2 = computed(() => {
	if (clientStore.previewing) {
		if (schemaStore.currentRootComponent?.layout) {
			return {
				width: schemaStore.currentRootComponent?.layout?.width + "px",
				height: schemaStore.currentRootComponent?.layout?.height + "px",
				transform:
					"scale(" +
					clientStore.innerWidth / schemaStore.currentRootComponent.layout.width +
					", " +
					clientStore.innerHeight / schemaStore.currentRootComponent.layout.height +
					")",
				transformOrigin: "0 0",
			};
		}
	} else {
		return {
			left: clientStore.canvas.left + "px",
			top: clientStore.canvas.top + "px",
			width: schemaStore.currentRootComponent?.layout?.width + "px",
			height: schemaStore.currentRootComponent?.layout?.height + "px",
			transform: "scale(" + clientStore.canvas.scale + ")",
			transformOrigin: "0 0",
		};
	}
});
</script>

<template>
	<div class="root-component" :style="styleV2">
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
}
</style>
