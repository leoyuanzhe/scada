<script setup lang="ts">
import { computed, ref } from "vue";
import type { Schema } from "@/types/Schema";
import type { Component, ComponentWithLayout } from "@/types/Component";
import { useSchema } from "@/stores/useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import PropConfig from "./components/prop-config/PropConfig.vue";
import EmitConfig from "./components/emit-config/EmitConfig.vue";
import LayoutConfig from "./components/layout-config/LayoutConfig.vue";

const schemaStore = useSchema();
const targetComponent = useTargetComponent();
const current = ref<"layout" | "prop" | "emit">("layout");
const targetComponentV2 = computed<Schema | Component>(() => (targetComponent.component.value ? targetComponent.component.value : schemaStore.$state));
const layoutConfigComponent = computed(() => targetComponentV2.value as Schema | ComponentWithLayout);
</script>

<template>
	<div class="setter">
		<menu>
			<button :class="{ active: current === 'layout' }" @click="current = 'layout'">布局</button>
			<button :class="{ active: current === 'prop' }" @click="current = 'prop'">属性</button>
			<button :class="{ active: current === 'emit' }" @click="current = 'emit'">事件</button>
		</menu>
		<div class="container">
			<LayoutConfig v-if="current === 'layout' && targetComponentV2.layout" :component="layoutConfigComponent" />
			<PropConfig v-if="current === 'prop'" :component="targetComponentV2" />
			<EmitConfig v-if="current === 'emit'" :component="targetComponentV2" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.setter {
	display: flex;
	flex-direction: column;
	menu {
		padding: 10px;
		display: flex;
		column-gap: 10px;
		background-color: #333;
		box-shadow: 0 0 3px 1px #666;
		z-index: 1;
		button {
			width: 40px;
			height: 40px;
			background-color: #444;
			border-radius: 4px;
			transition: box-shadow 0.2s;
			&.active,
			&:hover {
				box-shadow: 0 0 3px 1px var(--primary-color);
			}
		}
	}
	.container {
		flex: 1;
		padding: 10px;
		background-color: #333;
		overflow: auto;
		display: flex;
		flex-direction: column;
		row-gap: 10px;
	}
}
</style>
