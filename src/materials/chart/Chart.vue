<script setup lang="ts">
import { onMounted, onBeforeUnmount, shallowRef, useTemplateRef, watch } from "vue";
import type { ComponentWithLayout } from "@/types/Component";
import type { ChartProps, ChartEmitKey } from "./Chart";
import { initComponent, triggerEmit } from "@/helpers/schema";
import * as echarts from "echarts";

interface Props {
	component: ComponentWithLayout<ChartProps, ChartEmitKey>;
}
const props = withDefaults(defineProps<Props>(), {});
const oChart = useTemplateRef("oChart");
const instance = shallowRef<echarts.ECharts | null>(null);
const payload = {};
initComponent(props.component);
onMounted(() => {
	triggerEmit(props.component.emits.mounted, props.component, payload);
	instance.value = echarts.init(oChart.value);
	watch(
		() => props.component.props.option,
		() => {
			instance.value?.clear();
			instance.value?.setOption(props.component.props.option);
		},
		{ deep: true, immediate: true }
	);
	watch([() => props.component.layout.width, () => props.component.layout.height], () => {
		instance.value?.resize();
	});
});
onBeforeUnmount(() => triggerEmit(props.component.emits.beforeUnmount, props.component, payload));
</script>

<template>
	<div
		ref="oChart"
		class="chart"
		@click="triggerEmit(props.component.emits.click, props.component, payload, $event)"
	></div>
</template>
