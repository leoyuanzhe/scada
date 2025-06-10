<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
	<div class="index">
		<button @click="router.push('/editor')">编辑器</button>
	</div>
</template>

<style scoped lang="scss">
.index {
	.icon {
		color: #fff;
	}
}
</style>
