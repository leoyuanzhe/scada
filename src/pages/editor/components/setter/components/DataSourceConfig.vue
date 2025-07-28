<script setup lang="ts">
import type { Component, DataSourceBodyType, DataSourceMethod } from "@/types/Component";
import FormItem from "@/components/form-item/FormItem.vue";
import MyButton from "@/components/my-button/MyButton.vue";

const props = withDefaults(defineProps<{ component: Component }>(), {});
const addDataSource = () => {
	fn(0);
	function fn(depth: number) {
		const name = "dataSource" + (props.component.dataSources.length + 1 + depth);
		if (!props.component.dataSources.some((v) => v.name == name))
			props.component.dataSources.push({
				name,
				autoRequest: true,
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
				response: {
					type: "JSON",
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
</script>

<template>
	<form class="form" @submit.prevent>
		<h1 @click="props.component.state.state1 = '2'">数据</h1>
		<fieldset>
			<MyButton variant="success" @click="addDataSource()">添加</MyButton>
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
					<FormItem label="请求地址" for="setter-data-source-url">
						<input id="setter-data-source-url" type="url" :value="v.url" />
					</FormItem>
					<FormItem label="请求方法" for="setter-data-source-method">
						<select
							id="setter-data-source-method"
							:value="v.method"
							@input="v.method = ($event.target as HTMLSelectElement).value as DataSourceMethod"
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
					<FormItem label="请求标头" for="setter-data-source-headers">
						<table id="setter-data-source-headers">
							<thead>
								<tr>
									<th>键</th>
									<th>值</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(v2, i2) in [...v.headers, { key: '', value: '' }]" :key="i2">
									<td>
										<input
											type="text"
											:value="v2.key"
											@input="
												v.headers[i2] === undefined
													? (v.headers[i2] = {
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
												v.headers[i2] === undefined
													? (v.headers[i2] = {
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
					<FormItem label="请求参数" for="setter-data-source-params">
						<table id="setter-data-source-params">
							<thead>
								<tr>
									<th>键</th>
									<th>值</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(v2, i2) in [...v.params, { key: '', value: '' }]" :key="i2">
									<td>
										<input
											type="text"
											:value="v2.key"
											@input="
												v.params[i2] === undefined
													? (v.params[i2] = {
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
												v.params[i2] === undefined
													? (v.params[i2] = {
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
					<details class="details" open>
						<summary>请求体</summary>
						<fieldset>
							<FormItem label="请求方法" for="setter-data-source-body-type">
								<select
									id="setter-data-source-body-type"
									:value="v.body.type"
									@input="
										v.body.type = ($event.target as HTMLSelectElement).value as DataSourceBodyType
									"
								>
									<option value="none">none</option>
									<option value="form-data">form-data</option>
									<option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
									<option value="raw">raw</option>
								</select>
							</FormItem>
							<FormItem v-if="v.body.type === 'form-data'" for="setter-data-source-form-data-params">
								<table id="setter-data-source-form-data-params">
									<thead>
										<tr>
											<th>键</th>
											<th>值</th>
											<th>操作</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="(v2, i2) in [...v.body.formDataParams, { key: '', value: '' }]"
											:key="i2"
										>
											<td>
												<input
													type="text"
													:value="v2.key"
													@input="
														v.body.formDataParams[i2] === undefined
															? (v.body.formDataParams[i2] = {
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
														v.body.formDataParams[i2] === undefined
															? (v.body.formDataParams[i2] = {
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
							<FormItem
								v-if="v.body.type === 'x-www-form-urlencoded'"
								for="setter-data-source-x-www-form-urlencoded-params"
							>
								<table id="setter-data-source-x-www-form-urlencoded-params">
									<thead>
										<tr>
											<th>键</th>
											<th>值</th>
											<th>操作</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="(v2, i2) in [
												...v.body.xWwwFormUrlencodedParams,
												{ key: '', value: '' },
											]"
											:key="i2"
										>
											<td>
												<input
													type="text"
													:value="v2.key"
													@input="
														v.body.xWwwFormUrlencodedParams[i2] === undefined
															? (v.body.xWwwFormUrlencodedParams[i2] = {
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
														v.body.xWwwFormUrlencodedParams[i2] === undefined
															? (v.body.xWwwFormUrlencodedParams[i2] = {
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
							<template v-if="v.body.type === 'raw'">
								<FormItem for="setter-data-source-raw-type">
									<select
										id="setter-data-source-raw-type"
										:value="v.body.rawType"
										@input="
											v.method = ($event.target as HTMLSelectElement).value as DataSourceMethod
										"
									>
										<option value="Text">Text</option>
										<option value="JavaScript">JavaScript</option>
										<option value="JSON">JSON</option>
										<option value="HTML">HTML</option>
										<option value="XML">XML</option>
									</select>
								</FormItem>
								<FormItem for="setter-data-source-raw-content">
									<textarea
										id="setter-data-source-raw-content"
										:value="v.body.rawContent"
										@input="v.body.rawContent = ($event.target as HTMLTextAreaElement).value"
									></textarea>
								</FormItem>
							</template>
						</fieldset>
					</details>
					<MyButton variant="danger" @click="props.component.dataSources.splice(i, 1)">删除</MyButton>
				</fieldset>
			</details>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
