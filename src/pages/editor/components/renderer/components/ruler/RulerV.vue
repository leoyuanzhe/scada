<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useClient } from "@/stores/useClient";

const clientStore = useClient();
const oCanvas = ref<HTMLCanvasElement | null>(null);
watch([() => clientStore.canvas.scale, () => clientStore.canvas.top], () => drawRuler());
onMounted(() => drawRuler());
function drawRuler() {
	const rulerStart = clientStore.canvas.top - 20;
	if (oCanvas.value) {
		oCanvas.value.width = oCanvas.value.offsetWidth;
		oCanvas.value.height = oCanvas.value.offsetHeight;
		const ctx = oCanvas.value.getContext("2d");
		if (ctx) {
			ctx.clearRect(0, 0, oCanvas.value.width, oCanvas.value.height);
			for (let i = rulerStart; i <= oCanvas.value.height; i += 50) {
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
			for (let i = rulerStart; i <= oCanvas.value.height; i += 50 / 5) {
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
	<canvas ref="oCanvas" class="ruler-v"></canvas>
</template>

<style lang="scss" scoped>
.ruler-v {
	position: absolute;
	top: 20px;
	left: 0;
	width: 20px;
	height: calc(100% - 20px);
	background-color: #444;
}
</style>
