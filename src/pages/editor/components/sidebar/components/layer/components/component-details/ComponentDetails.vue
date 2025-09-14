<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/hooks/useDragger";
import type { Component } from "@/types/Component";
import { computedMousePosition, openComponentMenu } from "@/helpers/contextMenu";

interface Props {
	component: Component;
}
const router = useRouter();
const schemaStore = useSchema();
const dragger = useDragger();
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<details
		:class="{
			'component-details': true,
			disabled: !props.component.selectable,
			actived: props.component.actived,
			target: props.component.id === schemaStore.targetComponentId,
			before:
				props.component.id === dragger.dataTransfer.dragOverComponent?.id &&
				dragger.dataTransfer.layerPosition === 'before',
			after:
				props.component.id === dragger.dataTransfer.dragOverComponent?.id &&
				dragger.dataTransfer.layerPosition === 'after',
		}"
		open
	>
		<summary
			:class="{
				'hide-marker': !props.component.nestable || props.component.autoReplace,
			}"
			draggable="true"
			@focusin.stop
			@mousedown.stop="dragger.layerOnMouseDown($event, props.component, router)"
			@dragstart.stop="dragger.layerOnDragStart(props.component)"
			@dragover.prevent="dragger.layerOnDragOver($event, component)"
			@dragleave.stop="dragger.layerOnDragLeave(component)"
			@drop.stop="dragger.layerOnDrop()"
			@contextmenu.prevent.stop="openComponentMenu(computedMousePosition($event))"
		>
			{{ props.component.title }}
		</summary>
		<slot></slot>
	</details>
</template>

<style scoped lang="scss">
.component-details {
	position: relative;
	display: flex;
	flex-direction: column;
	transition: background-color 0.2s, box-shadow 0.2s;
	&::before {
		content: "";
		position: absolute;
		top: -5px;
		left: 0;
		width: 100%;
		height: 5px;
		transition: background-color 0.2s;
		background-color: transparent;
	}
	&::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: -5px;
		width: 100%;
		height: 5px;
		background-color: transparent;
		transition: background-color 0.2s;
	}
	summary {
		padding: 0 10px;
		font-size: 14px;
		line-height: 26px;
		cursor: pointer;
		&.hide-marker {
			padding-left: 1.5em;
			&::marker {
				content: "";
			}
		}
	}
	&.before {
		&::before {
			background-color: var(--lightest-primary-color);
		}
	}
	&.after {
		&::after {
			background-color: var(--lightest-primary-color);
		}
	}
	&.disabled {
		color: #999;
	}
	&:not(&.before).actived {
		background-color: var(--darktest-primary-color);
	}
	&.target {
		box-shadow: 0 0 3px 1px var(--lightest-primary-color) inset;
	}
	details {
		margin-left: 10px;
	}
}
</style>
