<script setup lang="ts">
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import { useSchema } from "@/stores/useSchema";
import MyButton from "@/components/my-button/MyButton.vue";
import emit_dict from "@/assets/data/emit_dict.json";
import prop_dict from "@/assets/data/prop_dict.json";
import { editObjectValue } from "@/helpers/component";

interface Props {
	component: Schema | Component;
}
const schemaStore = useSchema();
const props = withDefaults(defineProps<Props>(), {});
const addAction = () => {
	fn(0);
	function fn(depth: number) {
		const name = "action" + (props.component.actions.length + 1 + depth);
		if (!props.component.actions.some((v) => v.name == name)) props.component.actions.push({ name, type: "none", params: {}, handler: "" });
		else fn(depth + 1);
	}
};
const editName = (name: string) => {
	const oldNames = props.component.actions.filter((v) => v.name !== name).map((v) => v.name);
	const action = props.component.actions.find((v) => v.name === name);
	const newName = prompt("请输入新的名称", name);
	if (action && newName !== null) {
		try {
			if (oldNames.some((k) => k === newName)) throw new Error("名称已存在");
			action.name = newName;
		} catch (error: any) {
			alert(error.message);
			editName(name);
		}
	}
};
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>动作</h1>
		<details v-for="v in props.component.actions" :key="v.name" class="config">
			<summary>
				<span>{{ v.name }}</span>
			</summary>
			<fieldset>
				<article class="form-item">
					<label for="setter-action-name">名称</label>
					<input id="setter-action-name" readonly :value="v.name" />
					<button class="input-button" @click="editName(v.name)">
						<svg class="icon"><use href="#pen-to-square" /></svg>
					</button>
				</article>
				<article class="form-item">
					<label for="setter-action-type">类型</label>
					<select id="setter-action-type" v-model="v.type">
						<option value="changeVisible">改变可见性</option>
						<option value="changeProp">改变属性</option>
						<option value="changeState">改变状态</option>
						<option value="triggerOther">触发其它事件</option>
					</select>
				</article>
				<template v-if="v.type === 'changeVisible'">
					<article class="form-item">
						<label for="change-visible-target-components-id">选择组件</label>
						<select id="change-visible-target-components-id" multiple v-model="v.params.targetComponentsId">
							<option v-for="v2 in schemaStore.flatComponents" :key="v2.id" :value="v2.id">{{ v2.title }}</option>
						</select>
					</article>
					<article class="form-item">
						<label for="change-visible-visible">选择可见性</label>
						<select id="change-visible-visible" v-model="v.params.visible">
							<option value="show">显示</option>
							<option value="hide">隐藏</option>
							<option value="toggle">切换</option>
						</select>
					</article>
				</template>
				<template v-if="v.type === 'changeProp'">
					<article class="form-item">
						<label for="change-prop-target-components-id">选择组件</label>
						<select id="change-prop-target-components-id" v-model="v.params.targetComponentId">
							<option :value="schemaStore.id">{{ schemaStore.title }}</option>
							<option v-for="v2 in schemaStore.flatComponents" :key="v2.id" :value="v2.id">{{ v2.title }}</option>
						</select>
					</article>
					<article class="form-item">
						<label for="change-prop-key">选择属性</label>
						<select id="change-prop-key" v-model="v.params.key">
							<option v-for="k in Object.keys(schemaStore.findComponent(v.params.targetComponentId)?.props || {})" :key="k" :value="k">
								{{ prop_dict[schemaStore.findComponent(v.params.targetComponentId)?.key || ""]?.[k] || k }}
							</option>
						</select>
					</article>
					<article class="form-item">
						<label for="change-prop-new-value">新属性值</label>
						<input id="change-prop-new-value" type="text" readonly :value="v.params.newValue" />
						<button type="button" @click="editObjectValue(v.params, 'newValue')">
							<svg class="icon"><use href="#link" /></svg>
						</button>
					</article>
				</template>
				<template v-if="v.type === 'changeState'">
					<article class="form-item">
						<label for="change-state-target-component-id">选择组件</label>
						<select id="change-state-target-component-id" v-model="v.params.targetComponentId">
							<option :value="schemaStore.id">{{ schemaStore.title }}</option>
							<option v-for="v2 in schemaStore.flatComponents" :key="v2.id" :value="v2.id">{{ v2.title }}</option>
						</select>
					</article>
					<article class="form-item">
						<label for="change-state-key">选择键</label>
						<select id="change-state-key" v-model="v.params.key">
							<option v-for="k in Object.keys(schemaStore.findComponent(v.params.targetComponentId)?.stateExpression || {})" :key="k" :value="k">
								{{ k }}
							</option>
						</select>
					</article>
					<article class="form-item">
						<label for="change-state-new-value">新值</label>
						<input id="change-state-new-value" type="text" readonly :value="v.params.newValue" />
						<button type="button" @click="editObjectValue(v.params, 'newValue')">
							<svg class="icon"><use href="#link" /></svg>
						</button>
					</article>
				</template>
				<template v-if="v.type === 'triggerOther'">
					<article class="form-item">
						<label for="trigger-other-target-component-id">选择组件</label>
						<select id="trigger-other-target-component-id" v-model="v.params.targetComponentId">
							<option :value="schemaStore.id">{{ schemaStore.title }}</option>
							<option v-for="v2 in schemaStore.flatComponents" :key="v2.id" :value="v2.id">{{ v2.title }}</option>
						</select>
					</article>
					<article class="form-item">
						<label for="trigger-other-name">选择事件</label>
						<select id="trigger-other-name" v-model="v.params.name">
							<option v-for="v2 in schemaStore.findComponent(v.params.targetComponentId)?.actions || []" :key="v2.name" :value="v2.name">{{ v2.name }}</option>
						</select>
					</article>
				</template>
			</fieldset>
		</details>
		<MyButton variant="success" @click="addAction()">添加动作</MyButton>
	</form>
	<form class="form" @submit.prevent>
		<h1>事件</h1>
		<details v-for="k in Object.keys(props.component.emits)" :key="k" class="config" open>
			<summary>{{ emit_dict[k] ?? k }}</summary>
			<fieldset>
				<article class="form-item">
					<label for="setter-emit-execute-type">类型</label>
					<select id="setter-emit-execute-type" v-model="props.component.emits[k].executeType">
						<option value="sequential">顺序执行</option>
						<option value="concurrent">并发执行</option>
					</select>
				</article>
				<article class="form-item">
					<label for="setter-emit-actions">动作</label>
					<div id="setter-emit-actions" class="checkbox-group">
						<label v-for="v in props.component.actions" :key="v.name">
							<input
								type="checkbox"
								:checked="props.component.emits[k].actions.includes(v.name)"
								@change="props.component.emits[k].actions.includes(v.name) ? props.component.emits[k].actions.splice(props.component.emits[k].actions.indexOf(v.name), 1) : props.component.emits[k].actions.push(v.name)"
							/>
							<span>{{ v.name }}</span>
						</label>
					</div>
				</article>
			</fieldset>
		</details>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
