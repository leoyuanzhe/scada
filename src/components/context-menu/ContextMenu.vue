<script lang="ts" setup>
import { useTemplateRef } from "vue";
import type { MenuPosition, MenuItem } from "./types/ContextMenu";
import ContextMenuItem from "./components/RecursiveComponent.vue";

interface Props {
	position: MenuPosition;
	menuItems: MenuItem[];
}
interface Emits {
	(e: "toggle", event: ToggleEvent): void;
}
const props = withDefaults(defineProps<Props>(), {});
const emits = defineEmits<Emits>();
const oContextMenu = useTemplateRef("oContextMenu");
defineExpose({
	showPopover: () => oContextMenu.value?.showPopover(),
	hidePopover: () => oContextMenu.value?.hidePopover(),
	togglePopover: (focus?: boolean) => oContextMenu.value?.togglePopover(focus),
});
</script>

<template>
	<menu ref="oContextMenu" id="context-menu" class="context-menu" popover="auto" :style="{ left: props.position.left + 'px', top: props.position.top + 'px' }" @click="oContextMenu?.hidePopover()" @toggle="emits('toggle', $event)">
		<ContextMenuItem v-for="(v, i) in props.menuItems" :key="i" :menu-item="v" />
	</menu>
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
