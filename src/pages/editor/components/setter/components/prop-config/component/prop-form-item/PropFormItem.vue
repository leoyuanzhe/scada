<script lang="ts" setup>
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import { editObjectValue } from "@/helpers/component";

interface Props {
	component: Schema<Record<string, any>> | Component<Record<string, any>>;
	label: string;
	propKey: string;
	inputType: "text" | "number" | "color";
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<article class="form-item">
		<label :for="'setter-' + props.propKey">{{ props.label }}</label>
		<input :id="'setter-' + props.propKey" :type="props.inputType" :value="props.component.props[props.propKey]" @input="props.component.props[props.propKey] = ($event.target as HTMLInputElement).value" />
		<button class="input-button" type="button" @click="editObjectValue(props.component.propsExpression as Record<string, any>, props.propKey)">
			<svg :class="{ icon: true, active: props.component.propsExpression[props.propKey] !== undefined }"><use href="#link" /></svg>
		</button>
		<button v-if="props.component.propsExpression[props.propKey] !== undefined" class="input-button" type="button" @click="delete props.component.propsExpression[props.propKey]">
			<svg class="icon danger"><use href="#link-slash" /></svg>
		</button>
	</article>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
