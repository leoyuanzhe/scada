<script setup lang="ts">
import type { Component } from "@/types/Component";
import type { PageProps } from "./Page";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";

interface Props {
	component: Component<PageProps>;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<div class="page">
		<ComponentCreator v-for="v in props.component.components" :key="v.id" :component="v" />
	</div>
</template>

<style scoped lang="scss"></style>
