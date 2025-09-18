<script setup lang="ts">
import type { Component } from "@/types/Component";
import type { ChartProps } from "@/materials/chart/Chart";
import { generateCodeIcon } from "../helpers/formItem";
import FormItem from "@/components/form-item/FormItem.vue";
import MyButton from "@/components/my-button/MyButton.vue";
import type { EChartsOptionV2SeriesType } from "@/types/EchartsOptionV2";

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
				<details v-if="props.component.props.option?.title !== undefined" class="details">
					<summary>标题组件</summary>
					<fieldset>
						<FormItem
							v-if="props.component.props.option.title.show !== undefined"
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
							v-if="props.component.props.option.title.text !== undefined"
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
				<details v-if="props.component.props.option?.legend !== undefined" class="details">
					<summary>图例组件</summary>
					<fieldset>
						<FormItem
							v-if="props.component.props.option.legend.show !== undefined"
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
						<FormItem
							v-if="props.component.props.option.legend.data !== undefined"
							label="数据"
							for="setter-option-legend-data"
						>
							<table id="setter-option-legend-data">
								<thead>
									<tr>
										<th>值</th>
										<th>操作</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(v, i) in [...props.component.props.option.legend.data, '']" :key="i">
										<td>
											<input
												type="text"
												:value="v"
												@input="
													props.component.props.option.legend.data[i] = (
														$event.target as HTMLInputElement
													).value
												"
											/>
										</td>
										<td>
											<MyButton
												v-if="i !== props.component.props.option.legend.data.length"
												variant="danger"
												@click="props.component.props.option.legend.data.splice(i, 1)"
											>
												删除
											</MyButton>
										</td>
									</tr>
								</tbody>
							</table>
						</FormItem>
					</fieldset>
				</details>
				<details v-if="props.component.props.option?.xAxis !== undefined" class="details">
					<summary>X轴</summary>
					<fieldset>
						<FormItem
							v-if="props.component.props.option.xAxis.data !== undefined"
							label="数据"
							for="setter-option-xAxis-data"
						>
							<table id="setter-option-xAxis-data">
								<thead>
									<tr>
										<th>值</th>
										<th>操作</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(v, i) in [...props.component.props.option.xAxis.data, '']" :key="i">
										<td>
											<input
												type="text"
												:value="v"
												@input="
													props.component.props.option.xAxis.data[i] = (
														$event.target as HTMLInputElement
													).value
												"
											/>
										</td>
										<td>
											<MyButton
												v-if="i !== props.component.props.option.xAxis.data.length"
												variant="danger"
												@click="props.component.props.option.xAxis.data.splice(i, 1)"
											>
												删除
											</MyButton>
										</td>
									</tr>
								</tbody>
							</table>
						</FormItem>
					</fieldset>
				</details>
				<details v-if="props.component.props.option?.yAxis !== undefined" class="details">
					<summary>Y轴</summary>
					<fieldset>
						<FormItem
							v-if="props.component.props.option.yAxis.data !== undefined"
							label="数据"
							for="setter-option-yAxis-data"
						>
							<table id="setter-option-yAxis-data">
								<thead>
									<tr>
										<th>值</th>
										<th>操作</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(v, i) in [...props.component.props.option.yAxis.data, '']" :key="i">
										<td>
											<input
												type="text"
												:value="v"
												@input="
													props.component.props.option.yAxis.data[i] = (
														$event.target as HTMLInputElement
													).value
												"
											/>
										</td>
										<td>
											<MyButton
												v-if="i !== props.component.props.option.yAxis.data.length"
												variant="danger"
												@click="props.component.props.option.yAxis.data.splice(i, 1)"
											>
												删除
											</MyButton>
										</td>
									</tr>
								</tbody>
							</table>
						</FormItem>
					</fieldset>
				</details>
				<details v-if="props.component.props.option?.tooltip != undefined" class="details">
					<summary>提示框组件</summary>
					<fieldset>
						<FormItem
							v-if="props.component.props.option.tooltip.show !== undefined"
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
				<details v-if="props.component.props.option?.series != undefined" class="details">
					<summary>系列</summary>
					<fieldset>
						<MyButton
							variant="success"
							@click="props.component.props.option.series.push({ type: 'bar', name: '系列', data: [] })"
						>
							添加系列
						</MyButton>
						<details
							v-for="(serie, index) in props.component.props.option.series"
							:key="index"
							class="details"
						>
							<summary>{{ serie.name }}</summary>
							<fieldset>
								<FormItem v-if="serie.name !== undefined" label="名称" for="setter-option-series-name">
									<input
										id="setter-option-series-name"
										:value="serie.name"
										@input="serie.name = ($event.target as HTMLSelectElement).value"
									/>
								</FormItem>
								<FormItem v-if="serie.type !== undefined" label="类型" for="setter-option-series-type">
									<select
										id="setter-option-series-type"
										:value="serie.type"
										@input="
											serie.type = ($event.target as HTMLSelectElement)
												.value as EChartsOptionV2SeriesType
										"
									>
										<option value="bar">柱状图</option>
									</select>
								</FormItem>
								<FormItem v-if="serie.data !== undefined" label="数据" for="setter-option-series-data">
									<table id="setter-option-series-data">
										<thead>
											<tr>
												<th>值</th>
												<th>操作</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="(v, i) in [...serie.data, 0]" :key="i">
												<td>
													<input
														type="text"
														:value="v"
														@input="
															serie.data[i] = ($event.target as HTMLInputElement).value
														"
													/>
												</td>
												<td>
													<MyButton
														v-if="i !== serie.data.length"
														variant="danger"
														@click="serie.data.splice(i, 1)"
													>
														删除
													</MyButton>
												</td>
											</tr>
										</tbody>
									</table>
								</FormItem>
							</fieldset>
						</details>
					</fieldset>
				</details>
			</template>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
