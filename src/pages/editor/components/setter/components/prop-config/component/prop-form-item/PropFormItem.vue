<script lang="ts" setup>
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import { editObjectValue } from "@/helpers/component";
import FormItem from "@/components/form-item/FormItem.vue";

type PropsExpression = Record<string, string>;
interface Props {
	component: Schema<any> | Component<any>;
	label: string;
	propKey: string;
	inputType: "text" | "number" | "color";
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<FormItem
		:label="props.label"
		:for="'setter-' + props.propKey"
		:icons="[
			{ href: '#code', onClick: () => editObjectValue(props.component.propsExpression as PropsExpression, props.propKey) },
			{ href: props.component.propsExpression[props.propKey] !== undefined ? '#code' : '', variant: 'danger', onClick: () => delete props.component.propsExpression[props.propKey] },
		]"
	>
		<p>{{ props.component.propsExpression[props.propKey] }}</p>
		<input :id="'setter-' + props.propKey" :type="props.inputType" :value="props.component.props[props.propKey]" @input="props.component.props[props.propKey] = ($event.target as HTMLInputElement).value" />
	</FormItem>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
