<script setup lang="ts">
import type { Component, CustomPropType, ComponentWithLayout, EmitEvent } from "@/types/Component";
import { useDragger } from "@/hooks/useDragger";
import { deepClone } from "@/utils/conversion";
import FormItem from "@/components/form-item/FormItem.vue";
import MyButton from "@/components/my-button/MyButton.vue";
import default_emit_config from "@/assets/data/default_emit_config.json";

const dragger = useDragger();
const props = withDefaults(defineProps<{ component: Component<any> }>(), {});
const addCustomProp = () => {
	fn(0);
	function fn(depth: number) {
		const key = "prop" + (props.component.customProps.length + 1 + depth);
		if (!props.component.customProps.some((v) => v.key === key) || !props.component.props[key]) {
			props.component.customProps.push({
				key,
				label: "标签名称",
				type: "text",
				options: [],
			});
			props.component.props[key] = null;
		} else fn(depth + 1);
	}
};
const editCustomPropKey = (key: string) => {
	const oldKeys = props.component.customProps.filter((v) => v.key !== key).map((v) => v.key);
	const newKey = prompt("请输入新的键", key);
	if (newKey !== null) {
		try {
			if (oldKeys.some((k) => k === newKey) || props.component.props[newKey]) throw new Error("键已存在");
			const item = props.component.customProps.find((v) => v.key === key);
			item!.key = newKey;
			const value = props.component.props[key];
			delete props.component.props[key];
			props.component.props[newKey] = value;
		} catch (error: any) {
			alert(error.message);
			editCustomPropKey(key);
		}
	}
};
const removeCustomProp = (key: string) => {
	const index = props.component.customProps.findIndex((v) => v.key === key);
	if (index !== -1) {
		delete props.component.props[key];
		props.component.customProps.splice(index, 1);
	}
};
const addCustomEmit = () => {
	fn(0);
	function fn(depth: number) {
		const key = "emit" + (props.component.customEmits.length + 1 + depth);
		if (!props.component.customEmits.some((v) => v.key === key) || !props.component.emits[key]) {
			props.component.customEmits.push({
				key,
				label: "标签名称",
			});
			props.component.emits[key] = deepClone(default_emit_config as EmitEvent);
		} else fn(depth + 1);
	}
};
const editCustomEmitKey = (key: string) => {
	const oldKeys = props.component.customEmits.filter((v) => v.key !== key).map((v) => v.key);
	const newKey = prompt("请输入新的键", key);
	if (newKey !== null) {
		try {
			if (oldKeys.some((k) => k === newKey) || props.component.emits[newKey]) throw new Error("键已存在");
			const item = props.component.customEmits.find((v) => v.key === key);
			item!.key = newKey;
			const value = props.component.emits[key];
			delete props.component.emits[key];
			props.component.emits[newKey] = value;
		} catch (error: any) {
			alert(error.message);
			editCustomEmitKey(key);
		}
	}
};
const removeCustomEmit = (key: string) => {
	const index = props.component.customEmits.findIndex((v) => v.key === key);
	if (index !== -1) {
		delete props.component.props[key];
		props.component.customEmits.splice(index, 1);
	}
};
</script>

<template>
	<form class="form" @submit.prevent>
		<fieldset>
			<legend>设置</legend>
			<FormItem label="名称" for="setter-basic-title">
				<input
					id="setter-basic-title"
					type="text"
					:value="(props.component as ComponentWithLayout).title"
					@input="(props.component as ComponentWithLayout).title = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
			<FormItem label="锁定" for="setter-basic-locked">
				<input
					id="setter-basic-locked"
					type="checkbox"
					:checked="(props.component as ComponentWithLayout).locked"
					@input="
						(props.component as ComponentWithLayout).locked = Boolean(
							($event.target as HTMLInputElement).checked
						)
					"
				/>
			</FormItem>
			<FormItem label="隐藏" for="setter-basic-hidden">
				<input
					id="setter-basic-hidden"
					type="checkbox"
					:checked="(props.component as ComponentWithLayout).hidden"
					@input="
						(props.component as ComponentWithLayout).hidden = Boolean(
							($event.target as HTMLInputElement).checked
						)
					"
				/>
			</FormItem>
			<FormItem label="嵌套" for="setter-basic-nestable">
				<input
					id="setter-basic-nestable"
					type="checkbox"
					:checked="(props.component as ComponentWithLayout).nestable"
					@input="
						(props.component as ComponentWithLayout).nestable = Boolean(
							($event.target as HTMLInputElement).checked
						)
					"
				/>
			</FormItem>
		</fieldset>
		<fieldset v-if="props.component.layout">
			<legend>布局</legend>
			<FormItem label="X坐标" for="setter-basic-layout-left">
				<input
					id="setter-basic-layout-left"
					type="number"
					:value="(props.component as ComponentWithLayout).layout.left"
					@input="
						((props.component as ComponentWithLayout).layout.left = Number(
							($event.target as HTMLInputElement).value
						)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
			<FormItem label="Y坐标" for="setter-basic-layout-top">
				<input
					id="setter-basic-layout-top"
					type="number"
					:value="(props.component as ComponentWithLayout).layout.top"
					@input="
						((props.component as ComponentWithLayout).layout.top = Number(
							($event.target as HTMLInputElement).value
						)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
			<FormItem label="宽度" for="setter-basic-layout-width">
				<input
					id="setter-basic-layout-width"
					type="number"
					:value="props.component.layout.width"
					@input="
						(props.component.layout.width = Number(($event.target as HTMLInputElement).value)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
			<FormItem label="高度" for="setter-basic-layout-height">
				<input
					id="setter-basic-layout-height"
					type="number"
					:value="props.component.layout.height"
					@input="
						(props.component.layout.height = Number(($event.target as HTMLInputElement).value)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
		</fieldset>
		<fieldset>
			<legend>自定义属性</legend>
			<MyButton variant="success" @click="addCustomProp()">新增属性</MyButton>
			<details v-for="(v, i) in props.component.customProps" :key="i" class="details">
				<summary>{{ v.label }}</summary>
				<fieldset>
					<FormItem
						label="key"
						:for="'setter-custom-props-key' + i"
						:icons="[{ href: '#key', onClick: () => editCustomPropKey(v.key) }]"
					>
						<input
							:id="'setter-custom-props-key' + i"
							type="text"
							readonly
							:value="v.key"
							@input="v.key = ($event.target as HTMLInputElement).value"
						/>
					</FormItem>
					<FormItem label="标签" :for="'setter-custom-props-label' + i">
						<input
							:id="'setter-custom-props-label' + i"
							type="text"
							:value="v.label"
							@input="v.label = ($event.target as HTMLInputElement).value"
						/>
					</FormItem>
					<FormItem label="类型" :for="'setter-custom-props-type' + i">
						<select
							:id="'setter-custom-props-type' + i"
							:value="v.type"
							@input="v.type = ($event.target as HTMLSelectElement).value as CustomPropType"
						>
							<option value="text">文本输入框</option>
							<option value="number">数字输入框</option>
							<option value="select">选择器</option>
							<option value="select">颜色选择器</option>
						</select>
					</FormItem>
					<MyButton variant="danger" @click="removeCustomProp(v.key)">删除</MyButton>
				</fieldset>
			</details>
		</fieldset>
		<fieldset>
			<legend>自定义事件</legend>
			<MyButton variant="success" @click="addCustomEmit()">新增事件</MyButton>
			<details v-for="(v, i) in props.component.customEmits" :key="i" class="details">
				<summary>{{ v.label }}</summary>
				<fieldset>
					<FormItem
						label="key"
						:for="'setter-custom-props-key' + i"
						:icons="[{ href: '#key', onClick: () => editCustomEmitKey(v.key) }]"
					>
						<input
							:id="'setter-custom-props-key' + i"
							type="text"
							readonly
							:value="v.key"
							@input="v.key = ($event.target as HTMLInputElement).value"
						/>
					</FormItem>
					<FormItem label="标签" :for="'setter-custom-props-label' + i">
						<input
							:id="'setter-custom-props-label' + i"
							type="text"
							:value="v.label"
							@input="v.label = ($event.target as HTMLInputElement).value"
						/>
					</FormItem>
					<MyButton variant="danger" @click="removeCustomEmit(v.key)">删除</MyButton>
				</fieldset>
			</details>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
