<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef, watch } from "vue";
import type { Component } from "@/types/Component";
import type { DialogProps, DialogEmitKey } from "./Dialog";
import { initComponent, triggerEmit } from "@/helpers/schema";
import MyDialog from "@/components/my-dialog/MyDialog.vue";
import ComponentCreator from "@/components/component-creator/ComponentCreator.vue";
import { useClient } from "@/stores/useClient";

interface Props {
	component: Component<DialogProps, DialogEmitKey>;
}
const clientStore = useClient();
const props = withDefaults(defineProps<Props>(), {});
const oDialog = useTemplateRef("oDialog");
const payload = {};
initComponent(props.component);
onMounted(() => triggerEmit(props.component.emits.mounted, props.component, payload));
onBeforeUnmount(() => triggerEmit(props.component.emits.beforeUnmount, props.component, payload));
watch(
	() => props.component.props.show,
	() => {
		if (props.component.props.show) {
			oDialog.value?.showModal();
		} else {
			oDialog.value?.close();
		}
	},
	{ immediate: true }
);
</script>

<template>
	<MyDialog ref="oDialog" class="dialog" @close="props.component.props.show = false">
		<div v-if="!clientStore.previewing" class="close-icon">
			<svg class="icon" @mousedown.stop="props.component.props.show = false">
				<use href="#circle-xmark" />
			</svg>
			<span>（仅编辑模式可见）</span>
		</div>
		<ComponentCreator v-for="v in props.component.components" :key="v.id" :component="v" relative />
	</MyDialog>
</template>

<style lang="scss" scoped>
.dialog {
	.close-icon {
		position: fixed;
		top: 30px;
		right: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 10px;
		.icon {
			color: #fff;
			font-size: 20px;
			cursor: pointer;
		}
		span {
			color: #ccc;
			font-size: 12px;
		}
	}
}
</style>
