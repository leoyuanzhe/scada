<script setup lang="ts">
import { computed, ref } from "vue";
import { useSchema } from "@/stores/useSchema";
import GlobalConfig from "./components/GlobalConfig.vue";
import LayoutConfig from "./components/LayoutConfig.vue";
import PropConfig from "./components/prop-config/PropConfig.vue";
import StateConfig from "./components/StateConfig.vue";
import DataSourceConfig from "./components/DataSourceConfig.vue";
import EmitConfig from "./components/EmitConfig.vue";

const schemaStore = useSchema();
const current = ref<"global" | "layout" | "prop" | "state" | "dataSource" | "emit">("layout");
const targetComponentV2 = computed(() => schemaStore.targetComponent ?? schemaStore.currentRootComponent);
</script>

<template>
	<div class="setter">
		<menu>
			<button :class="{ actived: current === 'global' }" @click="current = 'global'">全局</button>
			<button :class="{ actived: current === 'layout' }" @click="current = 'layout'">布局</button>
			<button :class="{ actived: current === 'prop' }" @click="current = 'prop'">属性</button>
			<button :class="{ actived: current === 'state' }" @click="current = 'state'">状态</button>
			<button :class="{ actived: current === 'dataSource' }" @click="current = 'dataSource'">数据</button>
			<button :class="{ actived: current === 'emit' }" @click="current = 'emit'">事件</button>
		</menu>
		<div class="container">
			<GlobalConfig v-if="current === 'global'" :component="targetComponentV2" />
			<LayoutConfig
				v-if="current === 'layout' && targetComponentV2?.layout && targetComponentV2"
				:component="targetComponentV2"
			/>
			<PropConfig v-if="current === 'prop' && targetComponentV2" :component="targetComponentV2" />
			<StateConfig v-if="current === 'state' && targetComponentV2" :component="targetComponentV2" />
			<DataSourceConfig v-if="current === 'dataSource' && targetComponentV2" :component="targetComponentV2" />
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
