<script setup lang="ts">
import { computed } from "vue";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import type { Props } from "./types/Props";

const clientStore = useClient();
const schemaStore = useSchema();
const targetComponent = useTargetComponent();
const dragger = useDragger();
const props = computed<Props>(() => targetComponent.component.value?.props || {});
</script>

<template>
	<div class="setter">
		<form>
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
					<input id="setter-schema-width" type="number" :value="schemaStore.props.width" @input="(schemaStore.props.width = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
				</article>
				<article>
					<label for="setter-schema-height">高度</label>
					<input id="setter-schema-height" type="number" :value="schemaStore.props.height" @input="schemaStore.props.height = Number(($event.target as HTMLInputElement).value)" />
				</article>
			</fieldset>
		</form>
		<form v-if="targetComponent.component.value">
			<h1>{{ targetComponent.component.value.title }}</h1>
			<fieldset>
				<legend>属性</legend>
				<template v-for="(v, k) in props" :key="k">
					<article v-if="k === 'left'">
						<label for="setter-left">X坐标</label>
						<input id="setter-left" type="number" :value="props[k]" @input="(props[k] = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
					</article>
					<article v-if="k === 'top'">
						<label for="setter-top">Y坐标</label>
						<input id="setter-top" type="number" :value="props[k]" @input="(props[k] = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
					</article>
					<article v-if="k === 'width'">
						<label for="setter-width">宽度</label>
						<input id="setter-width" type="number" :value="props[k]" @input="(props[k] = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
					</article>
					<article v-if="k === 'height'">
						<label for="setter-height">高度</label>
						<input id="setter-height" type="number" :value="props[k]" @input="(props[k] = Number(($event.target as HTMLInputElement).value)), dragger.computedSelector()" />
					</article>
					<article v-if="k === 'text'">
						<label for="setter-text">文本</label>
						<input id="setter-text" type="text" :value="v" @input="props[k] = ($event.target as HTMLInputElement).value" />
					</article>
				</template>
			</fieldset>
		</form>
	</div>
</template>

<style scoped lang="scss">
.setter {
	padding: 10px;
	background-color: #333;
	overflow: auto;
	display: flex;
	flex-direction: column;
	row-gap: 10px;
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
}
</style>
