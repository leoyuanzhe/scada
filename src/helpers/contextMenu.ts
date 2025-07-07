import type { MenuPosition } from "@/components/context-menu/types/ContextMenu";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useCommand } from "@/stores/useCommand";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import ContextMenu from "@/components/context-menu";

// 打开文件菜单
export const openFileMenu = (position: MenuPosition) => {
	ContextMenu({ left: position.left, top: position.top }, [
		{
			label: "导出",
			remark: "Ctrl + Shift + S",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.export();
			},
		},
		{
			label: "导入",
			remark: "Ctrl + I",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.import();
			},
		},
	]);
};
// 打开设置菜单
export const openSettingMenu = (position: MenuPosition) => {
	const clientStore = useClient();
	ContextMenu({ left: position.left, top: position.top }, [
		{
			label: "启用操作",
			remark: "Ctrl + O",
			list: [
				{
					label: "启用",
					disabled: clientStore.enabledOperate,
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleOperate(true);
					},
				},
				{
					label: "禁用",
					disabled: !clientStore.enabledOperate,
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleOperate(false);
					},
				},
			],
		},
		{
			label: "启用网格",
			list: [
				{
					label: "启用",
					disabled: clientStore.grid.enable,
					onClick: () => {
						clientStore.grid.enable = true;
					},
				},
				{
					label: "禁用",
					disabled: !clientStore.grid.enable,
					onClick: () => {
						clientStore.grid.enable = false;
					},
				},
			],
		},
		{
			label: "启用吸附",
			list: [
				{
					label: "启用",
					disabled: clientStore.snap.enable,
					onClick: () => {
						clientStore.snap.enable = true;
					},
				},
				{
					label: "禁用",
					disabled: !clientStore.snap.enable,
					onClick: () => {
						clientStore.snap.enable = false;
					},
				},
			],
		},
	]);
};
// 打开组件菜单
export const openComponentMenu = (position: MenuPosition) => {
	const clientStore = useClient();
	const schemaStore = useSchema();
	const targetComponent = useTargetComponent();
	ContextMenu({ left: position.left, top: position.top }, [
		{
			label: "剪切",
			disabled: !schemaStore.activedFlatedComponents.length,
			remark: "Ctrl + X",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.cut();
			},
		},
		{
			label: "复制",
			disabled: !schemaStore.activedFlatedComponents.length,
			remark: "Ctrl + C",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.copy();
			},
		},
		{
			label: "粘贴",
			disabled: !clientStore.copiedComponents?.length,
			remark: "Ctrl + V",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.paste();
			},
		},
		{ type: "divider" },
		{
			label: "锁定状态",
			disabled: schemaStore.activedFlatedComponents.every((v) => v.locked),
			remark: "Ctrl + L",
			list: [
				{
					label: "锁定",
					disabled: schemaStore.activedFlatedComponents.every((v) => v.locked),
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleLocked(true);
					},
				},
				{
					label: "解锁",
					disabled: schemaStore.activedFlatedComponents.every((v) => !v.locked),
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleLocked(false);
					},
				},
			],
		},
		{
			label: "隐藏状态",
			disabled: schemaStore.activedFlatedComponents.every((v) => v.hidden),
			remark: "Ctrl + H",
			list: [
				{
					label: "隐藏",
					disabled: schemaStore.activedFlatedComponents.every((v) => v.hidden),
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleHidden(true);
					},
				},
				{
					label: "显示",
					disabled: schemaStore.activedFlatedComponents.every((v) => !v.hidden),
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleHidden(false);
					},
				},
			],
		},
		{
			type: "danger",
			label: "删除",
			disabled: !schemaStore.activedFlatedComponents.length,
			remark: "Delete",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.delete();
			},
		},
		{ type: "divider" },
		{
			label: "创建分组",
			disabled: !schemaStore.activedFlatedComponents.length,
			remark: "Ctrl + G",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.createGroup();
			},
		},
		{
			label: "加入分组",
			disabled: !schemaStore.activedFlatedComponents.length,
			list: schemaStore.flatedComponents
				.filter((v) => v.nestable)
				.map((v) => ({
					label: v.title,
					onClick: () => schemaStore.joinGroup(targetComponent.componentId.value, v.id),
				})),
		},
		{
			label: "移出分组",
			disabled: schemaStore.activedFlatedComponents.every((component) => {
				const parent = schemaStore.findParent(component.id);
				return parent && schemaStore.isSchema(parent);
			}),
			onClick: () => schemaStore.activedFlatedComponents.forEach((v) => schemaStore.moveOut(v.id)),
		},
		{
			label: "展开子组件到根组件",
			remark: "Ctrl + Shift + G",
			disabled: schemaStore.activedFlatedComponents.every((v) => !v.components.length),
			onClick: () => {
				const commandStore = useCommand();
				commandStore.flatChildrenToSchema();
			},
		},
	]);
};
export const computedMousePosition = (e: MouseEvent) => {
	return { left: e.clientX, top: e.clientY };
};
export const computedTargetPosition = (e: MouseEvent) => {
	const rect = (e.target as HTMLButtonElement).getBoundingClientRect();
	return { left: rect.left, top: rect.top + rect.height };
};
