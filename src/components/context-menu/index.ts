import { h, nextTick, render } from "vue";
import type { MenuPosition, MenuItem } from "./types/ContextMenu";
import ContextMenu from "./ContextMenu.vue";

export default (position: MenuPosition, menuItems: MenuItem[]) => {
	const vNode = h(ContextMenu, {
		position,
		menuItems,
		onToggle: (e: ToggleEvent) => {
			if (e.newState === "closed") {
				render(null, document.body);
			}
		},
	});
	render(vNode, document.body);
	nextTick(() => vNode.component!.exposed!.showPopover());
};
