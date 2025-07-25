<script setup lang="ts">
import type { Component } from "@/types/Component";
import { editObjectValue } from "@/helpers/schema";
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
				url: "",
				method: "GET",
				params: {},
				headers: {},
				body: {
					type: "none",
					contentType: "Text",
					content: "",
				},
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
						<input id="setter-data-source-url" type="url" readonly :value="v.url" />
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
								<tr v-for="(k, i) in [...Object.keys(v.headers), '']" :key="i">
									<td>
										<input
											type="text"
											:value="k"
											@change="
												(v.headers[($event.target as HTMLInputElement).value] = v.headers[k]),
													delete v.headers[k]
											"
										/>
									</td>
									<td>
										<input
											type="text"
											:value="v.headers[k]"
											@change="v.headers[k] = ($event.target as HTMLInputElement).value"
										/>
									</td>
									<td>
										<MyButton>删除</MyButton>
									</td>
								</tr>
							</tbody>
						</table>
					</FormItem>
					<MyButton variant="danger" @click="props.component.dataSources.splice(i, 1)">删除</MyButton>
				</fieldset>
			</details>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
