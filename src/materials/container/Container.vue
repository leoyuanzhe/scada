<script setup lang="ts">
import { watch } from "vue";
import type { Component } from "@/types/Component";
import ComponentCreator from "@/pages/editor/components/renderer/components/component-creator/ComponentCreator.vue";
import type { ContainerProps } from "./Container";

interface Props {
	component: Component<ContainerProps>;
}
const props = withDefaults(defineProps<Props>(), {});
watch(
	() => props.component.components,
	() => {
		if (props.component.components.length === 1) {
			const childLeft = props.component.components[0].left;
			const childTop = props.component.components[0].top;
			props.component.components[0].left = 0;
			props.component.components[0].top = 0;
			props.component.left = props.component.left + childLeft;
			props.component.top = props.component.top + childTop;
			props.component.width = props.component.components[0].width;
			props.component.height = props.component.components[0].height;
		} else if (props.component.components.length) {
			let left = Infinity;
			let top = Infinity;
			let right = -Infinity;
			let bottom = -Infinity;
			props.component.components.forEach((component) => {
				left = Math.min(left, component.left);
				top = Math.min(top, component.top);
				right = Math.max(right, component.left + component.width);
				bottom = Math.max(bottom, component.top + component.height);
			});
			const width = right - left;
			const height = bottom - top;
			props.component.width = width;
			props.component.height = height;
		}
	},
	{ immediate: true, deep: true }
);
</script>

<template>
	<div class="container">
		<ComponentCreator v-for="v in props.component.components" :key="v.id" :component="v" />
	</div>
</template>

<style scoped lang="scss"></style>
