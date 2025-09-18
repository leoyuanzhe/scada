<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import type { ComponentWithLayout } from "@/types/Component";
import type { PageProps } from "./Page";
import { initComponent, triggerEmit } from "@/helpers/schema";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";

interface Props {
	component: ComponentWithLayout<PageProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const payload = {};
initComponent(props.component);
onMounted(() => triggerEmit(props.component.emits.mounted, props.component, payload));
onBeforeUnmount(() => triggerEmit(props.component.emits.beforeUnmount, props.component, payload));
</script>

<template>
	<div class="page" :style="{ backgroundColor: props.component.props.backgroundColor }">
		<ComponentCreator v-for="v in props.component.components" :key="v.id" :component="v" />
	</div>
</template>

<style lang="scss" scoped>
.page {
}
</style>
