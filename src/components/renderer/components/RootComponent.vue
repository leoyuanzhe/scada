<script setup lang="ts">
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";
import { computed, type StyleValue } from "vue";

const clientStore = useClient();
const schemaStore = useSchema();
const styleV2 = computed<StyleValue>(() => {
	const res: StyleValue = {
		left: "0",
		top: "0",
		width: schemaStore.currentRootComponent?.layout?.width + "px",
		height: schemaStore.currentRootComponent?.layout?.height + "px",
	};
	if (clientStore.previewing) {
		if (schemaStore.currentRootComponent?.layout) {
			// res.transform =
			// 	"scale(" +
			// 	clientStore.innerWidth / schemaStore.currentRootComponent.layout.width +
			// 	", " +
			// 	clientStore.innerHeight / schemaStore.currentRootComponent.layout.height +
			// 	")";
			let ratio = clientStore.innerWidth / schemaStore.currentRootComponent.layout.width;
			res.top = "50%";
			res.left = "50%";
			if (clientStore.innerHeight < schemaStore.currentRootComponent.layout.height * ratio) {
				ratio = clientStore.innerHeight / schemaStore.currentRootComponent.layout.height;
			}
			res.transform = "scale(" + ratio + ") translateY(-50%) translateX(-50%)";
		}
	} else {
		res.transform = "scale(" + clientStore.canvas.scale + ")";
		res.left = clientStore.canvas.left + "px";
		res.top = clientStore.canvas.top + "px";
	}
	return res;
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
	transform-origin: 0 0;
}
</style>
