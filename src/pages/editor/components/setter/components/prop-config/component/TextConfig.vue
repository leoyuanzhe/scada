<script setup lang="ts">
import type { TextProps } from "@/materials/text/Text";
import type { Component } from "@/types/Component";
import { editObjectValue } from "@/helpers/schema";
import PropFormItem from "./prop-form-item/PropFormItem.vue";
import FormItem from "@/components/form-item/FormItem.vue";

interface Props {
	component: Component<TextProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const getExpressionIconVariant = (key: keyof TextProps) => {
	return props.component.propsExpression.content !== undefined ? "primary" : "info";
};
const setExpression = (key: keyof TextProps) => {
	editObjectValue(props.component.propsExpression as Record<string, any>, key);
};
</script>

<template>
	<details class="details" open>
		<summary>文本</summary>
		<fieldset>
			<FormItem
				label="内容"
				for="setter-content"
				:icons="[
					{
						href: '#code',
						variant: getExpressionIconVariant('content'),
						onClick: () => setExpression('content'),
					},
				]"
			>
				<input
					id="setter-content"
					type="text"
					:value="props.component.props.content"
					@input="props.component.props.content = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
			<PropFormItem label="颜色" prop-key="fontColor" input-type="color" :component="props.component" />
			<PropFormItem label="颜色" prop-key="fontSize" input-type="color" :component="props.component" />
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
