<script setup lang="ts">
import type { FitMode } from "@/types/Schema";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/hooks/useDragger";
import FormItem from "@/components/form-item/FormItem.vue";

const schemaStore = useSchema();
const clientStore = useClient();
const dragger = useDragger();
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>全局</h1>
		<fieldset>
			<legend>画布</legend>
			<FormItem label="X坐标" for="setter-layout-left">
				<input
					id="setter-layout-left"
					type="number"
					:value="clientStore.canvas.left"
					@input="
						(clientStore.canvas.left = Number(($event.target as HTMLInputElement).value)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
			<FormItem label="Y坐标" for="setter-layout-top">
				<input
					id="setter-layout-top"
					type="number"
					:value="clientStore.canvas.top"
					@input="
						(clientStore.canvas.top = Number(($event.target as HTMLInputElement).value)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
			<FormItem label="缩放倍数" for="setter-layout-scale">
				<input
					id="setter-layout-scale"
					type="number"
					step="0.05"
					min="0.1"
					max="5"
					:value="clientStore.canvas.scale"
					@input="
						(clientStore.canvas.scale = Number(($event.target as HTMLInputElement).value)),
							dragger.computedSelector()
					"
				/>
			</FormItem>
		</fieldset>
		<fieldset>
			<legend>预览</legend>
			<FormItem label="适配方式" for="setter-fit-mode">
				<select
					id="setter-fit-mode"
					:value="schemaStore.fitMode"
					@input="schemaStore.fitMode = ($event.target as HTMLInputElement).value as FitMode"
				>
					<option value="contain">包含</option>
					<option value="fill">填充</option>
				</select>
			</FormItem>
		</fieldset>
		<fieldset>
			<legend>网格</legend>
			<FormItem label="启用" for="setter-grid-enable">
				<input
					id="setter-grid-enable"
					type="checkbox"
					:checked="clientStore.grid.enable"
					@input="clientStore.grid.enable = Boolean(($event.target as HTMLInputElement).checked)"
				/>
			</FormItem>
			<FormItem label="间隔" for="setter-grid-span">
				<input
					id="setter-grid-span"
					type="number"
					min="2"
					:value="clientStore.grid.span"
					@input="clientStore.grid.span = Number(($event.target as HTMLInputElement).value)"
				/>
			</FormItem>
		</fieldset>
		<fieldset>
			<legend>吸附</legend>
			<FormItem label="启用" for="setter-snap-enable">
				<input
					id="setter-snap-enable"
					type="checkbox"
					:checked="clientStore.snap.enable"
					@input="clientStore.snap.enable = Boolean(($event.target as HTMLInputElement).checked)"
				/>
			</FormItem>
			<FormItem label="距离" for="setter-snap-distance">
				<input
					id="setter-snap-distance"
					type="number"
					min="1"
					:value="clientStore.snap.distance"
					@input="clientStore.snap.distance = Number(($event.target as HTMLInputElement).value)"
				/>
			</FormItem>
		</fieldset>
		<fieldset>
			<legend>其它</legend>
			<FormItem label="启用操作" for="setter-operate-enable">
				<input
					id="setter-operate-enable"
					type="checkbox"
					:checked="clientStore.enabledOperate"
					@input="
						(clientStore.enabledOperate = Boolean(($event.target as HTMLInputElement).checked)),
							(schemaStore.targetComponentId = '')
					"
				/>
			</FormItem>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
