<script setup lang="ts">
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";

const props = withDefaults(defineProps<{ component: Schema | Component }>(), {});
const addAction = () => {
	props.component.actions.push({ name: "", type: "none", params: {}, handler: "" });
};
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>事件</h1>
		<fieldset>
			<legend>动作</legend>
		</fieldset>
		<article class="form-item">
			<button class="success" type="button" @click="addAction()">添加动作</button>
		</article>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
