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
	() => props.component.children,
	() => {
		if (props.component.children.length) {
			let left = Infinity;
			let top = Infinity;
			let right = -Infinity;
			let bottom = -Infinity;
			props.component.children.forEach((component) => {
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
		<ComponentCreator v-for="v in props.component.children" :key="v.id" :component="v" />
	</div>
</template>

<style scoped lang="scss"></style>
