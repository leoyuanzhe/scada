<script setup lang="ts">
import type { TextProps } from "@/materials/text/Text";
import type { ComponentWithLayout } from "@/types/Component";
import { openCodeEditor } from "@/helpers/component";

const props = withDefaults(defineProps<{ component: ComponentWithLayout<TextProps> }>(), {});
</script>

<template>
	<details class="config" open>
		<summary>基础</summary>
		<fieldset>
			<article class="form-item">
				<label for="setter-text">文本</label>
				<input id="setter-text" type="text" :value="props.component.props.text" @input="props.component.props.text = ($event.target as HTMLInputElement).value" />
				<button @click="openCodeEditor(props.component, 'text')">
					<svg :class="{ icon: true, active: props.component.propsExpression.text !== undefined }"><use href="#code-fork" /></svg>
				</button>
			</article>
			<article class="form-item">
				<label for="setter-color">颜色</label>
				<input id="setter-color" type="color" :value="props.component.props.color" @input="props.component.props.color = ($event.target as HTMLInputElement).value" />
				<button @click="openCodeEditor('color')">
					<svg :class="{ icon: true, active: props.component.propsExpression.color !== undefined }"><use href="#code-fork" /></svg>
				</button>
			</article>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "../../styles/config" as *;
@use "@/styles/form-item" as *;
</style>
