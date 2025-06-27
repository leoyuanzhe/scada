<script setup lang="ts">
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import { editObjectValue } from "@/helpers/component";

const props = withDefaults(defineProps<{ component: Schema | Component }>(), {});
const addState = () => {
	fn(0);
	function fn(depth: number) {
		const key = "state" + (Object.keys(props.component.stateExpression).length + 1 + depth);
		if (!(key in props.component.stateExpression)) props.component.stateExpression[key] = "";
		else fn(depth + 1);
	}
};
const editKey = (key: string) => {
	const oldKeys = Object.keys(props.component.stateExpression).filter((k) => k !== key);
	const newKey = prompt("请输入新的键", key);
	if (newKey !== null) {
		try {
			if (oldKeys.some((k) => k === newKey)) throw new Error("键已存在");
			const value = props.component.stateExpression[key];
			delete props.component.stateExpression[key];
			props.component.stateExpression[newKey] = value;
		} catch (error: any) {
			alert(error.message);
			editKey(key);
		}
	}
};
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>状态</h1>
		<fieldset>
			<article v-for="k in Object.keys(props.component.stateExpression)" :key="k" class="form-item">
				<label :for="'setter-state-' + k">{{ k }}</label>
				<input :id="'setter-state-' + k" readonly :value="props.component.stateExpression[k]" />
				<button type="button" @click="editKey(k)">
					<svg class="icon"><use href="#key" /></svg>
				</button>
				<button type="button" @click="editObjectValue(props.component.stateExpression, k)">
					<svg class="icon"><use href="#link" /></svg>
				</button>
				<button type="button" @click="delete props.component.stateExpression[k]">
					<svg class="icon danger"><use href="#trash" /></svg>
				</button>
			</article>
			<article class="form-item">
				<button class="success" type="button" @click="addState()">添加</button>
			</article>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
