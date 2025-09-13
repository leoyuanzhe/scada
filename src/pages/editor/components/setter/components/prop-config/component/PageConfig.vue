<script setup lang="ts">
import type { Component } from "@/types/Component";
import type { PageProps } from "@/materials/page/Page";
import { generateCodeIcon } from "../helpers/formItem";
import FormItem from "@/components/form-item/FormItem.vue";

interface Props {
	component: Component<PageProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const codeIcon = generateCodeIcon<PageProps>(props.component.propsExpression);
</script>

<template>
	<details class="details" open>
		<summary>基础</summary>
		<fieldset>
			<FormItem label="背景颜色" for="setter-background-color" :icons="[codeIcon('backgroundColor')]">
				<input
					id="setter-background-color"
					type="color"
					:value="props.component.props.backgroundColor"
					@input="props.component.props.backgroundColor = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
