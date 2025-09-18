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
			<template v-if="props.component.propsExpression.option === undefined">
				<details class="details" open>
					<summary>标题组件</summary>
					<fieldset>
						<FormItem
							v-if="props.component.props.option?.title?.show !== undefined"
							label="显示"
							for="setter-option-title-show"
						>
							<input
								id="setter-option-title-show"
								type="checkbox"
								:checked="props.component.props.option.title.show"
								@input="
									props.component.props.option.title.show = (
										$event.target as HTMLInputElement
									).checked
								"
							/>
						</FormItem>
						<FormItem
							v-if="props.component.props.option?.title?.text !== undefined"
							label="文本"
							for="setter-option-title-text"
						>
							<input
								id="setter-option-title-text"
								type="text"
								:value="props.component.props.option.title.text"
								@input="
									props.component.props.option.title.text = ($event.target as HTMLInputElement).value
								"
							/>
						</FormItem>
					</fieldset>
				</details>
				<details class="details" open>
					<summary>提示框组件</summary>
					<fieldset>
						<FormItem
							v-if="props.component.props.option?.tooltip?.show !== undefined"
							label="显示"
							for="setter-option-tooltip-show"
						>
							<input
								id="setter-option-tooltip-show"
								type="checkbox"
								:checked="props.component.props.option.tooltip.show"
								@input="
									props.component.props.option.tooltip.show = (
										$event.target as HTMLInputElement
									).checked
								"
							/>
						</FormItem>
					</fieldset>
				</details>
				<details class="details" open>
					<summary>图例组件</summary>
					<fieldset>
						<FormItem
							v-if="props.component.props.option?.legend?.show !== undefined"
							label="显示"
							for="setter-option-legend-show"
						>
							<input
								id="setter-option-legend-show"
								type="checkbox"
								:checked="props.component.props.option.legend.show"
								@input="
									props.component.props.option.legend.show = (
										$event.target as HTMLInputElement
									).checked
								"
							/>
						</FormItem>
					</fieldset>
					<FormItem
						v-if="props.component.props.option?.legend?.data !== undefined"
						label="数据"
						for="setter-option-legend-data"
					>
						<table id="setter-data-source-request-headers">
							<thead>
								<tr>
									<th>键</th>
									<th>值</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(v, i) in [...props.component.props.option?.legend?.data, '']" :key="i">
									<td>
										<input
											type="text"
											:value="v"
											@input="
												props.component.props.option.legend.data[i] === undefined
													? (props.component.props.option.legend.data[i] = '')
													: (v = ($event.target as HTMLInputElement).value)
											"
										/>
									</td>
									<td>
										<input
											type="text"
											:value="v.value"
											@input="
												props.component.props.option.legend.data[i] === undefined
													? (props.component.props.option.legend.data[i] = {
															key: '',
															value: ($event.target as HTMLInputElement).value,
													  })
													: (v.value = ($event.target as HTMLInputElement).value)
											"
										/>
									</td>
									<td>
										<MyButton variant="danger">删除</MyButton>
									</td>
								</tr>
							</tbody>
						</table>
					</FormItem>
				</details>
			</template>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
