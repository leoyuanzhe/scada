<script setup lang="ts">
import type { Schema } from "@/types/Schema";
import PropFormItem from "../prop-form-item/PropFormItem.vue";

interface Props {
	component: Schema;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<details class="config" open>
		<summary>基础</summary>
		<fieldset>
			<PropFormItem label="背景颜色" prop-key="backgroundColor" input-type="color" :component="props.component" />
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "../../styles/config" as *;
</style>
