<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from "vue";
import type { ComponentWithLayout } from "@/types/Component";
import type { DialogProps, DialogEmitKey } from "./Dialog";
import { initComponent, triggerEmit } from "@/helpers/schema";
import MyDialog from "@/components/my-dialog/MyDialog.vue";

interface Props {
	component: ComponentWithLayout<DialogProps, DialogEmitKey>;
}
const props = withDefaults(defineProps<Props>(), {});
const styleV2 = computed(() => ({}));
const payload = { content: "" };
initComponent(props.component);
onMounted(() => triggerEmit(props.component.emits.mounted, props.component, payload));
onBeforeUnmount(() => triggerEmit(props.component.emits.beforeUnmount, props.component, payload));
</script>

<template>
	<MyDialog :show="props.component.props.show"></MyDialog>
</template>
