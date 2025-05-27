<script lang="ts" setup>
import { useDragger } from "@/pages/editor/hooks/useDragger";

const dragger = useDragger();
</script>

<template>
	<div v-if="dragger.alignLine.h !== null" class="align-line-h" :style="{ top: dragger.getActualTop(dragger.alignLine.h) + 'px' }"></div>
</template>

<style lang="scss" scoped>
.align-line-h {
	position: absolute;
	left: 0;
	width: 100%;
	height: 1px;
	background-color: #ff0000;
	transform: translateY(-50%);
	transition: top 0.2s;
}
</style>
