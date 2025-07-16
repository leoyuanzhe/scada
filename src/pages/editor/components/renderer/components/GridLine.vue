<script lang="ts" setup>
import { computed } from "vue";
import { useClient } from "@/stores/useClient";

const clientStore = useClient();
const gridSize = computed(() => {
	const size = scaleSize(clientStore.grid.span * clientStore.canvas.scale);
	return size;
});
function scaleSize(size: number): number {
	size = Math.max(size, 2);
	return size < 6 ? scaleSize(size * 2) : size;
}
</script>

<template>
	<div
		v-if="clientStore.grid.enable"
		class="grid-line"
		:style="{
			backgroundPosition: `${clientStore.canvas.left - 0.5}px ${clientStore.canvas.top - 0.5}px`,
			backgroundSize: `${gridSize}px ${gridSize}px`,
		}"
	></div>
</template>

<style lang="scss" scoped>
.grid-line {
	position: absolute;
	width: 100%;
	height: 100%;
	background-image: linear-gradient(to right, #ffffff33 1px, transparent 1px),
		linear-gradient(to bottom, #ffffff33 1px, transparent 1px);
	background-repeat: repeat;
	pointer-events: none;
}
</style>
