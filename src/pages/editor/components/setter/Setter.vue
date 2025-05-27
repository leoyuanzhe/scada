<script setup lang="ts">
import { computed } from "vue";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "../../hooks/useDragger";
import { type Text } from "@/materials/text/Text";

const schemaStore = useSchema();
const dragger = useDragger();
const props = computed<Text["props"]>(() => schemaStore.targetComponent?.props || {});
</script>

<template>
	<div class="setter">
		<form>
			<template v-if="schemaStore.targetComponent">
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
			</template>
			<template v-for="(v, k) in props" :key="k">
				<article v-if="k === 'text'">
					<label for="setter-text">文本</label>
					<input id="setter-text" v-if="k === 'text'" type="text" :value="v" @input="props[k] = ($event.target as HTMLInputElement).value" />
				</article>
			</template>
		</form>
	</div>
</template>

<style scoped lang="scss">
.setter {
	background-color: #333;
}
</style>
