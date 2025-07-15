<script setup lang="ts">
import { useClient } from "@/stores/useClient";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import type { Component } from "@/types/Component";

interface Props {
	component: Component;
}
const clientStore = useClient();
const dragger = useDragger();
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<details
		:class="{
			'component-details': true,
			actived: props.component.actived,
			target: props.component.id === clientStore.targetComponent?.id,
		}"
		draggable="true"
	>
		<summary
			:class="{ empty: !props.component.components.length }"
			contenteditable
			@mousedown.stop="dragger.componentOnMouseDown($event, props.component)"
			@input="props.component.title = ($event.target as HTMLElement).innerText"
		>
			{{ props.component.title }}
		</summary>
		<slot></slot>
	</details>
</template>

<style scoped lang="scss">
.component-details {
	display: flex;
	flex-direction: column;
	margin-bottom: 10px;
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
		&.empty {
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
