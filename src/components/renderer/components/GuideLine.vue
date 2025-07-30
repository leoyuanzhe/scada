<script lang="ts" setup>
import { useClient } from "@/stores/useClient";
import { useDragger } from "@/pages/editor/hooks/useDragger";

const clientStore = useClient();
const dragger = useDragger();
const vMouseDown = (e: MouseEvent, index: number) => {
	const startLeft = clientStore.guide.line.v[index];
	const startX = e.clientX;
	document.body.addEventListener("mousemove", mouseMove);
	document.body.addEventListener("mouseup", mouseUp);
	function mouseMove(e: MouseEvent) {
		const dragLeft = dragger.getUnscaledOffset(e.clientX - startX);
		clientStore.guide.line.v[index] = Math.round(startLeft + dragLeft);
	}
	function mouseUp() {
		document.body.removeEventListener("mousemove", mouseMove);
		document.body.removeEventListener("mouseup", mouseUp);
	}
};
const hMouseDown = (e: MouseEvent, index: number) => {
	const startTop = clientStore.guide.line.h[index];
	const startY = e.clientY;
	document.body.addEventListener("mousemove", mouseMove);
	document.body.addEventListener("mouseup", mouseUp);
	function mouseMove(e: MouseEvent) {
		const dragTop = dragger.getUnscaledOffset(e.clientY - startY);
		clientStore.guide.line.h[index] = Math.round(startTop + dragTop);
	}
	function mouseUp() {
		document.body.removeEventListener("mousemove", mouseMove);
		document.body.removeEventListener("mouseup", mouseUp);
	}
};
</script>

<template>
	<template v-if="clientStore.guide.enable && !clientStore.previewing">
		<div
			v-for="(v, i) in clientStore.guide.line.v"
			:key="i"
			class="guide-line-v"
			:style="{ left: dragger.getActualLeft(v) + 'px' }"
			@mousedown.stop="vMouseDown($event, i)"
			@dblclick="clientStore.guide.line.v.splice(i, 1)"
		></div>
		<div
			v-for="(v, i) in clientStore.guide.line.h"
			:key="i"
			class="guide-line-h"
			:style="{ top: dragger.getActualTop(v) + 'px' }"
			@mousedown.stop="hMouseDown($event, i)"
			@dblclick="clientStore.guide.line.h.splice(i, 1)"
		></div>
	</template>
</template>

<style lang="scss" scoped>
.guide-line-v {
	position: absolute;
	top: 0;
	width: 1px;
	height: 100%;
	background-color: #ff0000;
	transform: translateX(-50%);
	cursor: move;
}
.guide-line-h {
	position: absolute;
	left: 0;
	width: 100%;
	height: 1px;
	background-color: #ff0000;
	transform: translateY(-50%);
	cursor: move;
}
</style>
