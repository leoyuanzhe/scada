<script setup lang="ts">
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "../../hooks/useDragger";
import RulerH from "./components/ruler/RulerH.vue";
import RulerV from "./components/ruler/RulerV.vue";
import RecursiveComponent from "./components/recursive-component/RecursiveComponent.vue";
import Selector from "./components/selector/Selector.vue";

const clientStore = useClient();
const schemaStore = useSchema();
const dragger = useDragger();
</script>

<template>
	<div
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
				left: clientStore.canvasLeft + 'px',
				top: clientStore.canvasTop + 'px',
				width: schemaStore.canvas.width + 'px',
				height: schemaStore.canvas.height + 'px',
				backgroundColor: schemaStore.canvas.backgroundColor,
				transform: `scale(${clientStore.canvasScale})`,
			}"
			@dragover.prevent
			@drop="dragger.canvasDrap($event)"
		>
			<RecursiveComponent v-for="v in schemaStore.components" :key="v.id" :component="v" @mousedown.stop="dragger.componentMousedown(v)" />
		</div>
		<RulerH />
		<RulerV />
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
