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
let v: number | null = null;
let h: number | null = null;
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
const onHMouseEnter = (e: MouseEvent) => {
	v = Math.round(dragger.getLogicalTop(e.offsetX + 20));
	clientStore.guide.line.v.push(v);
};
const onHMouseMove = (e: MouseEvent) => {
	if (v !== null) {
		clientStore.guide.line.v[clientStore.guide.line.v.length - 1] = Math.round(
			dragger.getLogicalTop(e.offsetX + 20)
		);
	}
};
const onHMouseDown = () => {
	if (v !== null) {
		clientStore.guide.line.v.unshift(clientStore.guide.line.v[clientStore.guide.line.v.length - 1]);
	}
};
const onHMouseLeave = () => {
	if (v !== null) {
		clientStore.guide.line.v.pop();
		v = null;
	}
};
const onVMouseEnter = (e: MouseEvent) => {
	h = Math.round(dragger.getLogicalLeft(e.offsetY + 20));
	clientStore.guide.line.h.push(h);
};
const onVMouseMove = (e: MouseEvent) => {
	if (h !== null) {
		clientStore.guide.line.h[clientStore.guide.line.h.length - 1] = Math.round(
			dragger.getLogicalLeft(e.offsetY + 20)
		);
	}
};
const onVMouseDown = () => {
	if (h !== null) {
		clientStore.guide.line.h.unshift(clientStore.guide.line.h[clientStore.guide.line.h.length - 1]);
	}
};
const onVMouseLeave = () => {
	if (h !== null) {
		clientStore.guide.line.h.pop();
		h = null;
	}
};
</script>

<template>
	<template v-if="clientStore.ruler.show && !clientStore.previewing">
		<canvas
			ref="oRulerH"
			class="ruler-h"
			@mouseenter="onHMouseEnter($event)"
			@mousemove="onHMouseMove($event)"
			@mousedown="onHMouseDown()"
			@mouseleave="onHMouseLeave()"
		></canvas>
		<canvas
			ref="oRulerV"
			class="ruler-v"
			@mouseenter="onVMouseEnter($event)"
			@mousemove="onVMouseMove($event)"
			@mousedown="onVMouseDown()"
			@mouseleave="onVMouseLeave()"
		></canvas>
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
