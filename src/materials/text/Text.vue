<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import type { ComponentWithLayout } from "@/types/Component";
import type { TextProps, TextEmitKey } from "./Text";
import { initState, initProps, triggerEmit } from "@/helpers/component";

interface Props {
	component: ComponentWithLayout<TextProps, TextEmitKey>;
}
const props = withDefaults(defineProps<Props>(), {});
initState(props.component);
initProps(props.component);
onMounted(() => triggerEmit(props.component.emits.mounted, props.component));
onBeforeUnmount(() => triggerEmit(props.component.emits.beforeUnmount, props.component));
</script>

<template>
	<span
		class="text"
		:style="{ color: props.component.props.color }"
		@click="triggerEmit(props.component.emits.click, props.component, $event, props.component.props.text)"
		@dblclick="triggerEmit(props.component.emits.dblclick, props.component, $event, props.component.props.text)"
	>
		{{ props.component.props.text }}
	</span>
</template>

<style scoped lang="scss"></style>
