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
			label: "触发操作",
			list: [
				{
					label: "启用",
					disabled: clientStore.operate.enable,
					onClick: () => {
						clientStore.operate.enable = true;
					},
				},
				{
					label: "禁用",
					disabled: !clientStore.operate.enable,
					onClick: () => {
						clientStore.operate.enable = false;
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
			label: "复制",
			disabled: !schemaStore.activeFlatComponents.length,
			onClick: () => {},
		},
		{
			label: "粘贴",
			disabled: !clientStore.clipboard.component,
			onClick: () => {},
		},
		{ type: "divider" },
		{
			label: "锁定状态",
			disabled: schemaStore.activeFlatComponents.every((v) => v.locked),
			list: [
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
			],
		},
		{
			label: "隐藏状态",
			disabled: schemaStore.activeFlatComponents.every((v) => v.hidden),
			list: [
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
			],
		},
		{
			type: "danger",
			label: "删除",
			disabled: !schemaStore.activeFlatComponents.length,
			onClick: () => {
				schemaStore.activeFlatComponents.forEach((v) => schemaStore.removeComponent(v.id));
				dragger.computedSelector();
			},
		},
		{ type: "divider" },
		{
			label: "创建分组",
			disabled: !schemaStore.activeFlatComponents.length,
			onClick: () => {
				const container = schemaStore.createGroup(schemaStore.activeFlatComponents.map((v) => v.id));
				schemaStore.activeFlatComponents.forEach((v) => (v.active = false));
				targetComponent.componentId.value = container.id;
				dragger.computedSelector();
			},
		},
		{
			label: "加入分组",
			disabled: !schemaStore.activeFlatComponents.length,
			list: schemaStore.flatComponents
				.filter((v) => v.nestable)
				.map((v) => ({
					label: v.title,
					onClick: () => schemaStore.joinGroup(targetComponent.componentId.value, v.id),
				})),
		},
		{
			label: "移出分组",
			disabled: schemaStore.activeFlatComponents.every((component) => {
				const parent = schemaStore.findParent(component.id);
				return parent && schemaStore.isSchema(parent);
			}),
			onClick: () => schemaStore.activeFlatComponents.forEach((v) => schemaStore.moveOut(v.id)),
		},
		{
			label: "展开子组件到根组件",
			disabled: schemaStore.activeFlatComponents.every((v) => !v.components.length),
			onClick: () => schemaStore.activeFlatComponents.forEach((v) => schemaStore.flatChindrenToSchema(v.id)),
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
