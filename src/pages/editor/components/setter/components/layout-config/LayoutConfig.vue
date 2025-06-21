<script setup lang="ts">
import { useDragger } from "@/pages/editor/hooks/useDragger";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import type { Schema } from "@/types/Schema";
import type { ComponentWithLayout } from "@/types/Component";

const clientStore = useClient();
const schemaStore = useSchema();
const dragger = useDragger();
const props = withDefaults(defineProps<{ component: Schema | ComponentWithLayout }>(), {});
</script>

<template>
	<form class="form" @submit.prevent>
		<h1>布局</h1>
		<fieldset>
			<legend>布局</legend>
			<template v-if="schemaStore.isSchema(props.component)">
				<article class="form-item">
					<label for="setter-schema-left">X坐标</label>
					<input id="setter-schema-left" type="number" :value="clientStore.canvas.left" @input="(clientStore.canvas.left = Math.round(Number(($event.target as HTMLInputElement).value))), dragger.computedSelector()" />
				</article>
				<article class="form-item">
					<label for="setter-schema-top">Y坐标</label>
					<input id="setter-schema-top" type="number" :value="clientStore.canvas.top" @input="(clientStore.canvas.top = Math.round(Number(($event.target as HTMLInputElement).value))), dragger.computedSelector()" />
				</article>
			</template>
			<template v-else>
				<article class="form-item">
					<label for="setter-layout-left">X坐标</label>
					<input id="setter-layout-left" type="number" :value="props.component.layout.left" @input="(props.component.layout.left = Math.round(Number(($event.target as HTMLInputElement).value))), dragger.computedSelector()" />
				</article>
				<article class="form-item">
					<label for="setter-layout-top">Y坐标</label>
					<input id="setter-layout-top" type="number" :value="props.component.layout.top" @input="(props.component.layout.top = Math.round(Number(($event.target as HTMLInputElement).value))), dragger.computedSelector()" />
				</article>
			</template>
			<article class="form-item">
				<label for="setter-layout-width">宽度</label>
				<input id="setter-layout-width" type="number" :value="props.component.layout.width" @input="(props.component.layout.width = Math.round(Number(($event.target as HTMLInputElement).value))), dragger.computedSelector()" />
			</article>
			<article class="form-item">
				<label for="setter-layout-height">高度</label>
				<input id="setter-layout-height" type="number" :value="props.component.layout.height" @input="(props.component.layout.height = Math.round(Number(($event.target as HTMLInputElement).value))), dragger.computedSelector()" />
			</article>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
