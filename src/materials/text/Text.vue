<script setup lang="ts">
import type { ComponentWithLayout } from "@/types/Component";
import type { TextProps } from "./Text";

interface Props {
	component: ComponentWithLayout<TextProps>;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<span class="text" :style="{ color: props.component.props.color }">
		{{ props.component.props.text }}
	</span>
</template>

<style scoped lang="scss"></style>
