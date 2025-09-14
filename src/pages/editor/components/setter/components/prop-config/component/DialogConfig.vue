<script setup lang="ts">
import type { Component } from "@/types/Component";
import type { DialogProps } from "@/materials/dialog/Dialog";
import { generateCodeIcon } from "../helpers/formItem";
import FormItem from "@/components/form-item/FormItem.vue";

interface Props {
	component: Component<DialogProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const codeIcon = generateCodeIcon<DialogProps>(props.component.propsExpression);
</script>

<template>
	<details class="details" open>
		<summary>基础</summary>
		<fieldset>
			<FormItem label="显示" for="setter-show" :icons="[codeIcon('show')]">
				<input
					id="setter-show"
					type="checkbox"
					:checked="props.component.props.show"
					@input="props.component.props.show = Boolean(($event.target as HTMLInputElement).value)"
				/>
			</FormItem>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
