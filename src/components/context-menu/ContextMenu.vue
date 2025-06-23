<script lang="ts" setup>
import { useContextMenu } from "@/hooks/useContextMenu";
import ContextMenuItem from "./components/RecursiveComponent.vue";

const contextMenu = useContextMenu();
</script>

<template>
	<Teleport to="body">
		<menu id="context-menu" class="context-menu" popover="auto" :style="{ left: contextMenu.position.left + 'px', top: contextMenu.position.top + 'px' }">
			<ContextMenuItem v-for="(v, i) in contextMenu.list" :key="i" :menu-item="v" />
		</menu>
	</Teleport>
</template>

<style lang="scss" scoped>
.context-menu {
	position: fixed;
	width: 200px;
	background-color: #333;
	border-radius: 4px;
	box-shadow: 0 0 3px 1px #666;
	z-index: 9;
}
</style>
