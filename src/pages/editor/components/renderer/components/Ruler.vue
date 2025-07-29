<script lang="ts" setup>
import { nextTick, onMounted, useTemplateRef, watch } from "vue";
import { useClient } from "@/stores/useClient";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import { useRuler } from "@/pages/editor/hooks/useRuler";

const clientStore = useClient();
const dragger = useDragger();
const ruler = useRuler();
const oRulerH = useTemplateRef("oRulerH");
const oRulerV = useTemplateRef("oRulerV");
onMounted(() => {
	ruler.oRulerH.value = oRulerH.value;
	ruler.oRulerV.value = oRulerV.value;
	watch(
		[
			() => clientStore.ruler.show,
			() => clientStore.canvas.scale,
			() => clientStore.canvas.left,
			() => clientStore.canvas.top,
		],
		() => {
			nextTick(() => {
				ruler.drawRulerH();
				ruler.drawRulerV();
			});
		},
		{ immediate: true }
	);
	window.addEventListener("resize", () => {
		ruler.drawRulerV();
		ruler.drawRulerH();
	});
});
const hMouseDown = (e: MouseEvent) => {
	const startTop = e.offsetY;
	clientStore.guide.line.h.push(dragger.getLogicalTop(startTop));
	const startY = e.clientY;
	document.body.addEventListener("mousemove", mouseMove);
	document.body.addEventListener("mouseup", mouseUp);
	function mouseMove(e: MouseEvent) {
		const dragTop = e.clientY - startY;
		clientStore.guide.line.h[clientStore.guide.line.h.length - 1] = Math.round(
			dragger.getLogicalTop(startTop + dragTop)
		);
	}
	function mouseUp() {
		document.body.removeEventListener("mousemove", mouseMove);
		document.body.removeEventListener("mouseup", mouseUp);
	}
};
const vMouseDown = (e: MouseEvent) => {
	const startLeft = e.offsetX;
	clientStore.guide.line.v.push(dragger.getLogicalLeft(startLeft));
	const startX = e.clientX;
	document.body.addEventListener("mousemove", mouseMove);
	document.body.addEventListener("mouseup", mouseUp);
	function mouseMove(e: MouseEvent) {
		const dragLeft = e.clientX - startX;
		clientStore.guide.line.v[clientStore.guide.line.v.length - 1] = Math.round(
			dragger.getLogicalLeft(startLeft + dragLeft)
		);
	}
	function mouseUp() {
		document.body.removeEventListener("mousemove", mouseMove);
		document.body.removeEventListener("mouseup", mouseUp);
	}
};
</script>

<template>
	<canvas ref="oRulerH" v-if="clientStore.ruler.show" class="ruler-h" @mousedown.stop="hMouseDown($event)"></canvas>
	<canvas ref="oRulerV" v-if="clientStore.ruler.show" class="ruler-v" @mousedown.stop="vMouseDown($event)"></canvas>
</template>

<style lang="scss" scoped>
.ruler-v {
	position: absolute;
	top: 20px;
	left: 0;
	width: 20px;
	height: calc(100% - 20px);
	background-color: #444;
	cursor: crosshair;
}
.ruler-h {
	position: absolute;
	top: 0;
	left: 20px;
	width: calc(100% - 20px);
	height: 20px;
	background-color: #444;
	cursor: crosshair;
}
</style>
