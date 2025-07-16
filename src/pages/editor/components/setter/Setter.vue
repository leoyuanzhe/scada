<script setup lang="ts">
import { computed, ref } from "vue";
import { useSchema } from "@/stores/useSchema";
import CanvasConfig from "./components/canvas-config/CanvasConfig.vue";
import LayoutConfig from "./components/layout-config/LayoutConfig.vue";
import PropConfig from "./components/prop-config/PropConfig.vue";
import StateConfig from "./components/state-config/StateConfig.vue";
import EmitConfig from "./components/emit-config/EmitConfig.vue";

const schemaStore = useSchema();
const current = ref<"canvas" | "layout" | "prop" | "state" | "emit">("canvas");
const targetComponentV2 = computed(() => schemaStore.targetComponent ?? schemaStore.currentComponent);
</script>

<template>
	<div class="setter">
		<menu>
			<button :class="{ actived: current === 'canvas' }" @click="current = 'canvas'">画布</button>
			<button :class="{ actived: current === 'layout' }" @click="current = 'layout'">布局</button>
			<button :class="{ actived: current === 'prop' }" @click="current = 'prop'">属性</button>
			<button :class="{ actived: current === 'state' }" @click="current = 'state'">状态</button>
			<button :class="{ actived: current === 'emit' }" @click="current = 'emit'">事件</button>
		</menu>
		<div class="container">
			<CanvasConfig v-if="current === 'canvas'" :component="targetComponentV2" />
			<LayoutConfig v-if="current === 'layout' && targetComponentV2" :component="targetComponentV2" />
			<PropConfig v-if="current === 'prop' && targetComponentV2" :component="targetComponentV2" />
			<StateConfig v-if="current === 'state' && targetComponentV2" :component="targetComponentV2" />
			<EmitConfig v-if="current === 'emit' && targetComponentV2" :component="targetComponentV2" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.setter {
	display: flex;
	flex-direction: column;
	overflow: hidden;
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
			&.actived,
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
		overflow: auto;
	}
}
</style>
