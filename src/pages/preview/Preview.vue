<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useClient } from "@/stores/useClient";
import { useMaterial } from "@/stores/useMaterial";
import { useAsset } from "@/stores/useAsset";
import { useSchema } from "@/stores/useSchema";
import Renderer from "@/components/renderer/Renderer.vue";

const route = useRoute();
const clientStore = useClient();
const materialStore = useMaterial();
const assetStore = useAsset();
const schemaStore = useSchema();
init();
function init() {
	clientStore.init();
	materialStore.init();
	assetStore.init();
	schemaStore.init();
	clientStore.previewing = true;
	clientStore.enableOperate();
	watch(
		() => route.query.id,
		(id) => {
			if (id) schemaStore.currentRootId = id as string;
			document.title = [schemaStore.title, schemaStore.currentRootComponent?.title ?? "Scada"].join(" - ");
		},
		{ immediate: true }
	);
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
