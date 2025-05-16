<script setup lang="ts">
import type { Component } from "@/types/Component";
import ComponentCreator from "./ComponentCreator.vue";

interface Props {
	component: Component;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<ComponentCreator :component="props.component">
		<RecursiveComponent v-for="v in props.component.children" :key="v.id" :component="v" />
	</ComponentCreator>
</template>
