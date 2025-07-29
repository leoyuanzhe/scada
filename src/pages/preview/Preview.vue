<script setup lang="ts">
import { useClient } from "@/stores/useClient";
import Renderer from "../editor/components/renderer/Renderer.vue";

const clientStore = useClient();
clientStore.previewing = true;
clientStore.enableOperate();
</script>

<template>
	<Renderer class="renderer" />
</template>

<style scoped lang="scss">
.renderer {
	width: 100vw;
	height: 100vh;
}
</style>
