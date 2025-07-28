<script setup lang="ts">
import type { Component, Action } from "@/types/Component";
import { useSchema } from "@/stores/useSchema";
import FormItem from "@/components/form-item/FormItem.vue";
import MyButton from "@/components/my-button/MyButton.vue";
import { editObjectValue } from "@/helpers/schema";
import emit_dict from "@/assets/data/emit_dict.json";
import prop_dict from "@/assets/data/prop_dict.json";

interface Props {
	component: Component;
}
const schemaStore = useSchema();
const props = withDefaults(defineProps<Props>(), {});
const addAction = () => {
	fn(0);
	function fn(depth: number) {
		const name = "action" + (props.component.actions.length + 1 + depth);
		if (!props.component.actions.some((v) => v.name == name))
			props.component.actions.push({
				name,
				type: "none",
				changeVisibleParams: {
					targetComponentsId: [],
					visible: "toggle",
				},
				changePropParams: {
					targetComponentId: "",
					key: "",
					expression: "",
				},
				changeStateParams: {
					targetComponentId: "",
					key: "",
					expression: "",
				},
				triggerOtherActionParams: {
					targetComponentId: "",
					name: "",
				},
				beforeHandler: "return true;",
				afterHandler: "",
			});
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
const changeType = (e: Event, action: Action) => {
	const value = (e.target as HTMLSelectElement).value as Action["type"];
	action.type = value;
};
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>动作</h1>
		<MyButton variant="success" @click="addAction()">添加动作</MyButton>
		<details v-for="(v, i) in props.component.actions" :key="v.name" open class="details">
			<summary>
				<span>{{ v.name }}</span>
			</summary>
			<fieldset>
				<FormItem
					label="名称"
					for="setter-action-name"
					:icons="[{ href: '#pen-to-square', onClick: () => editName(v.name) }]"
				>
					<input id="setter-action-name" readonly :value="v.name" />
				</FormItem>
				<FormItem label="类型" for="setter-action-type">
					<select id="setter-action-type" :value="v.type" @input="changeType($event, v)">
						<option value="none">无</option>
						<option value="changeVisible">改变可见性</option>
						<option value="changeProp">改变属性</option>
						<option value="changeState">改变状态</option>
						<option value="triggerOtherAction">触发其它事件</option>
					</select>
				</FormItem>
				<template v-if="v.type === 'changeVisible'">
					<FormItem label="选择组件" for="change-visible-target-components-id">
						<select
							id="change-visible-target-components-id"
							multiple
							v-model="v.changeVisibleParams.targetComponentsId"
						>
							<option v-for="v2 in schemaStore.flatedComponents" :key="v2.id" :value="v2.id">
								{{ v2.title }}
							</option>
						</select>
					</FormItem>
					<FormItem label="选择可见性" for="change-visible-visible">
						<select id="change-visible-visible" v-model="v.changeVisibleParams.visible">
							<option value="show">显示</option>
							<option value="hide">隐藏</option>
							<option value="toggle">切换</option>
						</select>
					</FormItem>
				</template>
				<template v-if="v.type === 'changeProp'">
					<FormItem label="选择组件" for="change-prop-target-components-id">
						<select id="change-prop-target-components-id" v-model="v.changePropParams.targetComponentId">
							<option :value="schemaStore.currentComponent?.id">
								{{ schemaStore.currentComponent?.title }}
							</option>
							<option v-for="v2 in schemaStore.flatedComponents" :key="v2.id" :value="v2.id">
								{{ v2.title }}
							</option>
						</select>
					</FormItem>
					<FormItem label="选择属性" for="change-prop-key">
						<select id="change-prop-key" v-model="v.changePropParams.key">
							<option
								v-for="k in Object.keys(
									schemaStore.findComponent(v.changePropParams.targetComponentId)?.props || {}
								)"
								:key="k"
								:value="k"
							>
								{{
									prop_dict[
										schemaStore.findComponent(v.changePropParams.targetComponentId)?.key || ""
									]?.[k] || k
								}}
							</option>
						</select>
					</FormItem>
					<FormItem
						label="新属性值"
						for="change-prop-expression"
						:icons="[{ href: '#code', onClick: () => editObjectValue(v.changePropParams, 'expression') }]"
					>
						<input
							id="change-prop-expression"
							type="text"
							readonly
							:value="v.changePropParams.expression"
						/>
					</FormItem>
				</template>
				<template v-if="v.type === 'changeState'">
					<FormItem label="选择组件" for="change-state-target-component-id">
						<select id="change-state-target-component-id" v-model="v.changeStateParams.targetComponentId">
							<option :value="schemaStore.currentComponent?.id">
								{{ schemaStore.currentComponent?.title }}
							</option>
							<option v-for="v2 in schemaStore.flatedComponents" :key="v2.id" :value="v2.id">
								{{ v2.title }}
							</option>
						</select>
					</FormItem>
					<FormItem label="选择键" for="change-state-key">
						<select id="change-state-key" v-model="v.changeStateParams.key">
							<option
								v-for="k in Object.keys(
									schemaStore.findComponent(v.changeStateParams.targetComponentId)?.stateExpression ||
										{}
								)"
								:key="k"
								:value="k"
							>
								{{ k }}
							</option>
						</select>
					</FormItem>
					<FormItem
						label="新值"
						for="change-state-expression"
						:icons="[{ href: '#code', onClick: () => editObjectValue(v.changeStateParams, 'expression') }]"
					>
						<input
							id="change-state-expression"
							type="text"
							readonly
							:value="v.changeStateParams.expression"
						/>
					</FormItem>
				</template>
				<template v-if="v.type === 'triggerOtherAction'">
					<FormItem label="选择组件" for="trigger-other-target-component-id">
						<select
							id="trigger-other-target-component-id"
							v-model="v.triggerOtherActionParams.targetComponentId"
						>
							<option :value="schemaStore.currentComponent?.id">
								{{ schemaStore.currentComponent?.title }}
							</option>
							<option v-for="v2 in schemaStore.flatedComponents" :key="v2.id" :value="v2.id">
								{{ v2.title }}
							</option>
						</select>
					</FormItem>
					<FormItem label="选择事件" for="trigger-other-name">
						<select id="trigger-other-name" v-model="v.triggerOtherActionParams.name">
							<option
								v-for="v2 in schemaStore.findComponent(v.triggerOtherActionParams.targetComponentId)
									?.actions || []"
								:key="v2.name"
								:value="v2.name"
							>
								{{ v2.name }}
							</option>
						</select>
					</FormItem>
				</template>
				<FormItem
					label="执行动作前"
					for="setter-action-before-handler"
					:icons="[{ href: '#code', onClick: () => editObjectValue(v, 'beforeHandler') }]"
				>
					<textarea readonly v-model="v.beforeHandler"></textarea>
				</FormItem>
				<FormItem
					label="执行动作后"
					for="setter-action-after-handler"
					:icons="[{ href: '#code', onClick: () => editObjectValue(v, 'afterHandler') }]"
				>
					<textarea readonly v-model="v.afterHandler"></textarea>
				</FormItem>
				<MyButton variant="danger" @click="props.component.actions.splice(i, 1)">删除</MyButton>
			</fieldset>
		</details>
	</form>
	<form class="form" @submit.prevent>
		<h1>事件</h1>
		<details v-for="k in Object.keys(props.component.emits)" :key="k" open class="details">
			<summary>{{ emit_dict[k] ?? k }}</summary>
			<fieldset>
				<FormItem label="类型" for="setter-emit-execute-type">
					<select id="setter-emit-execute-type" v-model="props.component.emits[k].executeType">
						<option value="sequential">顺序执行</option>
						<option value="concurrent">并发执行</option>
					</select>
				</FormItem>
				<FormItem label="选择动作" for="setter-emit-actions-name">
					<div id="setter-emit-actions-name" class="checkbox-group">
						<label v-for="v in props.component.actions" :key="v.name">
							<input
								type="checkbox"
								:checked="props.component.emits[k].actionsName.includes(v.name)"
								@change="
									props.component.emits[k].actionsName.includes(v.name)
										? props.component.emits[k].actionsName.splice(
												props.component.emits[k].actionsName.indexOf(v.name),
												1
										  )
										: props.component.emits[k].actionsName.push(v.name)
								"
							/>
							<span>{{ v.name }}</span>
						</label>
					</div>
				</FormItem>
			</fieldset>
		</details>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
