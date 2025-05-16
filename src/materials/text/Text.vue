<script setup lang="ts">
import type { Component } from "@/types/Component";

interface Props {
	component: Component;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<span class="text" :style="{ color: props.component.property.color }">
		<slot></slot>
	</span>
</template>

<style scoped lang="scss"></style>
