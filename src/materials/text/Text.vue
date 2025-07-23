<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import type { ComponentWithLayout } from "@/types/Component";
import type { TextProps, TextEmitKey } from "./Text";
import { initState, initProps, triggerEmit } from "@/helpers/schema";

interface Props {
	component: ComponentWithLayout<TextProps, TextEmitKey>;
}
const props = withDefaults(defineProps<Props>(), {});
const payload = { text: "" };
initState.call(props.component);
initProps.call(props.component);
onMounted(() => triggerEmit(props.component.emits.mounted, props.component, payload));
onBeforeUnmount(() => triggerEmit(props.component.emits.beforeUnmount, props.component, payload));
</script>

<template>
	<span
		class="text"
		:style="{ color: props.component.props.color }"
		@click="
			(payload.text = props.component.props.text),
				triggerEmit(props.component.emits.click, props.component, payload, $event)
		"
		@dblclick="
			(payload.text = props.component.props.text),
				triggerEmit(props.component.emits.dblclick, props.component, payload, $event)
		"
	>
		{{ props.component.props.text }}
	</span>
</template>

<style scoped lang="scss"></style>
