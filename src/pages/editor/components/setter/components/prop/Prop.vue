<script setup lang="ts">
import { computed } from "vue";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import type { Props } from "../../types/Props";

const clientStore = useClient();
const schemaStore = useSchema();
const targetComponent = useTargetComponent();
const dragger = useDragger();
const props = computed<Props>(() => targetComponent.component.value?.props || {});
const ffff = () => {
	console.log(schemaStore.components);
	const str = "state.a + 'hhh'";
	const fn = new Function("state", "return " + str) as (state: ReturnType<typeof useSchema>["state"]) => number;
	console.log(fn(schemaStore.state));
	schemaStore.components[0].props.text = computed(() => fn(schemaStore.state));
	console.log(schemaStore.components[0].props.text.toString());

	console.log(schemaStore.$state, JSON.stringify(schemaStore.$state));
};
</script>

<template>
	<form @submit.prevent>
		<h1>画布</h1>
		<fieldset>
			<legend>属性</legend>
			<article>
				<label for="setter-schema-left">X坐标</label>
				<input id="setter-schema-left" type="number" :value="clientStore.canvas.left" @input="(clientStore.canvas.left = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
			</article>
			<article>
				<label for="setter-schema-top">Y坐标</label>
				<input id="setter-schema-top" type="number" :value="clientStore.canvas.top" @input="(clientStore.canvas.top = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
			</article>
			<article>
				<label for="setter-schema-width">宽度</label>
				<input id="setter-schema-width" type="number" :value="schemaStore.layout.width" @input="(schemaStore.layout.width = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
			</article>
			<article>
				<label for="setter-schema-height">高度</label>
				<input id="setter-schema-height" type="number" :value="schemaStore.layout.height" @input="schemaStore.layout.height = Number(($event.target as HTMLInputElement).value)" />
			</article>
		</fieldset>
	</form>
	<form v-if="targetComponent.component.value" @submit.prevent>
		<h1 @click="ffff()">{{ targetComponent.component.value.title }}</h1>
		<fieldset>
			<legend>属性</legend>
			<template v-if="targetComponent.component.value.layout">
				<article>
					<label for="setter-left">X坐标</label>
					<input
						id="setter-left"
						type="number"
						:value="targetComponent.component.value.layout.left"
						@input="(targetComponent.component.value.layout.left = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
				<article>
					<label for="setter-top">Y坐标</label>
					<input
						id="setter-top"
						type="number"
						:value="targetComponent.component.value.layout.top"
						@input="(targetComponent.component.value.layout.top = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
				<article>
					<label for="setter-width">宽度</label>
					<input
						id="setter-width"
						type="number"
						:value="targetComponent.component.value.layout.width"
						@input="(targetComponent.component.value.layout.width = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
				<article>
					<label for="setter-height">高度</label>
					<input
						id="setter-height"
						type="number"
						:value="targetComponent.component.value.layout.height"
						@input="(targetComponent.component.value.layout.height = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()"
					/>
				</article>
			</template>
			<template v-for="(v, k) in props" :key="k">
				<article v-if="k === 'text'">
					<label for="setter-text">文本</label>
					<input id="setter-text" type="text" :value="v" @input="props[k] = ($event.target as HTMLInputElement).value" />
				</article>
			</template>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
form {
	display: flex;
	flex-direction: column;
	row-gap: 10px;
	h1 {
		font-size: 18px;
		font-weight: bold;
	}
	fieldset {
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
		article {
			display: flex;
			label {
				flex-shrink: 0;
				margin-right: 10px;
				min-width: 80px;
				font-size: 14px;
				line-height: 30px;
			}
			input[type="text"],
			input[type="number"],
			input[type="select"] {
				flex: 1;
				padding: 0 6px;
				background-color: #111;
				line-height: 30px;
				border-radius: 4px;
				transition: box-shadow 0.2s;
				&:focus-within {
					box-shadow: 0 0 3px 1px var(--primary-color);
				}
			}
		}
	}
}
</style>
