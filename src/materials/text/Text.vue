<script setup lang="ts">
import { computed } from "vue";
import type { ComponentWithLayout } from "@/types/Component";
import type { TextProps } from "./Text";
import { getComputedProps } from "@/helpers/material";

interface Props {
	component: ComponentWithLayout<TextProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const propsV2 = computed(() => getComputedProps(props.component));
</script>

<template>
	<span class="text" :style="{ color: propsV2.color.value }">
		{{ propsV2.text.value }}
	</span>
</template>

<style scoped lang="scss"></style>
