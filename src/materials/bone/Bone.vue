<script setup lang="ts">
import type { ComponentWithLayout } from "@/types/Component";
import type { BoneProps } from "./Bone";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/hooks/useDragger";

interface Props {
	component: ComponentWithLayout<BoneProps>;
}
const clientStore = useClient();
const schemaStore = useSchema();
const dragger = useDragger();
const props = withDefaults(defineProps<Props>(), {});
const remove = () => {
	const { parent, index } = schemaStore.findParent(props.component.id);
	if (parent) {
		parent.components.splice(index, 1);
	}
};
</script>

<template>
	<div
		v-if="!clientStore.previewing"
		:class="{ bone: true, dragging: dragger.dataTransfer.dragOverComponent?.id === props.component.id }"
		@dragover.prevent="dragger.boneDragOver(props.component)"
		@dragleave="dragger.boneDragLeave()"
	>
		<svg class="icon" @mousedown.stop="remove()"><use href="#circle-xmark" /></svg>
	</div>
</template>

<style lang="scss" scoped>
.bone {
	box-sizing: border-box;
	padding: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid var(--primary-color);
	&::after {
		content: "将组件拖入此处" !important;
		position: relative !important;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		border: 2px dashed var(--primary-color);
		opacity: 0.8;
		transition: opacity 0.2s;
		pointer-events: none;
	}
	&:hover {
		.icon {
			opacity: 1;
		}
	}
	&.dragging {
		padding: 10px;
		&::after {
			opacity: 1;
			backdrop-filter: blur(10px);
			background-color: #33333366;
		}
	}
	.icon {
		cursor: pointer;
		position: absolute;
		top: 20px;
		right: 20px;
		color: #cccccc;
		font-size: 24px;
		opacity: 0;
		transition: opacity 0.2s;
	}
}
</style>
