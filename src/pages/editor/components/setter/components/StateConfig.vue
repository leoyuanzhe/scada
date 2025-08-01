<script setup lang="ts">
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import { editObjectValue } from "@/helpers/schema";
import FormItem from "@/components/form-item/FormItem.vue";
import MyButton from "@/components/my-button/MyButton.vue";

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
		<fieldset>
			<MyButton variant="success" @click="addState()">添加状态</MyButton>
			<FormItem
				v-for="k in Object.keys(props.component.stateExpression)"
				:key="k"
				:label="k"
				:for="'setter-state-' + k"
				:icons="[
					{ href: '#key', onClick: () => editKey(k) },
					{ href: '#code', onClick: () => editObjectValue(props.component.stateExpression, k) },
					{ href: '#trash', variant: 'danger', onClick: () => delete props.component.stateExpression[k] },
				]"
			>
				<input :id="'setter-state-' + k" readonly :value="props.component.stateExpression[k]" />
			</FormItem>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
