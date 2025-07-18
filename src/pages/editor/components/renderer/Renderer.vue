<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import { useClient } from "@/stores/useClient";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import CanvasComponent from "./components/Canvas.vue";
import GridLine from "./components/GridLine.vue";
import Ruler from "./components/Ruler.vue";
import GuideLine from "./components/GuideLine.vue";
import SnapLine from "./components/SnapLine.vue";
import Selector from "./components/Selector.vue";

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
		@mousedown="dragger.rendererOnMouseDown($event)"
		@dragover.prevent
		@drop="dragger.rendererOnDrop($event)"
	>
		<CanvasComponent />
		<GridLine />
		<Ruler />
		<GuideLine />
		<SnapLine />
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
