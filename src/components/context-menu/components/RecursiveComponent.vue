<script setup lang="ts">
import type { MenuItem } from "@/types/ContextMenu";
import ContextMenuItem from "./ContextMenuItem.vue";

interface Props {
	menuItem: MenuItem;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<ContextMenuItem :menu-item="props.menuItem">
		<RecursiveComponent v-for="(v, i) in props.menuItem.list" :key="i" :menu-item="v" />
	</ContextMenuItem>
</template>
