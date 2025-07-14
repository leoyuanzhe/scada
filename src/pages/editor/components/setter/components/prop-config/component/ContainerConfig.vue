<script setup lang="ts">
import type { TextProps } from "@/materials/text/Text";
import type { Component } from "@/types/Component";
import PropFormItem from "./prop-form-item/PropFormItem.vue";

interface Props {
	component: Component<TextProps>;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<details class="config" open>
		<summary>基础{{ props.component.props }}</summary>
		<fieldset>
			<PropFormItem label="背景颜色" prop-key="backgroundColor" input-type="color" :component="props.component" />
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
