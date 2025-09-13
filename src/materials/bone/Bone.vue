<script setup lang="ts">
import type { ComponentWithLayout } from "@/types/Component";
import type { BoneProps } from "./Bone";
import { useClient } from "@/stores/useClient";

interface Props {
	component: ComponentWithLayout<BoneProps>;
}
const clientStore = useClient();
withDefaults(defineProps<Props>(), {});
</script>

<template>
	<div v-if="!clientStore.previewing" class="bone"></div>
</template>

<style lang="scss" scoped>
.bone {
	&::after {
		content: "将组件拖入此处";
		box-sizing: border-box;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		border: 2px dashed var(--primary-color);
	}
}
</style>
