<script setup lang="ts">
import type { Component } from "@/types/Component";
import ComponentDetails from "./ComponentDetails.vue";

interface Props {
	component: Component;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<ComponentDetails :component="props.component">
		<RecursiveComponent
			v-for="v in !props.component.nestable ? [] : props.component.components"
			:key="v.id"
			:component="v"
		/>
	</ComponentDetails>
</template>

<style scoped lang="scss"></style>
