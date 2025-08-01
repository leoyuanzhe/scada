<script setup lang="ts">
import { ref } from "vue";
import Layer from "./components/layer/Layer.vue";
import Asset from "./components/Asset.vue";

const current = ref<"asset" | "layer">("layer");
</script>

<template>
	<div class="sidebar">
		<menu>
			<button :class="{ actived: current === 'layer' }" @click="current = 'layer'">图层</button>
			<button :class="{ actived: current === 'asset' }" @click="current = 'asset'">资产</button>
		</menu>
		<div class="container">
			<Layer v-if="current === 'layer'" />
			<Asset v-if="current === 'asset'" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.sidebar {
	display: flex;
	overflow: hidden;
	menu {
		padding: 10px;
		display: flex;
		flex-direction: column;
		row-gap: 10px;
		background-color: #333;
		box-shadow: 0 0 3px 1px #666;
		z-index: 2;
		overflow: auto;
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
		overflow: auto;
	}
}
</style>
