<script setup lang="ts">
import { useMaterial } from "@/stores/useMaterial";

const materialStore = useMaterial();
</script>

<template>
	<div class="property">
		<figure v-for="v in materialStore.materials" :key="v.id">
			<img :src="v.cover" alt="" />
			<figcaption>{{ v.title }}</figcaption>
		</figure>
	</div>
</template>

<style scoped lang="scss">
.property {
	background-color: #333;
}
</style>
