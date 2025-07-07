import { watchEffect } from "vue";
import type { Schema } from "@/types/Schema";
import type { Action, Component, EmitEvent } from "@/types/Component";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import CodeEditor from "@/components/code-editor";

// 生成组件id
export const generateComponetId = () => {
	return Math.random().toString(36).substring(2, 7);
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
export const getExpressionResult = (expression: string | undefined, component: Schema | Component, payload?: any) => {
	const schemaStore = useSchema();
	try {
		return {
			result: new Function("$state", "state", "parent", "payload", "return " + expression)(
				schemaStore.state,
				component.state,
				schemaStore.findParent(component.id),
				payload
			),
		};
	} catch (error: any) {
		console.error(error);
		return { error };
	}
};
// 初始化组件
export const initComponent = (component: Schema | Component) => {
	watchEffect(() => {
		for (let key in component.stateExpression) {
			delete component.state[key];
			const { result, error } = getExpressionResult(component.stateExpression[key], component);
			if (!error) component.state[key] = result;
			else component.state[key] = null;
		}
		for (let key in component.propsExpression) {
			const { result, error } = getExpressionResult(
				component.propsExpression[key as keyof typeof component.propsExpression],
				component
			);
			if (!error) component.props[key] = result;
		}
	});
};
// 触发动作
export const triggerAction = async (action: Action, component: Schema | Component, event?: any, payload?: any) => {
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
						if (targetComponent && !schemaStore.isSchema(targetComponent)) {
							if (action.params.visible === "show") schemaStore.showComponent(targetComponent);
							else if (action.params.visible === "hide") schemaStore.showComponent(targetComponent);
							else
								targetComponent.hidden
									? schemaStore.showComponent(targetComponent)
									: schemaStore.hideComponent(targetComponent);
						}
					});
					break;
				}
				case "changeProp": {
					const targetComponent = schemaStore.findComponent(action.params.targetComponentId);
					if (targetComponent) {
						const { result, error } = getExpressionResult(action.params.expression, component, payload);
						if (!error) targetComponent.propsExpression[action.params.key] = result;
						else throw new Error(component.title + " " + action.name + " change prop error.");
					}
					break;
				}
				case "changeState": {
					const targetComponent = schemaStore.findComponent(action.params.targetComponentId);
					if (targetComponent) {
						const { result, error } = getExpressionResult(action.params.expression, component, payload);
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
export const triggerEmit = async (emit: EmitEvent, component: Schema | Component, event?: any, payload?: any) => {
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
