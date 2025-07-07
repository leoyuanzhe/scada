<script lang="ts" setup>
import { useDragger } from "@/pages/editor/hooks/useDragger";

const dragger = useDragger();
</script>

<template>
	<div
		v-if="dragger.snappedLine.h !== null"
		class="snapped-line-h"
		:style="{ top: dragger.getActualTop(dragger.snappedLine.h) + 'px' }"
	></div>
	<div
		v-if="dragger.snappedLine.v !== null"
		class="snapped-line-v"
		:style="{ left: dragger.getActualLeft(dragger.snappedLine.v) + 'px' }"
	></div>
</template>

<style lang="scss" scoped>
.snapped-line-h {
	position: absolute;
	left: 0;
	width: 100%;
	height: 1px;
	background-color: #ff0000;
	transform: translateY(-50%);
	transition: top 0.2s;
}
.snapped-line-v {
	position: absolute;
	top: 0;
	width: 1px;
	height: 100%;
	background-color: #ff0000;
	transform: translateX(-50%);
	transition: left 0.2s;
}
</style>
