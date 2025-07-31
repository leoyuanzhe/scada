<script lang="ts" setup>
import type { Component } from "@/types/Component";
import { editObjectValue } from "@/helpers/schema";
import FormItem from "@/components/form-item/FormItem.vue";

type PropsExpression = Record<string, string>;
interface Props {
	component: Component;
	label: string;
	propKey: string;
	inputType: "text" | "number" | "color";
}
const props = withDefaults(defineProps<Props>(), {});
const setExpression = () => {
	editObjectValue(props.component.propsExpression as PropsExpression, props.propKey);
};
</script>

<template>
	<FormItem
		:label="props.label"
		:for="'setter-' + props.propKey"
		:icons="[
			{
				href: '#code',
				variant: props.component.propsExpression[props.propKey] !== undefined ? 'primary' : 'info',
				onClick: () => setExpression(),
			},
		]"
	>
		<input
			:id="'setter-' + props.propKey"
			:type="props.inputType"
			:value="props.component.props[props.propKey]"
			@input="props.component.props[props.propKey] = ($event.target as HTMLInputElement).value"
		/>
	</FormItem>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
