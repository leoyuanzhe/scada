<script setup lang="ts">
import { watch } from "vue";
import type { ComponentWithLayout } from "@/types/Component";
import type { ContainerProps } from "./Container";
import { relayoutComponent } from "@/helpers/component";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";

interface Props {
	component: ComponentWithLayout<ContainerProps>;
}
const props = withDefaults(defineProps<Props>(), {});
watch(
	() => props.component.components,
	() => relayoutComponent(props.component),
	{ immediate: true, deep: true }
);
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
