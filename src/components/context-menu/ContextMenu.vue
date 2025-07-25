<script lang="ts" setup>
import { computed, useTemplateRef } from "vue";
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
const adjustPosition = computed(() => {
	let left = props.position.left;
	let top = props.position.top;
	if (oContextMenu.value) {
		if (props.position.left + oContextMenu.value.offsetWidth > innerWidth) {
			left = innerWidth - oContextMenu.value.offsetWidth;
		}
		if (props.position.top + oContextMenu.value.offsetHeight > innerHeight) {
			top = innerHeight - oContextMenu.value.offsetHeight;
		}
	}
	return { left, top };
});
const onToggle = (e: ToggleEvent) => {
	emits("toggle", e);
};
defineExpose({
	showPopover: () => oContextMenu.value?.showPopover(),
	hidePopover: () => oContextMenu.value?.hidePopover(),
	togglePopover: (focus?: boolean) => oContextMenu.value?.togglePopover(focus),
});
</script>

<template>
	<menu
		ref="oContextMenu"
		id="context-menu"
		class="context-menu"
		popover="auto"
		:data-top="props.position.top"
		:style="{ left: adjustPosition.left + 'px', top: adjustPosition.top + 'px' }"
		@click="oContextMenu?.hidePopover()"
		@toggle="onToggle($event)"
	>
		<ContextMenuItem v-for="(v, i) in props.menuItems" :key="i" :menu-item="v" />
	</menu>
</template>

<style lang="scss" scoped>
.context-menu {
	position: fixed;
	width: 260px;
	background-color: #333;
	border-radius: 4px;
	box-shadow: 0 0 3px 1px #666;
	z-index: 9;
}
</style>
