<script setup lang="ts">
import { reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClient } from "@/stores/useClient";
import { useMaterial } from "@/stores/useMaterial";
import { useAsset } from "@/stores/useAsset";
import { useSchema } from "@/stores/useSchema";
import { useRuler } from "@/hooks/useRuler";
import { useDragger } from "@/hooks/useDragger";
import MenuBar from "./components/MenuBar.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import Renderer from "@/components/renderer/Renderer.vue";
import Setter from "./components/setter/Setter.vue";

const route = useRoute();
const router = useRouter();
const clientStore = useClient();
const materialStore = useMaterial();
const assetStore = useAsset();
const schemaStore = useSchema();
const dragger = useDragger();
const ruler = useRuler();
const layout = reactive({
	setterWidth: 400,
});
init();
async function init() {
	clientStore.init();
	materialStore.init();
	assetStore.init();
	await schemaStore.init();
	watch(
		() => route.query.id,
		(id) => {
			if (id) schemaStore.currentRootId = id as string;
			if (!schemaStore.currentRootComponent && schemaStore.components[0]?.id)
				router.replace("/editor?id=" + schemaStore.components[0].id);
		},
		{ immediate: true }
	);
	if (
		schemaStore.targetComponent &&
		schemaStore.findRoot(schemaStore.targetComponent)?.id !== schemaStore.currentRootId
	) {
		schemaStore.targetComponentId = "";
		schemaStore.deactivateAllComponent();
		dragger.computedSelector();
	}
}
const onUpdateSetterWidth = (e: number) => {
	layout.setterWidth = e;
	ruler.drawRulerH();
};
</script>

<template>
	<div class="editor" :style="{ gridTemplateColumns: '300px auto ' + layout.setterWidth + 'px' }">
		<MenuBar class="menu-bar" />
		<Sidebar class="sidebar" />
		<Renderer class="renderer" />
		<Setter class="setter" :width="layout.setterWidth" @update:width="onUpdateSetterWidth($event)" />
	</div>
</template>

<style scoped lang="scss">
.editor {
	height: 100vh;
	display: grid;
	background-color: #232323;
	grid-template-areas:
		"menu-bar menu-bar menu-bar"
		"sidebar renderer setter";
	grid-template-rows: 40px auto;
	.menu-bar {
		grid-area: menu-bar;
		box-shadow: 0 0 3px 1px #666;
		z-index: 2;
	}
	.sidebar {
		grid-area: sidebar;
		box-shadow: 0 0 3px 1px #666;
		z-index: 1;
	}
	.renderer {
		grid-area: renderer;
	}
	.setter {
		grid-area: setter;
		box-shadow: 0 0 3px 1px #666;
		z-index: 1;
	}
}
</style>
