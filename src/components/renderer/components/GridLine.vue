<script lang="ts" setup>
import { computed } from "vue";
import { useClient } from "@/stores/useClient";

const clientStore = useClient();
const styleV2 = computed(() => {
	const size = scaleSize(clientStore.grid.span * clientStore.canvas.scale);
	return {
		backgroundPosition: `${clientStore.canvas.left - 0.5}px ${clientStore.canvas.top - 0.5}px`,
		backgroundSize: `${size}px ${size}px`,
	};
});
function scaleSize(size: number): number {
	size = Math.max(size, 2);
	return size < 6 ? scaleSize(size * 2) : size;
}
</script>

<template>
	<div v-if="clientStore.grid.enable && !clientStore.previewing" class="grid-line" :style="styleV2"></div>
</template>

<style lang="scss" scoped>
.grid-line {
	position: absolute;
	width: 100%;
	height: 100%;
	background-repeat: repeat;
	pointer-events: none;
	background-image: linear-gradient(to right, #333333 1px, transparent 1px),
		linear-gradient(to bottom, #333333 1px, transparent 1px);
}
</style>
