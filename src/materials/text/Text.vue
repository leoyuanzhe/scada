<script setup lang="ts">
import type { ComponentWithLayout } from "@/types/Component";
import type { TextProps } from "./Text";
import { initComponent } from "@/helpers/component";

interface Props {
	component: ComponentWithLayout<TextProps>;
}
const props = withDefaults(defineProps<Props>(), {});
initComponent(props.component);
</script>

<template>
	<span class="text" :style="{ color: props.component.props.color }">
		{{ props.component.props.text }}
	</span>
</template>

<style scoped lang="scss"></style>
