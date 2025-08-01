import { useClient } from "@/stores/useClient";
import { ref } from "vue";

const oRulerH = ref<HTMLCanvasElement | null>(null);
const oRulerV = ref<HTMLCanvasElement | null>(null);
const drawRulerH = () => {
	const clientStore = useClient();
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
				ctx.strokeStyle = "#eeeeee";
				ctx.stroke();
				ctx.font = "10px Arial";
				ctx.fillStyle = "#eeeeee";
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
					ctx.strokeStyle = "#eeeeee";
					ctx.stroke();
				}
			}
		}
	}
};
const drawRulerV = () => {
	const clientStore = useClient();
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
				ctx.strokeStyle = "#eeeeee";
				ctx.stroke();
				ctx.font = "10px Arial";
				ctx.fillStyle = "#eeeeee";
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
					ctx.strokeStyle = "#eeeeee";
					ctx.stroke();
				}
			}
		}
	}
};

export const useRuler = () => ({ oRulerH, oRulerV, drawRulerH, drawRulerV });
