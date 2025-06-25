<script setup lang="ts">
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import SchemaConfig from "./component/schema-config/SchemaConfig.vue";
import TextConfig from "./component/text-config/TextConfig.vue";

const props = withDefaults(defineProps<{ component: Schema | Component }>(), {});
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>属性</h1>
		<SchemaConfig v-if="props.component.key === 'schema'" :component="props.component" />
		<TextConfig v-if="props.component.key === 'text'" :component="props.component" />
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
