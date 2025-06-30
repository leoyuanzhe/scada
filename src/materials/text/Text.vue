<script setup lang="ts">
import type { ComponentWithLayout } from "@/types/Component";
import type { TextProps, TextEmitKey } from "./Text";
import { initComponent, triggerEmit } from "@/helpers/component";

interface Props {
	component: ComponentWithLayout<TextProps, TextEmitKey>;
}
const props = withDefaults(defineProps<Props>(), {});
initComponent(props.component);
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
