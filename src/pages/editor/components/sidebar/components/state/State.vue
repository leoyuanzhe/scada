<script setup lang="ts">
import { useAsset } from "@/stores/useAsset";
import { useDragger } from "@/pages/editor/hooks/useDragger";

const assetStore = useAsset();
const dragger = useDragger();
</script>

<template>
	<div class="state">
		<textarea></textarea>
	</div>
</template>

<style scoped lang="scss">
.state {
	box-sizing: border-box;
	padding: 10px;
	height: 100%;
	background-color: #333;
	display: flex;
	flex-direction: column;
	textarea {
		flex: 1;
		padding: 10px;
		background-color: #232323;
		border-radius: 10px;
	}
}
</style>
