<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from "vue";
import { useConsole } from "@/stores/useConsole";
import { useCommand } from "@/stores/useCommand";

const consoleStore = useConsole();
const commandStore = useCommand();
interface Props {
	height: number;
}
interface Emits {
	(e: "update:height", height: number): void;
}
const props = withDefaults(defineProps<Props>(), {});
const emits = defineEmits<Emits>();
const oCode = useTemplateRef("oCode");
const value = ref("");
watch(
	() => consoleStore.logs,
	() => {
		nextTick(() => {
			if (oCode.value) {
				oCode.value.scrollTop = oCode.value.scrollHeight;
			}
		});
	},
	{ deep: true, immediate: true }
);
const resizerOnMouseDown = (e: MouseEvent) => {
	document.body.addEventListener("mousemove", onMouseMove);
	document.body.addEventListener("mouseup", onMouseUp);
	const startY = e.clientY;
	const startHeight = props.height;
	function onMouseMove(e: MouseEvent) {
		const moveY = e.clientY - startY;
		emits("update:height", Math.max(startHeight - moveY, 55));
	}
	function onMouseUp() {
		document.body.removeEventListener("mousemove", onMouseMove);
		document.body.removeEventListener("mouseup", onMouseUp);
	}
};
const submit = () => {
	console.log(value.value);
	try {
		const [command, ...args] = value.value.split(" ");
		if (commandStore[command as keyof typeof commandStore]) {
			(commandStore[command as keyof typeof commandStore] as Function)(...args);
		} else {
			console.log("未知命令");
		}
	} catch (error) {
		console.error(error);
	} finally {
		value.value = "";
	}
};
</script>

<template>
	<div class="console" :style="{ height: props.height + 'px' }">
		<code ref="oCode">
			<pre v-for="(v, i) in consoleStore.logs" :key="i" :class="{ [v.type]: true }">{{ v.message }}</pre>
		</code>
		<form @submit.prevent="submit()">
			<input type="text" v-model="value" />
		</form>
		<div class="resizer" @mousedown="resizerOnMouseDown($event)"></div>
	</div>
</template>

<style scoped lang="scss">
.console {
	position: relative;
	background-color: #111;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	code {
		flex: 1;
		white-space: pre;
		overflow: auto;
		pre {
			margin: 0;
			font-size: 12px;
			font-family: "Courier New", Courier, monospace;
			line-height: 12px;
			text-wrap: wrap;
			word-break: break-all;
			&.log {
				color: #ccc;
			}
			&.info {
				color: var(--primary-color);
				font-weight: bold;
			}
			&.warn {
				color: var(--warning-color);
			}
			&.error {
				color: var(--danger-color);
			}
		}
	}
	form {
		box-sizing: border-box;
		flex-shrink: 0;
		height: 30px;
		border: none;
		background-color: #232323;
		border-top: 1px solid transparent;
		transition: border-color 0.2s;
		input {
			box-sizing: border-box;
			padding: 0 8px;
			width: 100%;
			color: #fff;
			font-size: 14px;
			line-height: 30px;
			font-family: "Courier New", Courier, monospace;
		}
		&:focus-within {
			border-color: var(--primary-color);
		}
	}
	.resizer {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 4px;
		background-color: var(--primary-color);
		transition: opacity 0.2s;
		cursor: row-resize;
		z-index: 1;
		opacity: 0;
		&:hover {
			opacity: 1;
		}
	}
}
</style>
