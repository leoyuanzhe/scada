<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
import { useConsole } from "@/stores/useConsole";
import { useClient } from "@/stores/useClient";
import { useCommand } from "@/stores/useCommand";

const consoleStore = useConsole();
const clientStore = useClient();
const commandStore = useCommand();
const oDialog = useTemplateRef("oDialog");
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
onMounted(() => {
	oDialog.value?.showModal();
});
const submit = () => {
	console.log(value.value);
	try {
		const [command, ...args] = value.value.split(" ");
		if (commandStore[command as keyof typeof commandStore]) {
			(commandStore[command as keyof typeof commandStore] as Function)(...args);
		} else {
			console.log("[Info]:", "未知命令");
		}
	} catch (error) {
		console.error(error);
	} finally {
		value.value = "";
	}
};
</script>

<template>
	<dialog ref="oDialog" class="console" @close="clientStore.console.show = false">
		<code ref="oCode">
			<pre v-for="(v, i) in consoleStore.logs" :key="i" :class="{ [v.type]: true }">{{ v.message }}</pre>
		</code>
		<form @submit.prevent="submit()">
			<label for="console-input">></label>
			<input id="console-input" type="text" v-model="value" />
		</form>
	</dialog>
</template>

<style scoped lang="scss">
.console {
	margin: 0;
	padding: 0;
	max-width: none;
	width: 100%;
	max-height: none;
	height: 800px;
	background-color: #232323cc;
	border: none;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	code {
		flex: 1;
		padding: 2px;
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
		padding: 0 10px;
		height: 30px;
		display: flex;
		align-items: center;
		label {
			margin-right: 6px;
			font-size: 12px;
		}
		input {
			box-sizing: border-box;
			width: 100%;
			color: #fff;
			font-size: 14px;
			line-height: 30px;
			font-family: "Courier New", Courier, monospace;
		}
	}
}
</style>
