<script setup lang="ts">
import { useClient } from "@/stores/useClient";

const clientStore = useClient();
</script>

<template>
	<div class="mouse-position">
		X: {{ Math.round(clientStore.mousePosition.x) }}, Y: {{ Math.round(clientStore.mousePosition.y) }}
	</div>
</template>

<style scoped lang="scss">
.mouse-position {
	position: absolute;
	right: 10px;
	bottom: 10px;
	color: #ccc;
	font-size: 12px;
	user-select: none;
}
</style>
