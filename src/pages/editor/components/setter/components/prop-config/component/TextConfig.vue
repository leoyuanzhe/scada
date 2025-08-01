<script setup lang="ts">
import type { TextProps } from "@/materials/text/Text";
import type { Component } from "@/types/Component";
import { editObjectValue } from "@/helpers/schema";
import FormItem, { type FormItemIcon } from "@/components/form-item/FormItem.vue";

interface Props {
	component: Component<TextProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const codeIcon = (key: keyof TextProps): FormItemIcon => {
	return {
		href: "#code",
		variant: props.component.propsExpression.content !== undefined ? "primary" : "info",
		onClick: () => editObjectValue(props.component.propsExpression as Record<string, any>, key),
	};
};
</script>

<template>
	<details class="details" open>
		<summary>文本</summary>
		<fieldset>
			<FormItem label="内容" for="setter-content" :icons="[codeIcon('content')]">
				<input
					id="setter-content"
					type="text"
					:value="props.component.props.content"
					@input="props.component.props.content = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
			<FormItem label="字体颜色" for="setter-font-color" :icons="[codeIcon('fontColor')]">
				<input
					id="setter-font-color"
					type="color"
					:value="props.component.props.fontColor"
					@input="props.component.props.fontColor = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
			<FormItem label="字体大小" for="setter-font-size" :icons="[codeIcon('fontSize')]">
				<input
					id="setter-font-size"
					type="number"
					:value="props.component.props.fontSize"
					@input="props.component.props.fontSize = Number(($event.target as HTMLInputElement).value)"
				/>
			</FormItem>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
