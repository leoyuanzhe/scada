<script setup lang="ts">
import type { Schema } from "@/types/Schema";
import type {
	Component,
	DataSource,
	DataSourceRequestBodyRawType,
	DataSourceRequestBodyType,
	DataSourceRequestMethod,
	DataSourceResponseType,
} from "@/types/Component";
import FormItem from "@/components/form-item/FormItem.vue";
import MyButton from "@/components/my-button/MyButton.vue";
import { editObjectValue, requestDataSource } from "@/helpers/schema";

const props = withDefaults(defineProps<{ component: Schema | Component }>(), {});
const addDataSource = () => {
	fn(0);
	function fn(depth: number) {
		const name = "dataSource" + (props.component.dataSources.length + 1 + depth);
		if (!props.component.dataSources.some((v) => v.name == name))
			props.component.dataSources.push({
				name,
				autoRequest: true,
				responseType: "JSON",
				request: {
					url: "",
					method: "GET",
					headers: [],
					params: [],
					body: {
						type: "none",
						formDataParams: [],
						xWwwFormUrlencodedParams: [],
						rawType: "Text",
						rawContent: "",
					},
				},
				response: {
					status: null,
					statusText: null,
					headers: null,
					data: null,
				},
				beforeHandler: "return true",
				afterHandler: "",
			});
		else fn(depth + 1);
	}
};
const editName = (name: string) => {
	const oldNames = props.component.dataSources.filter((v) => v.name !== name).map((v) => v.name);
	const dataSource = props.component.dataSources.find((v) => v.name === name);
	const newName = prompt("请输入新的名称", name);
	if (dataSource && newName !== null) {
		try {
			if (oldNames.some((k) => k === newName)) throw new Error("名称已存在");
			dataSource.name = newName;
		} catch (error: any) {
			alert(error.message);
			editName(name);
		}
	}
};
const getResponseDataShow = (dataSource: DataSource) => {
	try {
		switch (dataSource.responseType) {
			case "Text":
				return dataSource.response.data.toString();
			case "JSON":
				return JSON.stringify(dataSource.response.data, null, 4);
			default:
				return "不支持预览";
		}
	} catch (error) {
		return "无数据";
	}
};
</script>

<template>
	<form class="form" @submit.prevent>
		<MyButton variant="success" @click="addDataSource()">添加数据源</MyButton>
		<details v-for="(v, i) in props.component.dataSources" :key="v.name" open class="details">
			<summary>
				<span>{{ v.name }}</span>
			</summary>
			<fieldset>
				<FormItem
					label="名称"
					for="setter-data-source-name"
					:icons="[{ href: '#pen-to-square', onClick: () => editName(v.name) }]"
				>
					<input id="setter-data-source-name" readonly :value="v.name" />
				</FormItem>
				<FormItem label="请求地址" for="setter-data-source-request-url">
					<input
						id="setter-data-source-request-url"
						type="url"
						:value="v.request.url"
						@input="v.request.url = ($event.target as HTMLInputElement).value"
					/>
				</FormItem>
				<FormItem label="请求方法" for="setter-data-source-request-method">
					<select
						id="setter-data-source-request-method"
						:value="v.request.method"
						@input="
							v.request.method = ($event.target as HTMLSelectElement).value as DataSourceRequestMethod
						"
					>
						<option value="GET">GET</option>
						<option value="POST">POST</option>
						<option value="PUT">PUT</option>
						<option value="PATCH">PATCH</option>
						<option value="DELETE">DELETE</option>
						<option value="HEAD">HEAD</option>
						<option value="OPTIONS">OPTIONS</option>
					</select>
				</FormItem>
				<FormItem label="请求标头" for="setter-data-source-request-headers">
					<table id="setter-data-source-request-headers">
						<thead>
							<tr>
								<th>键</th>
								<th>值</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(v2, i2) in [...v.request.headers, { key: '', value: '' }]" :key="i2">
								<td>
									<input
										type="text"
										:value="v2.key"
										@input="
											v.request.headers[i2] === undefined
												? (v.request.headers[i2] = {
														key: ($event.target as HTMLInputElement).value,
														value: '',
												  })
												: (v2.key = ($event.target as HTMLInputElement).value)
										"
									/>
								</td>
								<td>
									<input
										type="text"
										:value="v2.value"
										@input="
											v.request.headers[i2] === undefined
												? (v.request.headers[i2] = {
														key: '',
														value: ($event.target as HTMLInputElement).value,
												  })
												: (v2.value = ($event.target as HTMLInputElement).value)
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
				<FormItem label="请求参数" for="setter-data-source-request-params">
					<table id="setter-data-source-request-params">
						<thead>
							<tr>
								<th>键</th>
								<th>值</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(v2, i2) in [...v.request.params, { key: '', value: '' }]" :key="i2">
								<td>
									<input
										type="text"
										:value="v2.key"
										@input="
											v.request.params[i2] === undefined
												? (v.request.params[i2] = {
														key: ($event.target as HTMLInputElement).value,
														value: '',
												  })
												: (v2.key = ($event.target as HTMLInputElement).value)
										"
									/>
								</td>
								<td>
									<input
										type="text"
										:value="v2.value"
										@input="
											v.request.params[i2] === undefined
												? (v.request.params[i2] = {
														key: '',
														value: ($event.target as HTMLInputElement).value,
												  })
												: (v2.value = ($event.target as HTMLInputElement).value)
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
				<FormItem label="请求体类型" for="setter-data-source-request-body-type">
					<select
						id="setter-data-source-request-body-type"
						:value="v.request.body.type"
						@input="
							v.request.body.type = ($event.target as HTMLSelectElement)
								.value as DataSourceRequestBodyType
						"
					>
						<option value="none">none</option>
						<option value="form-data">form-data</option>
						<option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
						<option value="raw">raw</option>
					</select>
				</FormItem>
				<FormItem v-if="v.request.body.type === 'form-data'" for="setter-data-source-request-form-data-params">
					<table id="setter-data-source-request-form-data-params">
						<thead>
							<tr>
								<th>键</th>
								<th>值</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(v2, i2) in [...v.request.body.formDataParams, { key: '', value: '' }]"
								:key="i2"
							>
								<td>
									<input
										type="text"
										:value="v2.key"
										@input="
											v.request.body.formDataParams[i2] === undefined
												? (v.request.body.formDataParams[i2] = {
														key: ($event.target as HTMLInputElement).value,
														value: '',
												  })
												: (v2.key = ($event.target as HTMLInputElement).value)
										"
									/>
								</td>
								<td>
									<input
										type="text"
										:value="v2.value"
										@input="
											v.request.body.formDataParams[i2] === undefined
												? (v.request.body.formDataParams[i2] = {
														key: '',
														value: ($event.target as HTMLInputElement).value,
												  })
												: (v2.value = ($event.target as HTMLInputElement).value)
										"
									/>
								</td>
								<td>
									<MyButton
										v-if="i2 !== v.request.body.formDataParams.length"
										variant="danger"
										@click="v.request.body.formDataParams.splice(i2, 1)"
									>
										删除
									</MyButton>
								</td>
							</tr>
						</tbody>
					</table>
				</FormItem>
				<FormItem
					v-if="v.request.body.type === 'x-www-form-urlencoded'"
					for="setter-data-source-request-x-www-form-urlencoded-params"
				>
					<table id="setter-data-source-request-x-www-form-urlencoded-params">
						<thead>
							<tr>
								<th>键</th>
								<th>值</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(v2, i2) in [...v.request.body.xWwwFormUrlencodedParams, { key: '', value: '' }]"
								:key="i2"
							>
								<td>
									<input
										type="text"
										:value="v2.key"
										@input="
											v.request.body.xWwwFormUrlencodedParams[i2] === undefined
												? (v.request.body.xWwwFormUrlencodedParams[i2] = {
														key: ($event.target as HTMLInputElement).value,
														value: '',
												  })
												: (v2.key = ($event.target as HTMLInputElement).value)
										"
									/>
								</td>
								<td>
									<input
										type="text"
										:value="v2.value"
										@input="
											v.request.body.xWwwFormUrlencodedParams[i2] === undefined
												? (v.request.body.xWwwFormUrlencodedParams[i2] = {
														key: '',
														value: ($event.target as HTMLInputElement).value,
												  })
												: (v2.value = ($event.target as HTMLInputElement).value)
										"
									/>
								</td>
								<td>
									<MyButton
										v-if="i2 !== v.request.body.xWwwFormUrlencodedParams.length"
										variant="danger"
										@click="v.request.body.xWwwFormUrlencodedParams.splice(i2, 1)"
									>
										删除
									</MyButton>
								</td>
							</tr>
						</tbody>
					</table>
				</FormItem>
				<template v-if="v.request.body.type === 'raw'">
					<FormItem label="数据格式" for="setter-data-source-request-raw-type">
						<select
							id="setter-data-source-request-raw-type"
							:value="v.request.body.rawType"
							@input="
								v.request.body.rawType = ($event.target as HTMLSelectElement)
									.value as DataSourceRequestBodyRawType
							"
						>
							<option value="Text">Text</option>
							<option value="JavaScript">JavaScript</option>
							<option value="JSON">JSON</option>
							<option value="HTML">HTML</option>
							<option value="XML">XML</option>
						</select>
					</FormItem>
					<FormItem for="setter-data-source-request-raw-content">
						<textarea
							id="setter-data-source-request-raw-content"
							:value="v.request.body.rawContent"
							@input="v.request.body.rawContent = ($event.target as HTMLTextAreaElement).value"
						></textarea>
					</FormItem>
				</template>
				<FormItem label="响应类型" for="setter-data-source-response-type">
					<select
						id="setter-data-source-response-type"
						:value="v.responseType"
						@input="v.responseType = ($event.target as HTMLSelectElement).value as DataSourceResponseType"
					>
						<option value="none">none</option>
						<option value="Text">Text</option>
						<option value="JSON">JSON</option>
						<option value="FormData">FormData</option>
						<option value="Blob">Blob</option>
						<option value="ArrayBuffer">ArrayBuffer</option>
					</select>
				</FormItem>
				<FormItem label="响应数据" for="setter-data-source-response-data">
					<textarea id="setter-data-source-response-data" readonly :value="getResponseDataShow(v)"></textarea>
				</FormItem>
				<FormItem
					label="执行动作前"
					for="setter-data-source-after-handler"
					:icons="[{ href: '#code', onClick: () => editObjectValue(v, 'beforeHandler') }]"
				>
					<textarea readonly v-model="v.beforeHandler"></textarea>
				</FormItem>
				<FormItem
					label="执行动作后"
					for="setter-data-source-after-handler"
					:icons="[{ href: '#code', onClick: () => editObjectValue(v, 'afterHandler') }]"
				>
					<textarea readonly v-model="v.afterHandler"></textarea>
				</FormItem>
				<div class="button-group">
					<MyButton variant="success" @click="requestDataSource(v, props.component, {})">请求</MyButton>
					<MyButton variant="danger" @click="props.component.dataSources.splice(i, 1)">删除</MyButton>
				</div>
			</fieldset>
		</details>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
