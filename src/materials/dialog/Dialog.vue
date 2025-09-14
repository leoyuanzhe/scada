<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, useTemplateRef, watch } from "vue";
import type { Component } from "@/types/Component";
import type { DialogProps, DialogEmitKey } from "./Dialog";
import { initComponent, triggerEmit } from "@/helpers/schema";
import MyDialog from "@/components/my-dialog/MyDialog.vue";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";

interface Props {
	component: Component<DialogProps, DialogEmitKey>;
}
const props = withDefaults(defineProps<Props>(), {});
const oDialog = useTemplateRef("oDialog");
const styleV2 = computed(() => ({}));
const payload = { content: "" };
initComponent(props.component);
onMounted(() => triggerEmit(props.component.emits.mounted, props.component, payload));
onBeforeUnmount(() => triggerEmit(props.component.emits.beforeUnmount, props.component, payload));
watch(
	() => props.component.props.show,
	() => {
		if (props.component.props.show) {
			oDialog.value?.showModal();
		} else {
			oDialog.value?.close();
		}
	},
	{ immediate: true }
);
</script>

<template>
	<MyDialog ref="oDialog" @close="props.component.props.show = false">
		<ComponentCreator v-for="v in props.component.components" :key="v.id" :component="v" relative />
	</MyDialog>
</template>
