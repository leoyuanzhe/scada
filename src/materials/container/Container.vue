<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";
import type { ComponentWithLayout } from "@/types/Component";
import type { ContainerProps } from "./Container";
import { initComponent, relayoutComponent } from "@/helpers/schema";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";

interface Props {
	component: ComponentWithLayout<ContainerProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const payload = {};
watch(
	() => props.component.components,
	() => relayoutComponent(props.component),
	{ immediate: true, deep: true }
);
initComponent(props.component, onMounted, onBeforeUnmount, payload);
</script>

<template>
	<div class="container" :style="{ backgroundColor: props.component.props.backgroundColor }">
		<ComponentCreator v-for="v in props.component.components" :key="v.id" :component="v" />
	</div>
</template>

<style scoped lang="scss"></style>
