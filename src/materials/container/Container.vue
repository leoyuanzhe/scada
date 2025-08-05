<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import type { ComponentWithLayout } from "@/types/Component";
import type { ContainerProps } from "./Container";
import { initComponent } from "@/helpers/schema";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";

interface Props {
	component: ComponentWithLayout<ContainerProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const payload = {};
initComponent(props.component, onMounted, onBeforeUnmount, payload);
</script>

<template>
	<div class="container" :style="{ backgroundColor: props.component.props.backgroundColor }">
		<ComponentCreator v-for="v in props.component.components" :key="v.id" :component="v" />
	</div>
</template>
