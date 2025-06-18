<script lang="ts" setup>
import { ref, useTemplateRef, watch } from "vue";
import MyDialog from "@/components/my-dialog.vue/MyDialog.vue";

interface Props {
	value: string;
}
interface Emits {
	(e: "close", returnValue?: string): void;
}
const props = withDefaults(defineProps<Props>(), {});
const emits = defineEmits<Emits>();
const oDialog = useTemplateRef("oDialog");
const value = ref("");
watch(
	() => props.value,
	(v) => {
		value.value = v;
	}
);
const close = (returnValue?: string) => oDialog.value?.close(returnValue);
const onClose = (e?: string) => {
	emits("close", e);
};
defineExpose({
	showModal: () => oDialog.value?.showModal(),
	close,
});
</script>

<template>
	<MyDialog ref="oDialog" @close="onClose($event)">
		<form @submit.prevent>
			<textarea v-model="value"></textarea>
			<aside>
				<button @click="close()">清除</button>
				<button @click="close(value)">完成</button>
			</aside>
		</form>
	</MyDialog>
</template>

<style lang="scss" scoped></style>
