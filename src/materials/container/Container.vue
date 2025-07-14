<script setup lang="ts">
import type { ComponentWithLayout } from "@/types/Component";
import type { ContainerProps } from "./Container";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";

interface Props {
	component: ComponentWithLayout<ContainerProps>;
}
const props = withDefaults(defineProps<Props>(), {});
// watch(
// 	() => props.component.components,
// 	() => {
// 		const moveableComponents = props.component.components.filter((v) => v.layout) as ComponentWithLayout[];
// 		if (moveableComponents.length === 1) {
// 			const childLeft = moveableComponents[0].layout.left;
// 			const childTop = moveableComponents[0].layout.top;
// 			moveableComponents[0].layout.left = 0;
// 			moveableComponents[0].layout.top = 0;
// 			props.component.layout.left = props.component.layout.left + childLeft;
// 			props.component.layout.top = props.component.layout.top + childTop;
// 			props.component.layout.width = moveableComponents[0].layout.width;
// 			props.component.layout.height = moveableComponents[0].layout.height;
// 		} else if (moveableComponents.length) {
// 			let left = Infinity;
// 			let top = Infinity;
// 			let right = -Infinity;
// 			let bottom = -Infinity;
// 			moveableComponents.forEach((component) => {
// 				left = Math.min(left, component.layout.left);
// 				top = Math.min(top, component.layout.top);
// 				right = Math.max(right, component.layout.left + component.layout.width);
// 				bottom = Math.max(bottom, component.layout.top + component.layout.height);
// 			});
// 			moveableComponents.forEach((component) => {
// 				if (component.layout.left === left) {
// 					component.layout.left = 0;
// 				} else {
// 					component.layout.left = component.layout.left - left;
// 				}
// 				if (component.layout.top === top) {
// 					component.layout.top = 0;
// 				} else {
// 					component.layout.top = component.layout.top - top;
// 				}
// 			});
// 			const width = right - left;
// 			const height = bottom - top;
// 			props.component.layout.width = width;
// 			props.component.layout.height = height;
// 		}
// 	},
// 	{ immediate: true, deep: true }
// );
</script>

<template>
	<div class="container" :style="{ backgroundColor: props.component.props.backgroundColor }">
		<ComponentCreator v-for="v in props.component.components" :key="v.id" :component="v" />
	</div>
</template>

<style scoped lang="scss">
.container {
	width: 100%;
	height: 100%;
}
</style>
