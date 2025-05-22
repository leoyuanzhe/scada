<script lang="ts" setup>
import { useDragger } from "@/pages/editor/hooks/useDragger";

const dragger = useDragger();
</script>

<template>
	<div
		v-show="dragger.selector.left || dragger.selector.top || dragger.selector.width || dragger.selector.height"
		class="selector"
		:style="{
			left: dragger.selector.left + 'px',
			top: dragger.selector.top + 'px',
			width: dragger.selector.width + 'px',
			height: dragger.selector.height + 'px',
		}"
	>
		<div class="t"></div>
		<div class="tr"></div>
		<div class="r"></div>
		<div class="rb"></div>
		<div class="b"></div>
		<div class="lb"></div>
		<div class="l"></div>
		<div class="lt"></div>
	</div>
</template>

<style lang="scss" scoped>
.selector {
	position: absolute;
	z-index: 9;
	box-shadow: 0 0 1px 1px #ff0000;
	background-color: #23232333;
	pointer-events: none;
	div {
		position: absolute;
		width: 9px;
		height: 9px;
		background-color: #ff0000;
		pointer-events: auto;
		&.t {
			top: 0;
			left: 50%;
			transform: translate(-50%, -50%);
			cursor: n-resize;
		}
		&.tr {
			top: 0;
			right: 0;
			transform: translate(50%, -50%);
			cursor: ne-resize;
		}
		&.r {
			top: 50%;
			right: 0;
			transform: translate(50%, -50%);
			cursor: e-resize;
		}
		&.rb {
			bottom: 0;
			right: 0;
			transform: translate(50%, 50%);
			cursor: se-resize;
		}
		&.b {
			bottom: 0;
			left: 50%;
			transform: translate(-50%, 50%);
			cursor: s-resize;
		}
		&.lb {
			bottom: 0;
			left: 0;
			transform: translate(-50%, 50%);
			cursor: sw-resize;
		}
		&.l {
			top: 50%;
			left: 0;
			transform: translate(-50%, -50%);
			cursor: w-resize;
		}
		&.lt {
			top: 0;
			left: 0;
			transform: translate(-50%, -50%);
			cursor: nw-resize;
		}
	}
}
</style>
