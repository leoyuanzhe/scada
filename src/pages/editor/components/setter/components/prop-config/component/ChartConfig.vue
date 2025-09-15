<script setup lang="ts">
import type { Component } from "@/types/Component";
import type { ChartProps } from "@/materials/chart/Chart";
import { generateCodeIcon } from "../helpers/formItem";
import FormItem from "@/components/form-item/FormItem.vue";

interface Props {
	component: Component<ChartProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const codeIcon = generateCodeIcon<ChartProps>(props.component.propsExpression);
</script>

<template>
	<details class="details" open>
		<summary>图表选项</summary>
		<fieldset>
			<FormItem label="配置项" for="setter-option" :icons="[codeIcon('option')]">
				<input id="setter-option" type="text" readonly :value="props.component.props.option" />
			</FormItem>
			<details class="details" open>
				<summary>标题组件</summary>
				<fieldset>
					<FormItem label="组件ID" for="setter-option-title-id">
						<input
							id="setter-option-title-id"
							type="text"
							:value="props.component.props.option.title.id"
							@input="props.component.props.option.title.id = ($event.target as HTMLInputElement).value"
						/>
					</FormItem>
					<FormItem label="显示" for="setter-option-title-show">
						<input
							id="setter-option-title-show"
							type="checkbox"
							:checked="props.component.props.option.title.show"
							@input="
								props.component.props.option.title.show = ($event.target as HTMLInputElement).checked
							"
						/>
					</FormItem>
					<FormItem label="文本" for="setter-option-title-text">
						<input
							id="setter-option-title-text"
							type="text"
							:value="props.component.props.option.title.text"
							@input="props.component.props.option.title.text = ($event.target as HTMLInputElement).value"
						/>
					</FormItem>
				</fieldset>
			</details>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
