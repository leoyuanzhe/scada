<script setup lang="ts">
import { computed, ref } from "vue";
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import { useSchema } from "@/stores/useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import BasicConfig from "./components/basic-config/BasicConfig.vue";
import PropConfig from "./components/prop-config/PropConfig.vue";
import StateConfig from "./components/state-config/StateConfig.vue";
import EmitConfig from "./components/emit-config/EmitConfig.vue";

const schemaStore = useSchema();
const targetComponent = useTargetComponent();
const current = ref<"basic" | "prop" | "state" | "emit">("basic");
const targetComponentV2 = computed<Schema | Component>(() => (targetComponent.component.value ? targetComponent.component.value : schemaStore.$state));
</script>

<template>
	<div class="setter">
		<menu>
			<button :class="{ active: current === 'basic' }" @click="current = 'basic'">基本</button>
			<button :class="{ active: current === 'prop' }" @click="current = 'prop'">属性</button>
			<button :class="{ active: current === 'state' }" @click="current = 'state'">状态</button>
			<button :class="{ active: current === 'emit' }" @click="current = 'emit'">事件</button>
		</menu>
		<div class="container">
			<BasicConfig v-if="current === 'basic'" :component="targetComponentV2" />
			<PropConfig v-if="current === 'prop'" :component="targetComponentV2" />
			<StateConfig v-if="current === 'state'" :component="targetComponentV2" />
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
