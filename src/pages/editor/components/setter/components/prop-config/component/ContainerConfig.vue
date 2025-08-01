<script setup lang="ts">
import type { Component } from "@/types/Component";
import type { ContainerProps } from "@/materials/container/Container";
import { generateCodeIcon } from "../helpers/formItem";
import PropFormItem from "./prop-form-item/PropFormItem.vue";

interface Props {
	component: Component<ContainerProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const codeIcon = generateCodeIcon<ContainerProps>(props.component.propsExpression);
</script>

<template>
	<details class="details" open>
		<summary>基础</summary>
		<fieldset>
			<FormItem label="背景颜色" for="setter-backgroundColor" :icons="[codeIcon('backgroundColor')]">
				<input
					id="setter-backgroundColor"
					type="text"
					:value="props.component.props.backgroundColor"
					@input="props.component.props.backgroundColor = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
			<PropFormItem label="背景颜色" prop-key="backgroundColor" input-type="color" :component="props.component" />
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
