<script setup lang="ts">
import { useDragger } from "@/pages/editor/hooks/useDragger";
import type { Schema } from "@/types/Schema";
import type { Component, ComponentWithLayout } from "@/types/Component";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import FormItem from "@/components/form-item/FormItem.vue";

const clientStore = useClient();
const schemaStore = useSchema();
const dragger = useDragger();
const targetComponent = useTargetComponent();
const props = withDefaults(defineProps<{ component: Schema | Component }>(), {});
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>基本</h1>
		<fieldset v-if="props.component.layout">
			<legend>布局</legend>
			<template v-if="schemaStore.isSchema(props.component)">
				<FormItem label="X坐标" for="setter-layout-left">
					<input id="setter-layout-left" type="number" :value="clientStore.canvas.left" @input="(clientStore.canvas.left = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
				</FormItem>
				<FormItem label="Y坐标" for="setter-layout-top">
					<input id="setter-layout-top" type="number" :value="clientStore.canvas.top" @input="(clientStore.canvas.top = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
				</FormItem>
				<FormItem label="缩放倍数" for="setter-layout-scale">
					<input
						id="setter-layout-scale"
						type="number"
						step="0.05"
						min="0.1"
						max="5"
						:value="clientStore.canvas.scale"
						@input="(clientStore.canvas.scale = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</FormItem>
			</template>
			<template v-else>
				<FormItem label="X坐标" for="setter-layout-left">
					<input
						id="setter-layout-left"
						type="number"
						:value="(props.component as ComponentWithLayout).layout.left"
						@input="((props.component as ComponentWithLayout).layout.left = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</FormItem>
				<FormItem label="Y坐标" for="setter-layout-top">
					<input
						id="setter-layout-top"
						type="number"
						:value="(props.component as ComponentWithLayout).layout.top"
						@input="((props.component as ComponentWithLayout).layout.top = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</FormItem>
			</template>
			<FormItem label="宽度" for="setter-layout-width">
				<input id="setter-layout-width" type="number" :value="props.component.layout.width" @input="(props.component.layout.width = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
			</FormItem>
			<FormItem label="高度" for="setter-layout-height">
				<input id="setter-layout-height" type="number" :value="props.component.layout.height" @input="(props.component.layout.height = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
			</FormItem>
		</fieldset>
		<template v-if="schemaStore.isSchema(props.component)">
			<fieldset>
				<legend>网格</legend>
				<FormItem label="启用" for="setter-grid-enable">
					<input id="setter-grid-enable" type="checkbox" :checked="clientStore.grid.enable" @input="clientStore.grid.enable = Boolean(($event.target as HTMLInputElement).checked)" />
				</FormItem>
				<FormItem label="间隔" for="setter-grid-span">
					<input id="setter-grid-span" type="number" :value="clientStore.grid.span" @input="clientStore.grid.span = Number(($event.target as HTMLInputElement).value)" />
				</FormItem>
			</fieldset>
			<fieldset>
				<legend>吸附</legend>
				<FormItem label="启用" for="setter-snap-enable">
					<input id="setter-snap-enable" type="checkbox" :checked="clientStore.snap.enable" @input="clientStore.snap.enable = Boolean(($event.target as HTMLInputElement).checked)" />
				</FormItem>
				<FormItem label="距离" for="setter-snap-distance">
					<input id="setter-snap-distance" type="number" :value="clientStore.snap.distance" @input="clientStore.snap.distance = Number(($event.target as HTMLInputElement).value)" />
				</FormItem>
			</fieldset>
			<fieldset>
				<legend>操作</legend>
				<FormItem label="启用" for="setter-operate-enable">
					<input
						id="setter-operate-enable"
						type="checkbox"
						:checked="clientStore.operate.enable"
						@input="(clientStore.operate.enable = Boolean(($event.target as HTMLInputElement).checked)), (targetComponent.componentId.value = '')"
					/>
				</FormItem>
			</fieldset>
		</template>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
