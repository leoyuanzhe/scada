<script setup lang="ts">
import { computed, ref } from "vue";
import { useSchema } from "@/stores/useSchema";
import GlobalConfig from "./components/GlobalConfig.vue";
import LayoutConfig from "./components/LayoutConfig.vue";
import PropConfig from "./components/prop-config/PropConfig.vue";
import StateConfig from "./components/StateConfig.vue";
import DataSourceConfig from "./components/DataSourceConfig.vue";
import EmitConfig from "./components/EmitConfig.vue";

interface Props {
	width: number;
}
interface Emits {
	(e: "update:width", width: number): void;
}
const schemaStore = useSchema();
const props = withDefaults(defineProps<Props>(), {});
const emits = defineEmits<Emits>();
const current = ref<"global" | "layout" | "prop" | "state" | "dataSource" | "emit">("layout");
const targetComponentV2 = computed(() => schemaStore.targetComponent ?? schemaStore.currentRootComponent);
const resizerOnMouseDown = (e: MouseEvent) => {
	document.body.addEventListener("mousemove", onMouseMove);
	document.body.addEventListener("mouseup", onMouseUp);
	const startX = e.clientX;
	const startWidth = props.width;
	function onMouseMove(e: MouseEvent) {
		const moveX = e.clientX - startX;
		emits("update:width", startWidth - moveX);
	}
	function onMouseUp() {
		document.body.removeEventListener("mousemove", onMouseMove);
		document.body.removeEventListener("mouseup", onMouseUp);
	}
};
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
		<div class="resizer" @mousedown="resizerOnMouseDown($event)"></div>
	</div>
</template>

<style scoped lang="scss">
.setter {
	position: relative;
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
		overflow: auto;
		button {
			flex-shrink: 0;
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
	.resizer {
		position: absolute;
		left: 0;
		top: 0;
		width: 4px;
		height: 100%;
		background-color: var(--primary-color);
		transition: opacity 0.2s;
		cursor: col-resize;
		z-index: 1;
		opacity: 0;
		&:hover {
			opacity: 1;
		}
	}
}
</style>
