import { watchEffect } from "vue";
import type { Asset } from "@/types/Asset";
import type { Schema } from "@/types/Schema";
import type { Action, Component, EmitEvent } from "@/types/Component";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { deepClone } from "@/utils/conversion";
import CodeEditor from "@/components/code-editor";

// 资产转组件
export const assetTransferComponent = (asset: Asset): Component => {
	const cloneAsset = deepClone(asset);
	return {
		version: cloneAsset.material.version,
		id: "",
		key: cloneAsset.material.key,
		title: cloneAsset.material.title,
		actived: false,
		nestable: cloneAsset.material.nestable,
		locked: cloneAsset.material.locked,
		hidden: cloneAsset.material.hidden,
		resizable: cloneAsset.material.resizable,
		layout: cloneAsset.material.layout,
		props: cloneAsset.material.props,
		state: cloneAsset.material.state,
		actions: cloneAsset.material.actions,
		emits: cloneAsset.material.emits,
		components: cloneAsset.material.components,
		propsExpression: cloneAsset.material.propsExpression,
		stateExpression: cloneAsset.material.stateExpression,
	};
};
// 生成id
export const generateId = () => {
	return Math.random().toString(36).substring(2, 7);
};
// 重置组件的定位和大小
export const relayoutComponent = (component: Component) => {
	const schemaStore = useSchema();
	if (component.layout && !schemaStore.isRoot(component.id) && component.components.filter((v) => v.layout).length) {
		let left = Infinity;
		let top = Infinity;
		let width = 0;
		let height = 0;
		component.components.forEach((v) => {
			if (v.layout) {
				if (v.layout.left < 0) v.layout.left = 0;
				if (v.layout.top < 0) v.layout.top = 0;
				left = Math.min(left, v.layout.left);
				top = Math.min(top, v.layout.top);
			}
		});
		component.layout.left += left;
		component.layout.top += top;
		component.components.forEach((v) => {
			if (v.layout) {
				v.layout.left -= left;
				v.layout.top -= top;
				width = Math.max(width, v.layout.left + v.layout.width);
				height = Math.max(height, v.layout.top + v.layout.height);
			}
		});
		component.layout.width = width;
		component.layout.height = height;
	}
};
type StringKeyOf<T> = {
	[K in keyof T]: T[K] extends string ? K : never;
}[keyof T];
// 代码编辑器编辑对象的属性
export const editObjectValue = <T extends Partial<Record<string, any>>>(
	object: T,
	key: StringKeyOf<T>,
	defaultValue?: string
): Promise<null> => {
	return new Promise((resolve) => {
		CodeEditor(defaultValue ?? object[key])
			.then((value) => {
				object[key as keyof T] = value as T[keyof T];
				resolve(null);
			})
			.catch(() => {});
	});
};
// 获取表达式结果
export const getExpressionResult = (
	expression: string | undefined,
	state: Record<string, any>,
	parent: Component | null,
	payload: any
) => {
	const schemaStore = useSchema();
	try {
		return {
			result: new Function("$state", "state", "parent", "payload", "return " + expression)(
				schemaStore.state,
				state,
				parent,
				payload
			),
		};
	} catch (error: any) {
		console.error(error);
		return { error };
	}
};
// 初始化状态
export const initState = (component: Component | Schema) => {
	const schemaStore = useSchema();
	const payload = {};
	watchEffect(() => {
		for (let key in component.stateExpression) {
			delete component.state[key];
			const { result, error } = getExpressionResult(
				component.stateExpression[key],
				component.state,
				schemaStore.findParent((component as Component)?.id).parent,
				payload
			);
			if (!error) component.state[key] = result;
			else component.state[key] = null;
		}
	});
};
// 初始化属性
export const initProps = (component: Component) => {
	const payload = {};
	watchEffect(() => {
		for (let key in component.propsExpression) {
			const { result, error } = getExpressionResult(
				component.propsExpression[key as keyof typeof component.propsExpression],
				component.state,
				component,
				payload
			);
			if (!error) component.props[key] = result;
		}
	});
};
// 触发动作
export const triggerAction = async (action: Action, component: Component, event?: any, payload?: any) => {
	const clientStore = useClient();
	const schemaStore = useSchema();
	if (clientStore.enabledOperate) {
		try {
			const beforeReuslt = await new Function(
				"event",
				"payload",
				"$state",
				"state",
				"parent",
				action.beforeHandler
			)(event, payload, schemaStore.state, component.state, schemaStore.findParent(component.id));
			if (!beforeReuslt)
				throw new Error(component.title + " " + action.name + " before handler trigger disrupted.");
			switch (action.type) {
				case "changeVisible": {
					action.params.targetComponentsId.forEach((componentId) => {
						const targetComponent = schemaStore.findComponent(componentId);
						if (targetComponent) {
							if (action.params.visible === "show") targetComponent.hidden = false;
							else if (action.params.visible === "hide") targetComponent.hidden = true;
							else
								targetComponent.hidden
									? (targetComponent.hidden = false)
									: (targetComponent.hidden = true);
						}
					});
					break;
				}
				case "changeProp": {
					const targetComponent = schemaStore.findComponent(action.params.targetComponentId);
					if (targetComponent) {
						const { result, error } = getExpressionResult(
							action.params.expression,
							component.state,
							component,
							payload
						);
						if (!error) targetComponent.propsExpression[action.params.key] = result;
						else throw new Error(component.title + " " + action.name + " change prop error.");
					}
					break;
				}
				case "changeState": {
					const targetComponent = schemaStore.findComponent(action.params.targetComponentId);
					if (targetComponent) {
						const { result, error } = getExpressionResult(
							action.params.expression,
							component.state,
							component,
							payload
						);
						if (!error) targetComponent.stateExpression[action.params.key] = result;
						else throw new Error(component.title + " " + action.name + " change state error.");
					}
					break;
				}
				case "triggerOtherAction": {
					const targetComponent = schemaStore.findComponent(action.params.targetComponentId);
					const targetAction = targetComponent?.actions.find((v) => v.name === action.params.name);
					if (targetComponent && targetAction) {
						await triggerAction(targetAction, targetComponent, event, payload);
					}
					break;
				}
			}
			await new Function("event", "payload", "$state", "state", "parent", action.afterHandler)(
				event,
				payload,
				schemaStore.state,
				component.state,
				schemaStore.findParent(component.id)
			);
		} catch (error: any) {
			console.error(error);
		}
	}
};
// 触发事件
export const triggerEmit = async (emit: EmitEvent, component: Component, event?: any, payload?: any) => {
	switch (emit.executeType) {
		case "concurrent": {
			await Promise.all(
				emit.actionsName.map((actionName) => {
					const action = component.actions.find((v) => v.name === actionName);
					if (action) return triggerAction(action, component, event, payload);
					else return Promise.resolve();
				})
			);
			break;
		}
		case "sequential": {
			for (let i = 0; i < emit.actionsName.length; i++) {
				const action = component.actions.find((v) => v.name === emit.actionsName[i]);
				if (action) await triggerAction(action, component, event, payload);
			}
			break;
		}
	}
};
