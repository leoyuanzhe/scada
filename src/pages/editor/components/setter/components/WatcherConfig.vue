<script setup lang="ts">
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import FormItem from "@/components/form-item/FormItem.vue";
import MyButton from "@/components/my-button/MyButton.vue";
import { editObjectValue } from "@/helpers/schema";

interface Props {
	component: Schema | Component;
}
const props = withDefaults(defineProps<Props>(), {});
const addWatcher = () => {
	fn(0);
	function fn(depth: number) {
		const name = "watcher" + (props.component.watchers.length + 1 + depth);
		if (!props.component.watchers.some((v) => v.name == name))
			props.component.watchers.push({
				name,
				sourceHandler: "return () => null",
				executeType: "concurrent",
				timeout: 0,
				deep: false,
				immediate: false,
				once: false,
				actionsName: [],
			});
		else fn(depth + 1);
	}
};
const editName = (name: string) => {
	const oldNames = props.component.watchers.filter((v) => v.name !== name).map((v) => v.name);
	const action = props.component.watchers.find((v) => v.name === name);
	const newName = prompt("请输入新的名称", name);
	if (action && newName !== null) {
		try {
			if (oldNames.some((k) => k === newName)) throw new Error("名称已存在");
			action.name = newName;
		} catch (error: any) {
			alert(error.message);
			editName(name);
		}
	}
};
</script>

<template>
	<form class="form" @submit.prevent>
		<MyButton variant="success" @click="addWatcher()">添加监听器</MyButton>
		<details v-for="(v, i) in props.component.watchers" :key="v.name" open class="details">
			<summary>
				<span>{{ v.name }}</span>
			</summary>
			<fieldset>
				<FormItem
					label="名称"
					for="setter-watcher-name"
					:icons="[{ href: '#pen-to-square', onClick: () => editName(v.name) }]"
				>
					<input id="setter-watcher-name" readonly :value="v.name" />
				</FormItem>
				<FormItem
					label="监听源"
					for="setter-watcher-source-handler"
					:icons="[{ href: '#code', onClick: () => editObjectValue(v, 'sourceHandler') }]"
				>
					<textarea id="setter-watcher-source-handler" readonly :value="v.sourceHandler"></textarea>
				</FormItem>
				<FormItem label="深度监听" for="setter-watcher-deep">
					<input
						id="setter-watcher-deep"
						type="checkbox"
						:checked="v.deep"
						@input="v.deep = ($event.target as HTMLInputElement).checked"
					/>
				</FormItem>
				<FormItem label="立即触发" for="setter-watcher-immediate">
					<input
						id="setter-watcher-immediate"
						type="checkbox"
						:checked="v.immediate"
						@input="v.immediate = ($event.target as HTMLInputElement).checked"
					/>
				</FormItem>
				<FormItem label="是否只触发一次" for="setter-watcher-once">
					<input
						id="setter-watcher-once"
						type="checkbox"
						:checked="v.once"
						@input="v.once = ($event.target as HTMLInputElement).checked"
					/>
				</FormItem>
				<FormItem label="选择动作" for="setter-watcher-actions-name">
					<div id="setter-watcher-actions-name" class="checkbox-group">
						<label v-for="v2 in props.component.actions" :key="v.name">
							<input
								type="checkbox"
								:checked="v.actionsName.includes(v2.name)"
								@change="
									v.actionsName.includes(v2.name)
										? v.actionsName.splice(v.actionsName.indexOf(v2.name), 1)
										: v.actionsName.push(v2.name)
								"
							/>
							<span>{{ v.name }}</span>
						</label>
					</div>
				</FormItem>
				<MyButton variant="danger" @click="props.component.watchers.splice(i, 1)">删除</MyButton>
			</fieldset>
		</details>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
