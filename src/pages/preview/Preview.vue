<script setup lang="ts">
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import Renderer from "@/components/renderer/Renderer.vue";

const clientStore = useClient();
const schemaStore = useSchema();
init();
function init() {
	clientStore.previewing = true;
	clientStore.enableOperate();
	try {
		const json = JSON.parse(localStorage.getItem("schema") || "{}");
		schemaStore.setSchema(json);
	} catch (error) {
		alert("预览大屏失败");
		console.error(error);
	}
}
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
