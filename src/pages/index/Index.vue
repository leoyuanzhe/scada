<script setup lang="ts">
import { useRouter } from "vue-router";
import MyButton from "@/components/my-button/MyButton.vue";

const router = useRouter();
</script>

<template>
	<div class="index">
		<MyButton class="button" variant="primary" @click="router.push('/editor')">编辑器</MyButton>
	</div>
</template>

<style scoped lang="scss">
.index {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	.button {
		width: auto;
	}
}
</style>
