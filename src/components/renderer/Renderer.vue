<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import { useClient } from "@/stores/useClient";
import { useDragger } from "@/hooks/useDragger";
import RootComponent from "./components/RootComponent.vue";
import MousePosition from "./components/MousePosition.vue";
import GridLine from "./components/GridLine.vue";
import Ruler from "./components/Ruler.vue";
import GuideLine from "./components/GuideLine.vue";
import SnapLine from "./components/SnapLine.vue";
import Selector from "./components/Selector.vue";

const router = useRouter();
const clientStore = useClient();
const dragger = useDragger();
const oRenderer = useTemplateRef("oRenderer");
onMounted(() => {
	clientStore.oRenderer = oRenderer.value;
});
</script>

<template>
	<div
		ref="oRenderer"
		id="renderer"
		:class="{
			renderer: true,
			moving: clientStore.keyboard.spaceKey,
			operating: clientStore.enabledOperate,
		}"
		@wheel="dragger.rendererOnWheel($event)"
		@mousemove="dragger.rendererOnMouseMove($event)"
		@mousedown="dragger.rendererOnMouseDown($event)"
		@dragover.prevent
		@drop="dragger.rendererOnDrop(router)"
	>
		<GridLine />
		<RootComponent />
		<MousePosition />
		<GuideLine />
		<SnapLine />
		<Ruler />
		<Selector />
	</div>
</template>

<style scoped lang="scss">
.renderer {
	position: relative;
	overflow: hidden;
	user-select: none;
	&.moving {
		cursor: grab;
	}
	&.operating {
		user-select: auto;
	}
}
</style>
