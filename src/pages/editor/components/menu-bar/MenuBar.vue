<script setup lang="ts">
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "../../hooks/useDragger";
import { computed } from "vue";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { useContextMenu } from "@/hooks/useContextMenu";
import type { MenuItem } from "@/types/ContextMenu";

const schemaStore = useSchema();
const targetComponent = useTargetComponent();
const dragger = useDragger();
const contextMenu = useContextMenu();
const moveOutDisabled = computed(() => {
	return schemaStore.activeFlatComponents.every((component) => {
		const parent = schemaStore.findParent(component.id);
		return parent && schemaStore.isSchema(parent);
	});
});
const openEditMenu = (e: MouseEvent) => {
	contextMenu.list.length = 0;
	contextMenu.list.push(
		...([
			{
				label: "锁定",
				disabled: schemaStore.activeFlatComponents.every((v) => v.locked),
				onClick: () => {
					schemaStore.activeFlatComponents.forEach((v) => {
						v.locked = true;
						v.active = false;
					});
					targetComponent.componentId.value = "";
					dragger.computedSelector();
				},
			},
			{
				label: "解锁",
				disabled: schemaStore.activeFlatComponents.every((v) => !v.locked),
				onClick: () => schemaStore.activeFlatComponents.forEach((v) => (v.locked = false)),
			},
			{
				label: "显示",
				disabled: schemaStore.activeFlatComponents.every((v) => !v.hidden),
				onClick: () => schemaStore.activeFlatComponents.forEach((v) => (v.hidden = false)),
			},
			{
				label: "隐藏",
				disabled: schemaStore.activeFlatComponents.every((v) => v.hidden),
				onClick: () => {
					schemaStore.activeFlatComponents.forEach((v) => {
						v.hidden = true;
						v.active = false;
					});
					targetComponent.componentId.value = "";
					dragger.computedSelector();
				},
			},
			{
				type: "danger",
				label: "删除",
				onClick: () => {
					schemaStore.activeFlatComponents.forEach((v) => schemaStore.removeComponent(v.id));
					dragger.computedSelector();
				},
			},
			{ type: "divider" },
			{
				label: "加入分组",
				list: schemaStore.flatComponents
					.filter((v) => v.nestable)
					.map((v) => ({
						label: v.title,
						onClick: () => schemaStore.joinGroup(targetComponent.componentId.value, v.id),
					})),
			},
			{
				label: "移出分组",
				disabled: moveOutDisabled.value,
				onClick: () => schemaStore.activeFlatComponents.forEach((v) => schemaStore.moveOut(v.id)),
			},
			{
				label: "展开子组件到根组件",
				disabled: schemaStore.activeFlatComponents.every((v) => !v.components.length),
				onClick: () => schemaStore.activeFlatComponents.forEach((v) => schemaStore.flatChindrenToSchema(v.id)),
			},
		] as MenuItem[])
	);
	computedContextMenuPosition(e);
};
function computedContextMenuPosition(e: MouseEvent) {
	const rect = (e.target as HTMLButtonElement).getBoundingClientRect();
	contextMenu.position.left = rect.left;
	contextMenu.position.top = rect.top + rect.height;
}
</script>

<template>
	<div class="menu-bar">
		<div class="logo">L</div>
		<menu class="menu">
			<button v-if="schemaStore.activeFlatComponents.length" popovertarget="context-menu" @click="openEditMenu($event)">编辑</button>
		</menu>
	</div>
</template>

<style scoped lang="scss">
.menu-bar {
	padding: 0 10px;
	background-color: #333;
	display: flex;
	align-items: center;
	.logo {
		margin-right: 10px;
		width: 26px;
		height: 26px;
		font-size: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #000;
		border-radius: 50%;
	}
	.menu {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: flex-start;
		button {
			padding: 0 14px;
			font-size: 12px;
			line-height: 40px;
			transition: background-color 0.2s;
			&:hover {
				background-color: #232323;
			}
		}
	}
}
</style>
