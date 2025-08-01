<script lang="ts" setup>
import { nextTick, onMounted, useTemplateRef, watch } from "vue";
import { useClient } from "@/stores/useClient";
import { useDragger } from "@/hooks/useDragger";
import { useRuler } from "@/hooks/useRuler";

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
			() => clientStore.innerWidth,
			() => clientStore.innerHeight,
		],
		() => {
			nextTick(() => {
				ruler.drawRulerH();
				ruler.drawRulerV();
			});
		},
		{ immediate: true }
	);
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
	<template v-if="clientStore.ruler.show && !clientStore.previewing">
		<canvas ref="oRulerH" class="ruler-h" @mousedown.stop="hMouseDown($event)"></canvas>
		<canvas ref="oRulerV" class="ruler-v" @mousedown.stop="vMouseDown($event)"></canvas>
		<button class="guide-eye" @click="clientStore.guide.enable = !clientStore.guide.enable">
			<svg class="icon"><use :href="clientStore.guide.enable ? '#eye-slash' : '#eye'" /></svg>
		</button>
	</template>
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
.guide-eye {
	position: absolute;
	left: 0;
	top: 0;
	width: 20px;
	height: 20px;
	color: #eee;
	background-color: #444;
	cursor: pointer;
}
</style>
