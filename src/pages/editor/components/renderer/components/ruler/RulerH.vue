<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useClient } from "@/stores/useClient";

const clientStore = useClient();
const oCanvas = ref<HTMLCanvasElement | null>(null);
watch([() => clientStore.canvas.scale, () => clientStore.canvas.left], () => drawRuler());
onMounted(() => drawRuler());
function drawRuler() {
	const rulerStart = clientStore.canvas.left - 20;
	if (oCanvas.value) {
		oCanvas.value.width = oCanvas.value.offsetWidth;
		oCanvas.value.height = oCanvas.value.offsetHeight;
		const ctx = oCanvas.value.getContext("2d");
		if (ctx) {
			ctx.clearRect(0, 0, oCanvas.value.width, oCanvas.value.height);
			for (let i = rulerStart; i <= oCanvas.value.width; i += 50) {
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
			for (let i = rulerStart; i <= oCanvas.value.width; i += 50 / 5) {
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
</script>

<template>
	<canvas ref="oCanvas" class="ruler-h"></canvas>
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
</style>
