<script lang="ts" setup>
import { useClient } from "@/stores/useClient";
import { useDragger } from "@/hooks/useDragger";

const clientStore = useClient();
const dragger = useDragger();
</script>

<template>
	<div
		v-if="dragger.snapLine.h !== null && !clientStore.previewing"
		class="snap-line-h"
		:style="{ top: dragger.getActualTop(dragger.snapLine.h) + 'px' }"
	></div>
	<div
		v-if="dragger.snapLine.v !== null && !clientStore.previewing"
		class="snap-line-v"
		:style="{ left: dragger.getActualLeft(dragger.snapLine.v) + 'px' }"
	></div>
</template>

<style lang="scss" scoped>
.snap-line-h {
	position: absolute;
	left: 0;
	width: 100%;
	height: 1px;
	background-color: #ff0000;
	transform: translateY(-50%);
	transition: top 0.2s;
}
.snap-line-v {
	position: absolute;
	top: 0;
	width: 1px;
	height: 100%;
	background-color: #ff0000;
	transform: translateX(-50%);
	transition: left 0.2s;
}
</style>
