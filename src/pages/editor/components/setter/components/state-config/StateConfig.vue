<script setup lang="ts">
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import { openExpressionCodeEditor } from "@/helpers/component";

const props = withDefaults(defineProps<{ component: Schema | Component }>(), {});
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>状态</h1>
		<fieldset>
			<article v-for="k in Object.keys(props.component.stateExpression)" :key="k" class="form-item">
				<label :for="'setter-state-' + k">宽度</label>
				<input :id="'setter-state-' + k" readonly :value="props.component.stateExpression[k]" />
				<button @click="openExpressionCodeEditor(props.component.stateExpression, k)">
					<svg :class="{ icon: true, active: props.component.stateExpression[k] !== undefined }"><use href="#code-fork" /></svg>
				</button>
			</article>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
