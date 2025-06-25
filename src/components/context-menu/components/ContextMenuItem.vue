<script lang="ts" setup>
import type { MenuItem } from "@/types/ContextMenu";

interface Props {
	menuItem: MenuItem;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<li v-if="props.menuItem.type !== 'divider' || props.menuItem.type === undefined" class="context-menu-item">
		<button :class="{ [props.menuItem.type || '']: true }" :disabled="props.menuItem.disabled" @click="props.menuItem.onClick?.()">{{ props.menuItem.label }}</button>
		<menu v-if="props.menuItem.list?.length">
			<slot></slot>
		</menu>
	</li>
	<hr v-else class="context-menu-item" />
</template>

<style lang="scss" scoped>
.context-menu-item {
	position: relative;
	button {
		padding: 0 14px;
		width: 100%;
		font-size: 12px;
		line-height: 30px;
		text-align: left;
		transition: background-color 0.2s;
		&.danger {
			color: var(--danger-color);
		}
		&:not(:disabled):hover {
			background-color: #232323;
		}
	}
	menu {
		position: absolute;
		left: 100%;
		top: 0;
		width: 200px;
		display: none;
		flex-direction: column;
		background-color: #333;
		border-radius: 4px;
		box-shadow: 0 0 3px 1px #666;
		z-index: 9;
	}
	&:hover {
		> menu {
			display: flex;
		}
	}
}
hr {
	width: 100%;
	border-color: #666;
}
</style>
