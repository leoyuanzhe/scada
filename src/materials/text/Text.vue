<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from "vue";
import type { ComponentWithLayout } from "@/types/Component";
import type { TextProps, TextEmitKey } from "./Text";
import { initComponent, triggerEmit } from "@/helpers/schema";

interface Props {
	component: ComponentWithLayout<TextProps, TextEmitKey>;
}
const props = withDefaults(defineProps<Props>(), {});
const styleV2 = computed(() => ({
	color: props.component.props.fontColor,
	fontSize: props.component.props.fontSize + "px",
	fontStyle: props.component.props.fontStyle,
	fontWeight: props.component.props.fontWeight,
	fontFamily: props.component.props.fontFamily,
	textAlign: props.component.props.textAlign,
	textDecorationLine: props.component.props.textDecorationLine,
	lineHeight: props.component.props.lineHeight + "px",
	backgroundColor: props.component.props.backgroundColor,
	borderWidth: props.component.props.borderWidth + "px",
	borderColor: props.component.props.borderColor,
	borderStyle: props.component.props.borderStyle,
	borderRadius: props.component.props.borderRadius + "px",
}));
const payload = { content: "" };
initComponent(props.component);
onMounted(() => triggerEmit(props.component.emits.mounted, props.component, payload));
onBeforeUnmount(() => triggerEmit(props.component.emits.beforeUnmount, props.component, payload));
</script>

<template>
	<span
		class="text"
		:style="styleV2"
		@click="
			(payload.content = props.component.props.content),
				triggerEmit(props.component.emits.click, props.component, payload, $event)
		"
		@dblclick="
			(payload.content = props.component.props.content),
				triggerEmit(props.component.emits.dblclick, props.component, payload, $event)
		"
	>
		{{ props.component.props.content }}
	</span>
</template>

<style lang="scss" scoped>
.text {
	display: block;
}
</style>
