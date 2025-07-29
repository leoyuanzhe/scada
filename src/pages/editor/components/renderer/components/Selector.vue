<script lang="ts" setup>
import { computed } from "vue";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/pages/editor/hooks/useDragger";

const clientStore = useClient();
const schemaStore = useSchema();
const dragger = useDragger();
const showDirection = computed(
	() =>
		schemaStore.activedFlatedComponents.length === 1 &&
		schemaStore.targetComponent?.resizable &&
		schemaStore.isRoot(schemaStore.findParent(schemaStore.targetComponent.id).parent?.id ?? "")
);
</script>

<template>
	<div
		v-if="!clientStore.previewing"
		v-show="dragger.selector.left || dragger.selector.top || dragger.selector.width || dragger.selector.height"
		class="selector"
		:style="{
			left: dragger.selector.left + 'px',
			top: dragger.selector.top + 'px',
			width: dragger.selector.width + 'px',
			height: dragger.selector.height + 'px',
		}"
	>
		<div v-show="showDirection" class="t" @mousedown.stop="dragger.selectorDirectionOnMouseDown($event, 't')"></div>
		<div
			v-show="showDirection"
			class="tr"
			@mousedown.stop="dragger.selectorDirectionOnMouseDown($event, 'tr')"
		></div>
		<div v-show="showDirection" class="r" @mousedown.stop="dragger.selectorDirectionOnMouseDown($event, 'r')"></div>
		<div
			v-show="showDirection"
			class="rb"
			@mousedown.stop="dragger.selectorDirectionOnMouseDown($event, 'rb')"
		></div>
		<div v-show="showDirection" class="b" @mousedown.stop="dragger.selectorDirectionOnMouseDown($event, 'b')"></div>
		<div
			v-show="showDirection"
			class="lb"
			@mousedown.stop="dragger.selectorDirectionOnMouseDown($event, 'lb')"
		></div>
		<div v-show="showDirection" class="l" @mousedown.stop="dragger.selectorDirectionOnMouseDown($event, 'l')"></div>
		<div
			v-show="showDirection"
			class="lt"
			@mousedown.stop="dragger.selectorDirectionOnMouseDown($event, 'lt')"
		></div>
	</div>
</template>

<style lang="scss" scoped>
.selector {
	position: absolute;
	z-index: 9;
	box-shadow: 0 0 1px 1px #ff0000;
	background-color: #ff000022;
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
