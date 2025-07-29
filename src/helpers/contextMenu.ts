import type { MenuPosition } from "@/components/context-menu/types/ContextMenu";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useCommand } from "@/stores/useCommand";
import { useUndoStack } from "@/stores/useUndoStack";
import { useDragger } from "@/pages/editor/hooks/useDragger";
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
		{ type: "divider" },
		{
			label: "预览",
			remark: "Ctrl + P",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.preview();
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
			label: "显示标尺",
			remark: "Ctrl + R",
			list: [
				{
					label: "显示",
					disabled: clientStore.ruler.show,
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleRuler(true);
					},
				},
				{
					label: "隐藏",
					disabled: !clientStore.ruler.show,
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleRuler(false);
					},
				},
			],
		},
		{
			label: "启用网格",
			remark: "Ctrl + '",
			list: [
				{
					label: "启用",
					disabled: clientStore.grid.enable,
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleGrid(true);
					},
				},
				{
					label: "禁用",
					disabled: !clientStore.grid.enable,
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleGrid(false);
					},
				},
			],
		},
		{
			label: "启用参考线",
			remark: "Ctrl + ;",
			list: [
				{
					label: "启用",
					disabled: clientStore.snap.enable,
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleGuide(true);
					},
				},
				{
					label: "禁用",
					disabled: !clientStore.snap.enable,
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleGuide(false);
					},
				},
			],
		},
		{
			label: "启用吸附",
			remark: "Ctrl + Shift + ;",
			list: [
				{
					label: "启用",
					disabled: clientStore.snap.enable,
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleSnap(true);
					},
				},
				{
					label: "禁用",
					disabled: !clientStore.snap.enable,
					onClick: () => {
						const commandStore = useCommand();
						commandStore.toggleSnap(false);
					},
				},
			],
		},
	]);
};
// 打开编辑菜单
export const openEditMenu = (position: MenuPosition) => {
	const undoStackStore = useUndoStack();
	ContextMenu({ left: position.left, top: position.top }, [
		{
			label: "撤销",
			remark: "Ctrl + Z",
			disabled: undoStackStore.current === -1,
			onClick: () => {
				const commandStore = useCommand();
				commandStore.undo();
			},
		},
		{
			label: "重做",
			remark: "Ctrl + Y",
			disabled: undoStackStore.current === undoStackStore.stacks.length - 1,
			onClick: () => {
				const commandStore = useCommand();
				commandStore.redo();
			},
		},
	]);
};
// 打开组件菜单
export const openComponentMenu = (position: MenuPosition) => {
	const clientStore = useClient();
	const schemaStore = useSchema();
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
			disabled: !schemaStore.activedFlatedComponents.length,
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
			disabled: !schemaStore.activedFlatedComponents.length,
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
					onClick: () => {
						const commandStore = useCommand();
						commandStore.joinGroup(schemaStore.targetComponentId, v.id);
					},
				})),
		},
		{
			label: "移出分组",
			disabled: schemaStore.activedFlatedComponents.every((component) => {
				const { isRoot } = schemaStore.findParent(component.id);
				return isRoot;
			}),
			onClick: () => {
				const commandStore = useCommand();
				commandStore.moveOut();
			},
		},
		{
			label: "展开子组件到父组件",
			remark: "Ctrl + Shift + G",
			disabled: schemaStore.activedFlatedComponents.every((v) => !v.components.length),
			onClick: () => {
				const commandStore = useCommand();
				commandStore.flatChildrenToParent();
			},
		},
		{
			label: "展开子组件到根组件",
			disabled: schemaStore.activedFlatedComponents.every((v) => !v.components.length),
			onClick: () => {
				const schemaStore = useSchema();
				const dragger = useDragger();
				schemaStore.activedFlatedComponents.forEach((component) => {
					component.components.forEach((component) => (component.actived = true));
					schemaStore.flatChildrenToSchema(component.id);
				});
				dragger.computedSelector();
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
