import type { MenuPosition } from "@/components/context-menu/types/ContextMenu";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { useTargetComponent } from "@/hooks/useTargetComponent";
import { useDragger } from "@/pages/editor/hooks/useDragger";
import ContextMenu from "@/components/context-menu";

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
			label: "网格",
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
			label: "吸附",
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
			disabled: !schemaStore.activedFlatComponents.length,
			onClick: () => {
				clientStore.cutComponents(schemaStore.activedFlatComponents);
			},
		},
		{
			label: "复制",
			disabled: !schemaStore.activedFlatComponents.length,
			onClick: () => {
				clientStore.copyComponents(schemaStore.activedFlatComponents);
			},
		},
		{
			label: "粘贴",
			disabled: !clientStore.copiedComponents?.length,
			onClick: () => {
				clientStore.pasteComponents();
			},
		},
		{ type: "divider" },
		{
			label: "锁定状态",
			disabled: schemaStore.activedFlatComponents.every((v) => v.locked),
			list: [
				{
					label: "锁定",
					disabled: schemaStore.activedFlatComponents.every((v) => v.locked),
					onClick: () => {
						schemaStore.activedFlatComponents.forEach((v) => schemaStore.lockComponent(v));
						targetComponent.componentId.value = "";
						dragger.computedSelector();
					},
				},
				{
					label: "解锁",
					disabled: schemaStore.activedFlatComponents.every((v) => !v.locked),
					onClick: () => {
						schemaStore.activedFlatComponents.forEach((v) => schemaStore.unlockComponent(v));
					},
				},
			],
		},
		{
			label: "隐藏状态",
			disabled: schemaStore.activedFlatComponents.every((v) => v.hidden),
			list: [
				{
					label: "显示",
					disabled: schemaStore.activedFlatComponents.every((v) => !v.hidden),
					onClick: () => {
						schemaStore.activedFlatComponents.forEach((v) => schemaStore.showComponent(v));
					},
				},
				{
					label: "隐藏",
					disabled: schemaStore.activedFlatComponents.every((v) => v.hidden),
					onClick: () => {
						schemaStore.activedFlatComponents.forEach((v) => schemaStore.hideComponent(v));
						targetComponent.componentId.value = "";
						dragger.computedSelector();
					},
				},
			],
		},
		{
			type: "danger",
			label: "删除",
			disabled: !schemaStore.activedFlatComponents.length,
			onClick: () => {
				schemaStore.activedFlatComponents.forEach((v) => schemaStore.deleteComponent(v));
				dragger.computedSelector();
			},
		},
		{ type: "divider" },
		{
			label: "创建分组",
			disabled: !schemaStore.activedFlatComponents.length,
			onClick: () => {
				const container = schemaStore.createGroup(schemaStore.activedFlatComponents.map((v) => v.id));
				schemaStore.activedFlatComponents.forEach((v) => schemaStore.deactivateComponent(v));
				targetComponent.componentId.value = container.id;
				dragger.computedSelector();
			},
		},
		{
			label: "加入分组",
			disabled: !schemaStore.activedFlatComponents.length,
			list: schemaStore.flatComponents
				.filter((v) => v.nestable)
				.map((v) => ({
					label: v.title,
					onClick: () => schemaStore.joinGroup(targetComponent.componentId.value, v.id),
				})),
		},
		{
			label: "移出分组",
			disabled: schemaStore.activedFlatComponents.every((component) => {
				const parent = schemaStore.findParent(component.id);
				return parent && schemaStore.isSchema(parent);
			}),
			onClick: () => schemaStore.activedFlatComponents.forEach((v) => schemaStore.moveOut(v.id)),
		},
		{
			label: "展开子组件到根组件",
			disabled: schemaStore.activedFlatComponents.every((v) => !v.components.length),
			onClick: () => schemaStore.activedFlatComponents.forEach((v) => schemaStore.flatChindrenToSchema(v.id)),
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
