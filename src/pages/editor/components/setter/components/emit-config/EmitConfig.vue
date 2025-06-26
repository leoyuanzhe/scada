<script setup lang="ts">
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import Button from "@/components/button/Button.vue";

const props = withDefaults(defineProps<{ component: Schema | Component }>(), {});
const addAction = () => {
	fn(0);
	function fn(depth: number) {
		const name = "action" + (props.component.actions.length + 1 + depth);
		if (!props.component.actions.some((v) => v.name == name)) props.component.actions.push({ name: "", type: "none", params: {}, handler: "" });
		else fn(depth + 1);
	}
};
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>动作</h1>
		<details v-for="v in props.component.actions" :key="v.name" class="config" open>
			<summary>{{ v.name }}</summary>
			<fieldset>
				<article class="form-item">
					<label for="setter-action-name">名称</label>
					<input id="setter-action-name" readonly :value="v.name" />
					<button class="input-button">
						<svg class="icon"><use href="#pen-to-square" /></svg>
					</button>
				</article>
				<article class="form-item">
					<label for="setter-action-type">类型</label>
					<select id="setter-action-type" :value="v.type">
						<option value="changeVisible">改变可见性</option>
						<option value="changeProp">改变属性</option>
						<option value="changeState">改变状态</option>
					</select>
				</article>
			</fieldset>
		</details>
		<Button variant="success" @click="addAction()">添加动作</Button>
	</form>
	<form class="form" @submit.prevent>
		<h1>动作</h1>
		<details v-for="k in Object.keys(props.component.emits)" :key="k" class="config" open>
			<summary>{{ k }}</summary>
			<fieldset></fieldset>
		</details>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
