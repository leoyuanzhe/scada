<script setup lang="ts">
import { useAsset } from "@/stores/useAsset";
import { useDragger } from "@/pages/editor/hooks/useDragger";

const assetStore = useAsset();
const dragger = useDragger();
</script>

<template>
	<div class="asset">
		<figure
			v-for="v in assetStore.assets"
			:key="v.id"
			draggable="true"
			@dragstart="dragger.assetOnDragStart($event, v.id)"
		>
			<img :src="v.cover" alt="" />
			<figcaption>{{ v.title }}</figcaption>
		</figure>
	</div>
</template>

<style scoped lang="scss">
.asset {
	padding: 10px;
	background-color: #333;
	display: flex;
	flex-direction: column;
	row-gap: 10px;
	figure {
		display: flex;
		height: 100px;
		background-color: #444;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		cursor: grab;
		transition: box-shadow 0.2s;
		&:hover {
			box-shadow: 0 0 3px 1px var(--primary-color);
		}
	}
}
</style>
