<script lang="ts" setup>
import { ref, useTemplateRef, watch } from "vue";
import MyButton from "@/components/my-button/MyButton.vue";
import MyDialog from "@/components/my-dialog/MyDialog.vue";

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
	<MyDialog ref="oDialog" @close="onClose($event)">
		<form class="code-editor" @submit.prevent>
			<textarea v-model="value"></textarea>
			<aside>
				<MyButton @click="close()">取消</MyButton>
				<MyButton variant="primary" @click="close(value)">完成</MyButton>
			</aside>
		</form>
	</MyDialog>
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
		width: 800px;
		height: 600px;
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
