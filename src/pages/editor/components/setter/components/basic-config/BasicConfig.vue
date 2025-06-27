<script setup lang="ts">
import { useDragger } from "@/pages/editor/hooks/useDragger";
import type { Schema } from "@/types/Schema";
import type { Component, ComponentWithLayout } from "@/types/Component";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";

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
				<article class="form-item">
					<label for="setter-layout-left">X坐标</label>
					<input id="setter-layout-left" type="number" :value="clientStore.canvas.left" @input="(clientStore.canvas.left = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
				</article>
				<article class="form-item">
					<label for="setter-layout-top">Y坐标</label>
					<input id="setter-layout-top" type="number" :value="clientStore.canvas.top" @input="(clientStore.canvas.top = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
				</article>
				<article class="form-item">
					<label for="setter-layout-scale">缩放倍数</label>
					<input
						id="setter-layout-scale"
						type="number"
						step="0.05"
						min="0.1"
						max="5"
						:value="clientStore.canvas.scale"
						@input="(clientStore.canvas.scale = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
			</template>
			<template v-else>
				<article class="form-item">
					<label for="setter-layout-left">X坐标</label>
					<input
						id="setter-layout-left"
						type="number"
						:value="(props.component as ComponentWithLayout).layout.left"
						@input="((props.component as ComponentWithLayout).layout.left = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
				<article class="form-item">
					<label for="setter-layout-top">Y坐标</label>
					<input
						id="setter-layout-top"
						type="number"
						:value="(props.component as ComponentWithLayout).layout.top"
						@input="((props.component as ComponentWithLayout).layout.top = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
			</template>
			<article class="form-item">
				<label for="setter-layout-width">宽度</label>
				<input id="setter-layout-width" type="number" :value="props.component.layout.width" @input="(props.component.layout.width = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
			</article>
			<article class="form-item">
				<label for="setter-layout-height">高度</label>
				<input id="setter-layout-height" type="number" :value="props.component.layout.height" @input="(props.component.layout.height = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
			</article>
		</fieldset>
		<template v-if="schemaStore.isSchema(props.component)">
			<fieldset>
				<legend>网格</legend>
				<article class="form-item">
					<label for="setter-grid-enable">启用</label>
					<div class="checkbox-group">
						<label>
							<input id="setter-grid-enable" type="checkbox" :checked="clientStore.grid.enable" @input="clientStore.grid.enable = Boolean(($event.target as HTMLInputElement).checked)" />
						</label>
					</div>
				</article>
				<article class="form-item">
					<label for="setter-grid-span">间隔</label>
					<input id="setter-grid-span" type="number" :value="clientStore.grid.span" @input="clientStore.grid.span = Number(($event.target as HTMLInputElement).value)" />
				</article>
			</fieldset>
			<fieldset>
				<legend>吸附</legend>
				<article class="form-item">
					<label for="setter-snap-enable">启用</label>
					<div class="checkbox-group">
						<label>
							<input id="setter-snap-enable" type="checkbox" :checked="clientStore.snap.enable" @input="clientStore.snap.enable = Boolean(($event.target as HTMLInputElement).checked)" />
						</label>
					</div>
				</article>
				<article class="form-item">
					<label for="setter-snap-distance">距离</label>
					<input id="setter-snap-distance" type="number" :value="clientStore.snap.distance" @input="clientStore.snap.distance = Number(($event.target as HTMLInputElement).value)" />
				</article>
			</fieldset>
			<fieldset>
				<legend>操作</legend>
				<article class="form-item">
					<label for="setter-action-enable">启用</label>
					<div class="checkbox-group">
						<label>
							<input
								id="setter-action-enable"
								type="checkbox"
								:checked="clientStore.action.enable"
								@input="(clientStore.action.enable = Boolean(($event.target as HTMLInputElement).checked)), (targetComponent.componentId.value = '')"
							/>
						</label>
					</div>
				</article>
			</fieldset>
		</template>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
