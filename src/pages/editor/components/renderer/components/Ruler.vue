<script lang="ts" setup>
import { nextTick, onMounted, useTemplateRef, watch } from "vue";
import { useClient } from "@/stores/useClient";
import { useDragger } from "@/pages/editor/hooks/useDragger";

const clientStore = useClient();
const dragger = useDragger();
const oRulerV = useTemplateRef("oRulerV");
const oRulerH = useTemplateRef("oRulerH");
onMounted(() => {
	watch(
		[
			() => clientStore.ruler.show,
			() => clientStore.canvas.scale,
			() => clientStore.canvas.left,
			() => clientStore.canvas.top,
		],
		() => {
			nextTick(() => {
				drawRulerV();
				drawRulerH();
			});
		},
		{ immediate: true }
	);
	window.addEventListener("resize", () => {
		drawRulerV();
		drawRulerH();
	});
});
function drawRulerV() {
	const rulerStart = clientStore.canvas.top - 20;
	if (oRulerV.value) {
		oRulerV.value.width = oRulerV.value.offsetWidth * devicePixelRatio;
		oRulerV.value.height = oRulerV.value.offsetHeight * devicePixelRatio;
		const ctx = oRulerV.value.getContext("2d");
		if (ctx) {
			ctx.clearRect(0, 0, oRulerV.value.width, oRulerV.value.height);
			ctx.save();
			ctx.scale(devicePixelRatio, devicePixelRatio);
			for (let i = rulerStart; i <= oRulerV.value.height; i += 50) {
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth = 0.5;
				ctx.moveTo(2, i);
				ctx.lineTo(20, i);
				ctx.strokeStyle = "#cccccc";
				ctx.stroke();
				ctx.font = "10px Arial";
				ctx.fillStyle = "#cccccc";
				ctx.rotate(Math.PI / 2);
				const value = Math.round((i - rulerStart) / clientStore.canvas.scale);
				ctx.fillText(value.toString(), i + 5, -2);
				ctx.restore();
			}
			for (let i = rulerStart; i <= oRulerV.value.height; i += 50 / 5) {
				if ((i - rulerStart) % 50 !== 0) {
					ctx.beginPath();
					ctx.lineWidth = 0.5;
					ctx.moveTo(15, i);
					ctx.lineTo(20, i);
					ctx.strokeStyle = "#cccccc";
					ctx.stroke();
				}
			}
		}
	}
}
function drawRulerH() {
	const rulerStart = clientStore.canvas.left - 20;
	if (oRulerH.value) {
		oRulerH.value.width = oRulerH.value.offsetWidth * devicePixelRatio;
		oRulerH.value.height = oRulerH.value.offsetHeight * devicePixelRatio;
		const ctx = oRulerH.value.getContext("2d");
		if (ctx) {
			ctx.clearRect(0, 0, oRulerH.value.width, oRulerH.value.height);
			ctx.save();
			ctx.scale(devicePixelRatio, devicePixelRatio);
			for (let i = rulerStart; i <= oRulerH.value.width; i += 50) {
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth = 0.5;
				ctx.moveTo(i, 2);
				ctx.lineTo(i, 20);
				ctx.strokeStyle = "#cccccc";
				ctx.stroke();
				ctx.font = "10px Arial";
				ctx.fillStyle = "#cccccc";
				const value = Math.round((i - rulerStart) / clientStore.canvas.scale);
				ctx.fillText(value.toString(), i + 5, 10);
				ctx.restore();
			}
			for (let i = rulerStart; i <= oRulerH.value.width; i += 50 / 5) {
				if ((i - rulerStart) % 50 !== 0) {
					ctx.beginPath();
					ctx.lineWidth = 0.5;
					ctx.moveTo(i, 15);
					ctx.lineTo(i, 20);
					ctx.strokeStyle = "#cccccc";
					ctx.stroke();
				}
			}
		}
	}
}
const vMouseDown = (e: MouseEvent) => {
	const startLeft = e.offsetX;
	clientStore.guide.line.v.push(dragger.getLogicalLeft(startLeft));
	const startX = e.clientX;
	document.body.addEventListener("mousemove", mouseMove);
	document.body.addEventListener("mouseup", mouseUp);
	function mouseMove(e: MouseEvent) {
		const dragLeft = e.clientX - startX;
		clientStore.guide.line.v[clientStore.guide.line.v.length - 1] = dragger.getLogicalLeft(startLeft + dragLeft);
	}
	function mouseUp() {
		document.body.removeEventListener("mousemove", mouseMove);
		document.body.removeEventListener("mouseup", mouseUp);
	}
};
const hMouseDown = (e: MouseEvent) => {
	const startTop = e.offsetY;
	clientStore.guide.line.h.push(dragger.getLogicalTop(startTop));
	const startY = e.clientY;
	document.body.addEventListener("mousemove", mouseMove);
	document.body.addEventListener("mouseup", mouseUp);
	function mouseMove(e: MouseEvent) {
		const dragTop = e.clientY - startY;
		clientStore.guide.line.h[clientStore.guide.line.h.length - 1] = dragger.getLogicalTop(startTop + dragTop);
	}
	function mouseUp() {
		document.body.removeEventListener("mousemove", mouseMove);
		document.body.removeEventListener("mouseup", mouseUp);
	}
};
</script>

<template>
	<canvas ref="oRulerV" v-if="clientStore.ruler.show" class="ruler-v" @mousedown.stop="vMouseDown($event)"></canvas>
	<canvas ref="oRulerH" v-if="clientStore.ruler.show" class="ruler-h" @mousedown.stop="hMouseDown($event)"></canvas>
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
