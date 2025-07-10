<script setup lang="ts">
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import { computedMousePosition, openComponentMenu } from "@/helpers/contextMenu";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";

const clientStore = useClient();
const schemaStore = useSchema();
const dragger = useDragger();
</script>

<template>
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
		@drop="dragger.canvasOnDrop($event)"
		@contextmenu.prevent.stop="openComponentMenu(computedMousePosition($event))"
	>
		<ComponentCreator v-for="v in schemaStore.components" :key="v.id" :component="v" />
	</div>
</template>

<style scoped lang="scss">
.canvas {
	position: absolute;
	transform-origin: 0 0;
}
</style>
