<script setup lang="ts">
import { useDragger } from "@/pages/editor/hooks/useDragger";
import type { Component } from "@/types/Component";

interface Props {
	component: Component;
}
const dragger = useDragger();
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<details class="component-details">
		<summary :class="{ empty: !props.component.components.length }" @mousedown.stop="dragger.componentMousedown($event, props.component)">{{ props.component.title }}</summary>
		<slot></slot>
	</details>
</template>

<style scoped lang="scss">
.component-details {
	padding-left: 10px;
	display: flex;
	flex-direction: column;
	row-gap: 10px;
	summary {
		padding: 0 10px;
		line-height: 30px;
		background-color: #444;
		border-radius: 4px;
		transition: box-shadow 0.2s;
		cursor: pointer;
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
}
</style>
