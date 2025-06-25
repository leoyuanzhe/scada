<script lang="ts" setup>
import { ref, useTemplateRef, watch } from "vue";
import Button from "@/components/button/Button.vue";
import Dialog from "@/components/dialog/Dialog.vue";

interface Props {
	value: string;
}
interface Emits {
	(e: "cancel"): void;
	(e: "confirm", returnValue: string): void;
}
const props = withDefaults(defineProps<Props>(), {});
const emits = defineEmits<Emits>();
const oDialog = useTemplateRef("oDialog");
const value = ref("");
watch(
	() => props.value,
	(v) => {
		value.value = v;
	},
	{ immediate: true }
);
const close = (returnValue?: string) => oDialog.value?.close(returnValue);
const onClose = (e?: string) => {
	if (e !== undefined) emits("confirm", e);
	else emits("cancel");
};
defineExpose({
	showModal: () => oDialog.value?.showModal(),
	close,
});
</script>

<template>
	<Dialog ref="oDialog" @close="onClose($event)">
		<form class="code-editor" @submit.prevent>
			<textarea v-model="value"></textarea>
			<aside>
				<Button @click="close()">取消</Button>
				<Button variant="primary" @click="close(value)">完成</Button>
			</aside>
		</form>
	</Dialog>
</template>

<style lang="scss" scoped>
.code-editor {
	padding: 20px;
	display: flex;
	flex-direction: column;
	background-color: #232323;
	row-gap: 20px;
	textarea {
		padding: 10px;
		width: 400px;
		height: 300px;
		resize: none;
		background-color: #000;
		border-radius: 10px;
	}
	aside {
		display: flex;
		column-gap: 10px;
	}
}
</style>
