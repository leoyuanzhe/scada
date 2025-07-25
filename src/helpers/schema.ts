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
		dataSources: cloneAsset.material.dataSources,
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
function getExpressionResult(this: Component | Schema, expression: string | undefined, payload: any) {
	const schemaStore = useSchema();
	try {
		const fn = new Function(
			"state",
			"$state",
			"parent",
			"root",
			"current",
			"schema",
			"payload",
			"return " + expression
		);
		return {
			result: fn.call(
				this,
				this.state,
				schemaStore.state,
				"id" in this ? schemaStore.findParent(this.id).parent : null,
				"id" in this ? schemaStore.findRoot(this) : null,
				schemaStore.currentComponent,
				schemaStore.$state,
				payload
			),
		};
	} catch (error: any) {
		return { error };
	}
}
// 初始化状态
export function initState(this: Component | Schema) {
	const payload = {};
	watchEffect(() => {
		for (let key in this.stateExpression) {
			delete this.state[key];
			const { result, error } = getExpressionResult.call(this, this.stateExpression[key], payload);
			if (error) {
				this.state[key] = null;
				console.error(error);
				continue;
			}
			this.state[key] = result;
		}
	});
}
// 初始化属性
export function initProps(this: Component) {
	const payload = {};
	watchEffect(() => {
		for (let key in this.propsExpression) {
			const { result, error } = getExpressionResult.call(this, this.propsExpression[key], payload);
			if (error) {
				console.error(error);
				continue;
			}
			this.props[key] = result;
		}
	});
}
// 获取动作处理结果
export async function getActionHandlerResult(this: Component | Schema, handler: string, payload: any, event?: any) {
	const schemaStore = useSchema();
	try {
		return {
			result: await new Function(
				"state",
				"$state",
				"parent",
				"root",
				"current",
				"schema",
				"payload",
				"event",
				handler
			).call(
				this,
				this.state,
				schemaStore.state,
				"id" in this ? schemaStore.findParent(this.id).parent : null,
				"id" in this ? schemaStore.findRoot(this) : null,
				schemaStore.currentComponent,
				schemaStore.$state,
				payload,
				event
			),
		};
	} catch (error: any) {
		return { error };
	}
}
// 触发事件
export const triggerEmit = async (emit: EmitEvent, component: Component, payload: any, event?: any) => {
	switch (emit.executeType) {
		case "concurrent": {
			await Promise.all(
				emit.actionsName.map((actionName) => {
					const action = component.actions.find((v) => v.name === actionName);
					if (action) return triggerAction(action, component, payload, event);
					else return Promise.resolve();
				})
			);
			break;
		}
		case "sequential": {
			for (let i = 0; i < emit.actionsName.length; i++) {
				const action = component.actions.find((v) => v.name === emit.actionsName[i]);
				if (action) await triggerAction(action, component, payload, event);
			}
			break;
		}
	}
};
// 触发动作
export const triggerAction = async (action: Action, component: Component, payload: any, event?: any) => {
	const clientStore = useClient();
	const schemaStore = useSchema();
	if (clientStore.enabledOperate) {
		try {
			const { error: beforeError, result: beforeResult } = await getActionHandlerResult.call(
				component,
				action.beforeHandler,
				payload,
				event
			);
			if (beforeError) throw new Error(beforeError);
			if (!beforeResult)
				throw new Error(`"${component.title}" "${action.name}" before handler trigger disrupted.`);
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
						const { result, error } = getExpressionResult.call(
							component,
							action.params.expression,
							payload
						);
						if (error) throw new Error(`"${component.title}" "${action.name}" change prop error.`);
						targetComponent.propsExpression[action.params.key] = result;
					}
					break;
				}
				case "changeState": {
					const targetComponent = schemaStore.findComponent(action.params.targetComponentId);
					if (targetComponent) {
						const { result, error } = getExpressionResult.call(
							component,
							action.params.expression,
							payload
						);
						if (!error) targetComponent.stateExpression[action.params.key] = result;
						else throw new Error(`"${component.title}" "${action.name}" change state error.`);
					}
					break;
				}
				case "triggerOtherAction": {
					const targetComponent = schemaStore.findComponent(action.params.targetComponentId);
					const targetAction = targetComponent?.actions.find((v) => v.name === action.params.name);
					if (targetComponent && targetAction) {
						await triggerAction(targetAction, targetComponent, payload, event);
					}
					break;
				}
			}
			const { error: afterError } = await getActionHandlerResult.call(
				component,
				action.afterHandler,
				payload,
				event
			);
			if (afterError) throw new Error(afterError);
		} catch (error: any) {
			console.error(error);
		}
	}
};
