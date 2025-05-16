<script setup lang="ts">
import { useProperty } from "@/stores/useProperty";
import { useDragger } from "../../hooks/useDragger";

const propertyStore = useProperty();
const dragger = useDragger();
</script>

<template>
	<div class="property">
		<figure v-for="v in propertyStore.properties" :key="v.id" draggable="true" @dragstart="dragger.propertyDragstart($event, v.id)">
			<img :src="v.cover" alt="" />
			<figcaption>{{ v.title }}</figcaption>
		</figure>
	</div>
</template>

<style scoped lang="scss">
.property {
	padding: 10px;
	background-color: #333;
	display: flex;
	flex-direction: column;
	figure {
		display: flex;
		height: 100px;
		background-color: #444;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		cursor: pointer;
		transition: box-shadow 0.2s;
		&:hover {
			box-shadow: 0 0 3px 1px var(--primary-color);
		}
	}
}
</style>
