<script setup lang="ts">
import type { Component } from "@/types/Component";
import type { ContainerProps } from "@/materials/container/Container";
import FormItem from "@/components/form-item/FormItem.vue";
import MyButton from "@/components/my-button/MyButton.vue";
import { editObjectValue } from "@/helpers/schema";

interface Props {
	component: Component<ContainerProps>;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<details v-if="props.component.componentization.enable" class="details" open>
		<summary>自定义属性</summary>
		<fieldset>
			<MyButton
				variant="success"
				@click="
					props.component.componentization.props.push({
						key: 'key',
						label: '标签',
						type: 'text',
						options: [],
						default: '',
					})
				"
			>
				新增属性
			</MyButton>
			<template v-for="(v, i) in props.component.componentization.props" :key="i">
				<FormItem label="key" :for="'setter-componentization-key' + i">
					<input
						:id="'setter-componentization-key' + i"
						type="text"
						readonly
						:value="v.key"
						@input="v.key = ($event.target as HTMLInputElement).value"
					/>
				</FormItem>
				<FormItem label="标签" :for="'setter-componentization-label' + i">
					<input
						:id="'setter-componentization-label' + i"
						type="text"
						:value="v.label"
						@input="v.label = ($event.target as HTMLInputElement).value"
					/>
				</FormItem>
				<FormItem
					label="默认值"
					:for="'setter-componentization-default' + i"
					:icons="[{ href: '#code', variant: 'info', onClick: () => editObjectValue(v, 'default') }]"
				>
					<input
						:id="'setter-componentization-default' + i"
						type="text"
						readonly
						:value="v.default"
						@input="v.default = ($event.target as HTMLInputElement).value"
					/>
				</FormItem>
			</template>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
