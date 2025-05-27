<script lang="ts" setup>
import { useClient } from "@/stores/useClient";

const clientStore = useClient();
</script>

<template>
	<div
		v-if="clientStore.grid.enableSnap"
		class="grid-lines"
		:style="{
			backgroundPosition: `${clientStore.canvas.left - 0.5}px ${clientStore.canvas.top - 0.5}px`,
			backgroundSize: `${clientStore.grid.span * clientStore.canvas.scale}px ${clientStore.grid.span * clientStore.canvas.scale}px`,
		}"
	></div>
</template>

<style lang="scss" scoped>
.grid-lines {
	position: absolute;
	width: 100%;
	height: 100%;
	background-image: linear-gradient(to right, #ffffff33 1px, transparent 1px), linear-gradient(to bottom, #ffffff33 1px, transparent 1px);
	background-repeat: repeat;
	pointer-events: none;
}
</style>
