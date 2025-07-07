import type { MenuPosition } from "@/components/context-menu/types/ContextMenu";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import ContextMenu from "@/components/context-menu";
import { useCommand } from "@/stores/useCommand";

// 打开文件菜单
export const openFileMenu = (position: MenuPosition) => {
	const schemaStore = useSchema();
	ContextMenu({ left: position.left, top: position.top }, [
		{
			label: "导出",
			onClick: () => {
				try {
					const json = JSON.stringify(schemaStore.$state);
					const blob = new Blob([json], { type: "application/json" });
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = schemaStore.title + ".json";
					a.click();
					URL.revokeObjectURL(url);
				} catch (error: any) {
					throw new Error(error);
				}
			},
		},
		{
			label: "导入",
			onClick: () => {
				const input = document.createElement("input");
				input.type = "file";
				input.accept = ".json";
				input.onchange = (e: any) => {
					const file = e.target.files[0];
					const reader = new FileReader();
					reader.onload = () => {
						try {
							const json = JSON.parse(reader.result as string);
							schemaStore.$state = json;
						} catch (error: any) {
							throw new Error(error);
						}
					};
					reader.readAsText(file);
				};
				input.click();
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
			list: [
				{
					label: "启用",
					disabled: clientStore.enabledOperate,
					onClick: () => {
						clientStore.enabledOperate = true;
					},
				},
				{
					label: "禁用",
					disabled: !clientStore.enabledOperate,
					onClick: () => {
						clientStore.enabledOperate = false;
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
	const dragger = useDragger();
	ContextMenu({ left: position.left, top: position.top }, [
		{
			label: "剪切",
			disabled: !schemaStore.activedFlatedComponents.length,
			remark: "Ctrl + x",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.cut();
			},
		},
		{
			label: "复制",
			disabled: !schemaStore.activedFlatedComponents.length,
			remark: "Ctrl + c",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.copy();
			},
		},
		{
			label: "粘贴",
			disabled: !clientStore.copiedComponents?.length,
			remark: "Ctrl + v",
			onClick: () => {
				const commandStore = useCommand();
				commandStore.paste();
			},
		},
		{ type: "divider" },
		{
			label: "锁定状态",
			disabled: schemaStore.activedFlatedComponents.every((v) => v.locked),
			remark: "Ctrl + l",
			list: [
				{
					label: "锁定",
					disabled: schemaStore.activedFlatedComponents.every((v) => v.locked),
					onClick: () => {
						const commandStore = useCommand();
						commandStore.lock(true);
					},
				},
				{
					label: "解锁",
					disabled: schemaStore.activedFlatedComponents.every((v) => !v.locked),
					onClick: () => {
						const commandStore = useCommand();
						commandStore.lock(false);
					},
				},
			],
		},
		{
			label: "隐藏状态",
			disabled: schemaStore.activedFlatedComponents.every((v) => v.hidden),
			remark: "Ctrl + h",
			list: [
				{
					label: "隐藏",
					disabled: schemaStore.activedFlatedComponents.every((v) => v.hidden),
					onClick: () => {
						const commandStore = useCommand();
						commandStore.hide(true);
					},
				},
				{
					label: "显示",
					disabled: schemaStore.activedFlatedComponents.every((v) => !v.hidden),
					onClick: () => {
						const commandStore = useCommand();
						commandStore.hide(false);
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
			onClick: () => {
				const container = schemaStore.createGroup(schemaStore.activedFlatedComponents.map((v) => v.id));
				schemaStore.activedFlatedComponents.forEach((v) => schemaStore.deactivateComponent(v));
				targetComponent.componentId.value = container.id;
				dragger.computedSelector();
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
			disabled: schemaStore.activedFlatedComponents.every((v) => !v.components.length),
			onClick: () => schemaStore.activedFlatedComponents.forEach((v) => schemaStore.flatChindrenToSchema(v.id)),
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
