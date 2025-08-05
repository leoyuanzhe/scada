<script setup lang="ts">
import type { Component } from "@/types/Component";
import MyButton from "@/components/my-button/MyButton.vue";
import FormItem from "@/components/form-item/FormItem.vue";
import ContainerConfig from "./component/ContainerConfig.vue";
import TextConfig from "./component/TextConfig.vue";
import { generateCodeIcon } from "./helpers/formItem";

const props = withDefaults(defineProps<{ component: Component<any> }>(), {});
const codeIcon = generateCodeIcon(props.component.propsExpression);
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>属性</h1>
		<details v-if="props.component.componentization" class="details" open>
			<summary>自定义属性</summary>
			<fieldset>
				<MyButton variant="success" @click="props.component.propsExpression">新增属性</MyButton>
				<FormItem
					v-for="k in Object.keys(props.component.propsExpression)"
					:label="k"
					:for="'setter-' + k"
					:icons="[codeIcon(k)]"
				>
					<input
						id="setter-content"
						type="text"
						readonly
						:value="props.component.propsExpression[k]"
						@input="props.component.propsExpression[k] = ($event.target as HTMLInputElement).value"
					/>
				</FormItem>
			</fieldset>
		</details>
		<ContainerConfig v-if="props.component.key === 'container'" :component="props.component" />
		<TextConfig v-if="props.component.key === 'text'" :component="props.component" />
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
