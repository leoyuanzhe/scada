<script setup lang="ts">
import type { Component } from "@/types/Component";
import ComponentizationConfig from "./component/ComponentizationConfig.vue";
import PageConfig from "./component/PageConfig.vue";
import ContainerConfig from "./component/ContainerConfig.vue";
import TextConfig from "./component/TextConfig.vue";
import DialogConfig from "./component/DialogConfig.vue";
import ChartConfig from "./component/ChartConfig.vue";

const props = withDefaults(defineProps<{ component: Component<any> }>(), {});
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>属性</h1>
		<ComponentizationConfig :component="props.component" />
		<PageConfig v-if="props.component.key === 'page'" :component="props.component" />
		<ContainerConfig v-if="props.component.key === 'container'" :component="props.component" />
		<TextConfig v-if="props.component.key === 'text'" :component="props.component" />
		<DialogConfig v-if="props.component.key === 'dialog'" :component="props.component" />
		<ChartConfig v-if="props.component.key === 'chart'" :component="props.component" />
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
