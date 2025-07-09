<script setup lang="ts">
import { useSchema } from "@/stores/useSchema";
import ComponentDetails from "./components/component-details/RecursiveComponent.vue";
import { computedMousePosition, openComponentMenu } from "@/helpers/contextMenu";

const schemaStore = useSchema();
</script>

<template>
	<div class="layer" @contextmenu.prevent.stop="openComponentMenu(computedMousePosition($event))">
		<ComponentDetails v-for="v in schemaStore.components" :key="v.id" :component="v" />
	</div>
</template>

<style scoped lang="scss">
.layer {
	padding: 10px;
	display: flex;
	flex-direction: column;
	overflow: auto;
}
</style>
