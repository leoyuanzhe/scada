<script setup lang="ts">
import type { Schema, SchemaProps } from "@/types/Schema";
import FormItem from "@/components/form-item/FormItem.vue";
import PropFormItem from "../prop-form-item/PropFormItem.vue";
import { editObjectValue } from "@/helpers/component";

type PropsExpression = Record<string, string>;
interface Props {
	component: Schema<SchemaProps>;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<details class="config" open>
		<summary>基础</summary>
		<fieldset>
			<FormItem
				label="背景颜色"
				for="setter-schema-background-color"
				:icons="[
					{ href: '#code', onClick: () => editObjectValue(props.component.propsExpression as PropsExpression, 'backgroundColor') },
					...[props.component.propsExpression.backgroundColor !== undefined ? { href: '#code', onClick: () => delete props.component.propsExpression.backgroundColor } : null],
				]"
			>
				<input id="setter-schema-background-color" type="color" :value="props.component.props.backgroundColor" @input="props.component.props.backgroundColor = ($event.target as HTMLInputElement).value" />
			</FormItem>
			<PropFormItem label="背景颜色" prop-key="backgroundColor" input-type="color" :component="props.component" />
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
