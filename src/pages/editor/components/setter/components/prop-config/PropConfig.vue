<script setup lang="ts">
import type { Component } from "@/types/Component";
import ComponentizationConfig from "./component/ComponentizationConfig.vue";
import ContainerConfig from "./component/ContainerConfig.vue";
import TextConfig from "./component/TextConfig.vue";

const props = withDefaults(defineProps<{ component: Component<any> }>(), {});
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>属性</h1>
		<ComponentizationConfig v-if="props.component.componentization.enable" :component="props.component" />
		<ContainerConfig v-if="props.component.key === 'container'" :component="props.component" />
		<TextConfig v-if="props.component.key === 'text'" :component="props.component" />
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
