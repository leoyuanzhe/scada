<script setup lang="ts">
import { useSchema } from "@/stores/useSchema";
import ComponentDetails from "./components/component-details/RecursiveComponent.vue";

const schemaStore = useSchema();
</script>

<template>
	<div class="layer">
		<ComponentDetails v-for="v in schemaStore.components" :key="v.id" :component="v" />
	</div>
</template>

<style scoped lang="scss">
.layer {
	margin-left: -10px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	overflow: auto;
}
</style>
