<script setup lang="ts">
import { computed } from "vue";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import TextConfig from "./material-configs/text-config/TextConfig.vue";
import type { ComponentWithLayout } from "@/types/Component";

const clientStore = useClient();
const schemaStore = useSchema();
const targetComponent = useTargetComponent();
const dragger = useDragger();
const ffff = () => {
	const str = "state.a + 'hhh'";
	const fn = new Function("state", "return " + str) as (state: ReturnType<typeof useSchema>["state"]) => number;
	schemaStore.components[0].props.text = computed(() => fn(schemaStore.state));
};
</script>

<template>
	<form @submit.prevent>
		<h1>画布</h1>
		<fieldset>
			<legend>布局</legend>
			<article class="form-item">
				<label for="setter-schema-left">X坐标</label>
				<input id="setter-schema-left" type="number" :value="clientStore.canvas.left" @input="(clientStore.canvas.left = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
			</article>
			<article class="form-item">
				<label for="setter-schema-top">Y坐标</label>
				<input id="setter-schema-top" type="number" :value="clientStore.canvas.top" @input="(clientStore.canvas.top = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
			</article>
			<article class="form-item">
				<label for="setter-schema-width">宽度</label>
				<input id="setter-schema-width" type="number" :value="schemaStore.layout.width" @input="(schemaStore.layout.width = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
			</article>
			<article class="form-item">
				<label for="setter-schema-height">高度</label>
				<input id="setter-schema-height" type="number" :value="schemaStore.layout.height" @input="schemaStore.layout.height = Number(($event.target as HTMLInputElement).value)" />
			</article>
		</fieldset>
	</form>
	<form v-if="targetComponent.component.value" @submit.prevent>
		<h1 @click="ffff()">{{ targetComponent.component.value.title }}</h1>
		<fieldset>
			<legend>布局</legend>
			<template v-if="targetComponent.component.value.layout">
				<article class="form-item">
					<label for="setter-left">X坐标</label>
					<input
						id="setter-left"
						type="number"
						:value="targetComponent.component.value.layout.left"
						@input="(targetComponent.component.value.layout.left = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
				<article class="form-item">
					<label for="setter-top">Y坐标</label>
					<input
						id="setter-top"
						type="number"
						:value="targetComponent.component.value.layout.top"
						@input="(targetComponent.component.value.layout.top = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
				<article class="form-item">
					<label for="setter-width">宽度</label>
					<input
						id="setter-width"
						type="number"
						:value="targetComponent.component.value.layout.width"
						@input="(targetComponent.component.value.layout.width = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
				<article class="form-item">
					<label for="setter-height">高度</label>
					<input
						id="setter-height"
						type="number"
						:value="targetComponent.component.value.layout.height"
						@input="(targetComponent.component.value.layout.height = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
			</template>
		</fieldset>
		<TextConfig v-if="targetComponent.component.value.key === 'text'" :component="(targetComponent.component.value as ComponentWithLayout)" />
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form-item" as *;
form {
	display: flex;
	flex-direction: column;
	row-gap: 10px;
	h1 {
		font-size: 18px;
		font-weight: bold;
	}
	> fieldset {
		padding: 10px;
		display: flex;
		flex-direction: column;
		row-gap: 10px;
		background-color: #232323;
		border-radius: 10px;
		legend {
			padding: 4px 12px;
			font-weight: bold;
			background-color: #232323;
			border-radius: 10px;
			box-shadow: 0 0 3px 1px #444;
		}
	}
}
</style>
