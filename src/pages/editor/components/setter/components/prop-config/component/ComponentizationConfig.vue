<script lang="ts" setup>
import type { Component } from "@/types/Component";
import { generateCodeIcon } from "../helpers/formItem";
import FormItem from "@/components/form-item/FormItem.vue";

interface Props {
	component: Component<any>;
}
const props = withDefaults(defineProps<Props>(), {});
const codeIcon = generateCodeIcon(props.component.propsExpression);
</script>

<template>
	<details v-if="props.component.customProps.length" class="details" open>
		<summary>属性</summary>
		<fieldset>
			<FormItem
				v-for="v in props.component.customProps"
				:key="v.key"
				:label="v.label"
				:for="'setter-' + v.key"
				:icons="[codeIcon(v.key)]"
			>
				<input
					v-if="v.type === 'text'"
					:id="'setter-' + v.key"
					type="text"
					:value="props.component.props[v.key]"
					@input="props.component.props[v.key] = ($event.target as HTMLInputElement).value"
				/>
				<input
					v-if="v.type === 'number'"
					:id="'setter-' + v.key"
					type="number"
					:value="props.component.props[v.key]"
					@input="props.component.props[v.key] = Number(($event.target as HTMLInputElement).value)"
				/>
				<input
					v-if="v.type === 'color'"
					:id="'setter-' + v.key"
					type="color"
					:value="props.component.props[v.key]"
					@input="props.component.props[v.key] = ($event.target as HTMLInputElement).value"
				/>
				<select
					v-if="v.type === 'select'"
					:id="'setter-' + v.key"
					:value="props.component.props[v.key]"
					@input="props.component.props[v.key] = ($event.target as HTMLInputElement).value"
				>
					<option v-for="v2 in v.options" :key="v2.value" :value="v2.value">{{ v2.label }}</option>
				</select>
			</FormItem>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
