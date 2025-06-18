<script lang="ts" setup>
import { onMounted, useTemplateRef } from "vue";

interface Props {}
interface Emits {
	(e: "close", returnValue?: string): void;
}
withDefaults(defineProps<Props>(), {});
const emits = defineEmits<Emits>();
let returnValue: string | undefined = "";
const oMyDialog = useTemplateRef("oMyDialog");
onMounted(() => {
	oMyDialog.value!.onclose = () => {
		emits("close", returnValue);
	};
});
defineExpose({
	showModal: () => oMyDialog.value?.showModal(),
	close: (e?: string) => {
		returnValue = e;
		oMyDialog.value?.close(e);
	},
});
</script>

<template>
	<Teleport to="body">
		<dialog ref="oMyDialog" class="my-dialog">
			<slot></slot>
		</dialog>
	</Teleport>
</template>

<style lang="scss" scoped>
.my-dialog {
	// position: fixed;
	// top: 0;
	// left: 0;
	// margin: 0;
	// padding: 0;
	// max-width: none;
	// max-height: none;
	// width: 100vw;
	// height: 100vh;
	border: none;
	// overflow-y: auto;
}
</style>
