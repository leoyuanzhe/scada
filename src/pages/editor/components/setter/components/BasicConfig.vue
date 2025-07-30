<script setup lang="ts">
import { useDragger } from "@/pages/editor/hooks/useDragger";
import type { Component, ComponentWithLayout } from "@/types/Component";
import FormItem from "@/components/form-item/FormItem.vue";

const dragger = useDragger();
const props = withDefaults(defineProps<{ component: Component }>(), {});
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>基本</h1>
		<fieldset>
			<legend>布局</legend>
			<FormItem label="X坐标" for="setter-basic-title">
				<input
					id="setter-basic-title"
					type="text"
					:value="(props.component as ComponentWithLayout).title"
					@input="(props.component as ComponentWithLayout).title = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
		</fieldset>
		<fieldset v-if="props.component.layout">
			<legend>布局</legend>
			<FormItem label="X坐标" for="setter-basic-layout-left">
				<input
					id="setter-basic-layout-left"
					type="number"
					:value="(props.component as ComponentWithLayout).layout.left"
					@input="
						((props.component as ComponentWithLayout).layout.left = Number(
							($event.target as HTMLInputElement).value
						)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
			<FormItem label="Y坐标" for="setter-basic-layout-top">
				<input
					id="setter-basic-layout-top"
					type="number"
					:value="(props.component as ComponentWithLayout).layout.top"
					@input="
						((props.component as ComponentWithLayout).layout.top = Number(
							($event.target as HTMLInputElement).value
						)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
			<FormItem label="宽度" for="setter-basic-layout-width">
				<input
					id="setter-basic-layout-width"
					type="number"
					:value="props.component.layout.width"
					@input="
						(props.component.layout.width = Number(($event.target as HTMLInputElement).value)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
			<FormItem label="高度" for="setter-basic-layout-height">
				<input
					id="setter-basic-layout-height"
					type="number"
					:value="props.component.layout.height"
					@input="
						(props.component.layout.height = Number(($event.target as HTMLInputElement).value)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
