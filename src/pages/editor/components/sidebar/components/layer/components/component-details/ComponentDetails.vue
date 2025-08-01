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
			actived: props.component.actived,
			target: props.component.id === schemaStore.targetComponentId,
			before: props.component.id === dragger.layer.dragOverComponent?.id && dragger.layer.position === 'before',
			after: props.component.id === dragger.layer.dragOverComponent?.id && dragger.layer.position === 'after',
		}"
		open
		draggable="true"
		@focusin.stop
		@mousedown.stop="dragger.focusComponent($event, props.component, router)"
		@dragstart.stop="dragger.layerOnDragStart(props.component)"
		@dragover.prevent="dragger.layerOnDragOver($event, component)"
		@drop.stop="dragger.layerOnDrop()"
		@contextmenu.prevent.stop="openComponentMenu(computedMousePosition($event))"
	>
		<summary :class="{ 'not-nestable': !props.component.nestable }" @dragover.prevent>
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
	margin-bottom: 10px;
	&::before {
		content: "";
		position: absolute;
		top: -10px;
		left: 0;
		width: 100%;
		height: 10px;
		background-color: transparent;
	}
	&::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: -10px;
		width: 100%;
		height: 10px;
		background-color: transparent;
	}
	&.before {
		&::before {
			background-color: #ff0000;
		}
	}
	&.after {
		&::after {
			background-color: #ff0000;
		}
	}
	summary {
		margin-bottom: 10px;
		padding: 0 10px;
		line-height: 30px;
		background-color: #444;
		border-radius: 4px;
		transition: box-shadow 0.2s;
		cursor: pointer;
		&:last-child {
			margin-bottom: 0;
		}
		&.not-nestable {
			padding-left: 1.5em;
			&::marker {
				content: "";
			}
		}
		&:hover {
			box-shadow: 0 0 3px 1px var(--primary-color);
		}
	}
	&:not([open]) {
		summary {
			margin-bottom: 0;
		}
	}
	&:last-child {
		margin-bottom: 0;
	}
	&.actived {
		box-shadow: 0 0 1px 1px #ff0000cc;
	}
	&.target {
		box-shadow: 0 0 3px 1px #ff0000;
	}
	details {
		margin-left: 10px;
	}
}
</style>
