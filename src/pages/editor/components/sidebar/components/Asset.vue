<script setup lang="ts">
import { computed, ref } from "vue";
import type { Asset } from "@/types/Asset";
import { useAsset } from "@/stores/useAsset";
import { useDragger } from "@/hooks/useDragger";

const assetStore = useAsset();
const dragger = useDragger();
const current = ref("");
const categories = computed(() => {
	const res: { category: string; assets: Asset[] }[] = [];
	assetStore.assets.forEach((asset) => {
		asset.categories.forEach((category) => {
			const item = res.find((v) => v.category === category);
			if (item) {
				item.assets.push(asset);
			} else {
				res.push({ category, assets: [asset] });
			}
		});
	});
	if (!current.value && res.length) current.value = res[0]!.category;
	return res;
});
</script>

<template>
	<div class="asset">
		<menu>
			<button
				v-for="v in categories"
				:key="v.category"
				:class="{ actived: current === v.category }"
				@click="current = v.category"
			>
				{{ v.category }}
			</button>
		</menu>
		<div class="container">
			<figure
				v-for="v in categories.find((v) => v.category === current)?.assets ?? []"
				:key="v.id"
				draggable="true"
				@dragstart="dragger.assetOnDragStart(v)"
			>
				<img :src="v.cover" alt="" />
				<figcaption>{{ v.title }}</figcaption>
			</figure>
		</div>
	</div>
</template>

<style scoped lang="scss">
.asset {
	height: 100%;
	display: flex;
	overflow: hidden;
	menu {
		padding: 10px;
		display: flex;
		flex-direction: column;
		row-gap: 10px;
		background-color: #333;
		box-shadow: 0 0 3px 1px #666;
		z-index: 1;
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
		padding: 10px;
		background-color: #333;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		align-content: flex-start;
		figure {
			padding: 4px;
			background-color: #444;
			border-radius: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;
			row-gap: 10px;
			cursor: grab;
			transition: box-shadow 0.2s;
			img {
				width: 100%;
				height: 50px;
				object-fit: contain;
				background-color: #000;
				border-radius: 4px;
			}
			figcaption {
				flex-shrink: 0;
				line-height: 20px;
				font-size: 12px;
				text-align: center;
			}
			&:hover {
				box-shadow: 0 0 3px 1px var(--primary-color);
			}
		}
	}
}
</style>
