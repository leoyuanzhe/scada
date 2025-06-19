<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import GridLines from "./components/grid-lines/GridLines.vue";
import RulerH from "./components/ruler/RulerH.vue";
import RulerV from "./components/ruler/RulerV.vue";
import AlignLineV from "./components/align-line/AlignLineV.vue";
import AlignLineH from "./components/align-line/AlignLineH.vue";
import ComponentCreator from "./components/component-creator/ComponentCreator.vue";
import Selector from "./components/selector/Selector.vue";

const clientStore = useClient();
const schemaStore = useSchema();
const dragger = useDragger();
const oRenderer = useTemplateRef("oRenderer");

onMounted(() => {
	clientStore.oRenderer = oRenderer.value;
	// watch([() => schemaStore.layout.width, () => schemaStore.layout.height], () => clientStore.computedCanvasLayout(), { immediate: true });
});
</script>

<template>
	<div
		ref="oRenderer"
		id="renderer"
		class="renderer"
		:style="{
			cursor: clientStore.spaceKey ? 'move' : 'default',
		}"
		@wheel="dragger.rendererWheel($event)"
		@mousedown="dragger.rendererMousedown($event)"
	>
		<div
			class="canvas"
			:style="{
				left: clientStore.canvas.left + 'px',
				top: clientStore.canvas.top + 'px',
				width: schemaStore.layout.width + 'px',
				height: schemaStore.layout.height + 'px',
				backgroundColor: schemaStore.props.backgroundColor,
				transform: 'scale(' + clientStore.canvas.scale + ')',
			}"
			@dragover.prevent
			@drop="dragger.canvasDrap($event)"
		>
			<ComponentCreator v-for="v in schemaStore.components" :key="v.id" :component="v" />
		</div>
		<GridLines />
		<RulerH />
		<RulerV />
		<AlignLineV />
		<AlignLineH />
		<Selector />
	</div>
</template>

<style scoped lang="scss">
.renderer {
	position: relative;
	overflow: hidden;
	user-select: none;
	.canvas {
		position: absolute;
		transform-origin: 0 0;
	}
}
</style>
