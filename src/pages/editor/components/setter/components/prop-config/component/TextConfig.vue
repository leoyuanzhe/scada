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
		<summary>基础</summary>
		<fieldset>
			<PropFormItem label="文本" prop-key="text" input-type="text" :component="props.component" />
			<PropFormItem label="颜色" prop-key="color" input-type="color" :component="props.component" />
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
