<script lang="ts" setup>
import { onMounted, useTemplateRef, watch } from "vue";
import { useClient } from "@/stores/useClient";

const clientStore = useClient();
const oRulerH = useTemplateRef("oRulerH");
const oRulerV = useTemplateRef("oRulerV");
watch([() => clientStore.canvas.scale, () => clientStore.canvas.left], () => drawRulerH());
watch([() => clientStore.canvas.scale, () => clientStore.canvas.top], () => drawRulerV());
onMounted(() => {
	drawRulerH();
	drawRulerV();
	window.addEventListener("resize", () => {
		drawRulerH();
		drawRulerV();
	});
});
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
</script>

<template>
	<canvas ref="oRulerH" class="ruler-h"></canvas>
	<canvas ref="oRulerV" class="ruler-v"></canvas>
</template>

<style lang="scss" scoped>
.ruler-h {
	position: absolute;
	top: 0;
	left: 20px;
	width: calc(100% - 20px);
	height: 20px;
	background-color: #444;
}
.ruler-v {
	position: absolute;
	top: 20px;
	left: 0;
	width: 20px;
	height: calc(100% - 20px);
	background-color: #444;
}
</style>
