<script lang="ts" setup>
import { useDragger } from "@/pages/editor/hooks/useDragger";

const dragger = useDragger();
</script>

<template>
	<div v-if="dragger.alignLine.v !== null" class="align-line-v" :style="{ left: dragger.getActualLeft(dragger.alignLine.v) + 'px' }"></div>
</template>

<style lang="scss" scoped>
.align-line-v {
	position: absolute;
	top: 0;
	width: 1px;
	height: 100%;
	background-color: #ff0000;
	transform: translateX(-50%);
	transition: left 0.2s;
}
</style>
