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
		const moveableComponents = props.component.components.filter((v) => v.moveable);
		if (moveableComponents.length === 1) {
			const childLeft = moveableComponents[0].props.left;
			const childTop = moveableComponents[0].props.top;
			moveableComponents[0].props.left = 0;
			moveableComponents[0].props.top = 0;
			props.component.props.left = props.component.props.left + childLeft;
			props.component.props.top = props.component.props.top + childTop;
			props.component.props.width = moveableComponents[0].props.width;
			props.component.props.height = moveableComponents[0].props.height;
		} else if (moveableComponents.length) {
			let left = Infinity;
			let top = Infinity;
			let right = -Infinity;
			let bottom = -Infinity;
			moveableComponents.forEach((component) => {
				left = Math.min(left, component.props.left);
				top = Math.min(top, component.props.top);
				right = Math.max(right, component.props.left + component.props.width);
				bottom = Math.max(bottom, component.props.top + component.props.height);
			});
			moveableComponents.forEach((component) => {
				if (component.props.left === left) {
					component.props.left = 0;
				} else {
					component.props.left = component.props.left - left;
				}
				if (component.props.top === top) {
					component.props.top = 0;
				} else {
					component.props.top = component.props.top - top;
				}
			});
			const width = right - left;
			const height = bottom - top;
			props.component.props.width = width;
			props.component.props.height = height;
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
