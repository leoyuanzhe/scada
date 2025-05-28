<script setup lang="ts">
import { computed } from "vue";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import type { Props } from "./types/Props";

const clientStore = useClient();
const schemaStore = useSchema();
const dragger = useDragger();
const props = computed<Props>(() => schemaStore.targetComponent?.props || {});
</script>

<template>
	<div class="setter">
		<form>
			<fieldset>
				<legend>画布</legend>
				<article>
					<label for="setter-left">X坐标</label>
					<input id="setter-left" type="number" :value="clientStore.canvas.left" @input="(clientStore.canvas.left = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
				</article>
				<article>
					<label for="setter-top">Y坐标</label>
					<input id="setter-top" type="number" :value="clientStore.canvas.top" @input="(clientStore.canvas.top = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
				</article>
				<article>
					<label for="setter-width">宽度</label>
					<input id="setter-width" type="number" :value="schemaStore.canvas.width" @input="(schemaStore.canvas.width = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
				</article>
				<article>
					<label for="setter-height">高度</label>
					<input id="setter-height" type="number" :value="schemaStore.canvas.height" @input="schemaStore.canvas.height = Number(($event.target as HTMLInputElement).value)" />
				</article>
			</fieldset>
			<fieldset v-if="schemaStore.targetComponent">
				<legend>{{ schemaStore.targetComponent.title }}</legend>
				<fieldset>
					<legend>通用</legend>
					<article>
						<label for="setter-left">X坐标</label>
						<input id="setter-left" type="number" :value="schemaStore.targetComponent.left" @input="(schemaStore.targetComponent.left = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
					</article>
					<article>
						<label for="setter-top">Y坐标</label>
						<input id="setter-top" type="number" :value="schemaStore.targetComponent.top" @input="(schemaStore.targetComponent.top = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
					</article>
					<article>
						<label for="setter-width">宽度</label>
						<input id="setter-width" type="number" :value="schemaStore.targetComponent.width" @input="(schemaStore.targetComponent.width = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
					</article>
					<article>
						<label for="setter-height">高度</label>
						<input id="setter-height" type="number" :value="schemaStore.targetComponent.height" @input="(schemaStore.targetComponent.height = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
					</article>
				</fieldset>
				<fieldset v-for="(v, k) in props" :key="k">
					<article v-if="k === 'text'">
						<label for="setter-text">文本</label>
						<input id="setter-text" v-if="k === 'text'" type="text" :value="v" @input="props[k] = ($event.target as HTMLInputElement).value" />
					</article>
				</fieldset>
			</fieldset>
		</form>
	</div>
</template>

<style scoped lang="scss">
.setter {
	background-color: #333;
}
</style>
