<script lang="ts" setup>
import { onMounted, useTemplateRef } from "vue";

interface Props {}
interface Emits {
	(e: "close", returnValue?: string): void;
}
withDefaults(defineProps<Props>(), {});
const emits = defineEmits<Emits>();
let returnValue: string | undefined = "";
const oDialog = useTemplateRef("oDialog");
onMounted(() => {
	oDialog.value!.onclose = () => {
		emits("close", returnValue);
	};
});
defineExpose({
	showModal: () => oDialog.value?.showModal(),
	close: (e?: string) => {
		returnValue = e;
		oDialog.value?.close(e);
	},
});
</script>

<template>
	<dialog ref="oDialog" class="my-dialog">
		<slot></slot>
	</dialog>
</template>

<style lang="scss" scoped>
.my-dialog {
	padding: 0;
	border: none;
	&::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
	}
}
</style>
