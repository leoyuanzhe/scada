import { watch, watchEffect } from "vue";
import type { Asset } from "@/types/Asset";
import type { Schema } from "@/types/Schema";
import type { Action, Component, DataSource, EmitEvent, Watcher } from "@/types/Component";
import { useClient } from "@/stores/useClient";
import { useSchema } from "@/stores/useSchema";
import { deepClone } from "@/utils/conversion";
import { delay } from "@/utils/tool";
import CodeEditor from "@/components/code-editor";

// 资产转组件
export const assetTransferComponent = (asset: Asset): Component => {
	const cloneAsset = deepClone(asset);
	return {
		version: cloneAsset.component.version,
		id: "",
		key: cloneAsset.component.key,
		title: cloneAsset.component.title,
		actived: false,
		nestable: cloneAsset.component.nestable,
		locked: cloneAsset.component.locked,
		hidden: cloneAsset.component.hidden,
		selectable: cloneAsset.component.selectable,
		moveable: cloneAsset.component.moveable,
		resizable: cloneAsset.component.resizable,
		autoReplace: cloneAsset.component.autoReplace,
		autoLayout: cloneAsset.component.autoLayout,
		layout: cloneAsset.component.layout,
		props: cloneAsset.component.props,
		state: cloneAsset.component.state,
		watchers: cloneAsset.component.watchers,
		dataSources: cloneAsset.component.dataSources,
		actions: cloneAsset.component.actions,
		emits: cloneAsset.component.emits,
		customProps: cloneAsset.component.customProps,
		customEmits: cloneAsset.component.customEmits,
		components: cloneAsset.component.components,
		propsExpression: cloneAsset.component.propsExpression,
		stateExpression: cloneAsset.component.stateExpression,
	};
};
// 生成id
export const generateId = () => {
	return Math.random().toString(36).substring(2, 7);
};
export const getFlatedComponents = <T extends Schema | Component>(component: T): (T | Component)[] => {
	return [component, ...(component.components.flatMap(getFlatedComponents) as (T | Component)[])];
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
export const initComponent = (component: Component) => {
	initState(component);
	initProps(component);
	initDataSources(component);
	initWatchers(component);
	if (component.autoLayout && component.nestable) {
		watch(
			() => component.components,
			() => relayoutComponent(component),
			{ immediate: true, deep: true }
		);
	}
};
// 获取表达式器结果
function getExpressionResult(this: Component | Schema, expression: string | undefined, payload: any) {
	const schemaStore = useSchema();
	try {
		const fn = new Function(
			"state",
			"$state",
			"parent",
			"root",
			"currentRoot",
			"schema",
			"payload",
			"return " + expression
		);
		return {
			result: fn.call(
				this,
				this.state,
				schemaStore.state,
				!schemaStore.isSchema(this) ? schemaStore.findParent(this.id).parent : null,
				!schemaStore.isSchema(this) ? schemaStore.findRoot(this) : null,
				schemaStore.currentRootComponent,
				schemaStore.$state,
				payload
			),
		};
	} catch (error: any) {
		return { error };
	}
}
// 初始化状态
export function initState(component: Component | Schema) {
	const clientStore = useClient();
	const payload = {};
	if (clientStore.previewing) {
		for (let key in component.stateExpression) {
			watchEffect(() => {
				fn(key);
			});
		}
	} else {
		watchEffect(() => {
			for (let key in component.stateExpression) {
				fn(key);
			}
		});
	}
	function fn(key: keyof typeof component.stateExpression) {
		delete component.state[key];
		const { result, error } = getExpressionResult.call(component, component.stateExpression[key], payload);
		if (error) {
			component.state[key] = null;
			console.error(error);
		} else component.state[key] = result;
	}
}
// 初始化属性
export function initProps(component: Component) {
	const clientStore = useClient();
	const payload = {};
	if (clientStore.previewing) {
		for (let key in component.propsExpression) {
			watchEffect(() => {
				fn(key);
			});
		}
	} else {
		watchEffect(() => {
			for (let key in component.propsExpression) {
				fn(key);
			}
		});
	}
	function fn(key: keyof typeof component.propsExpression) {
		const { result, error } = getExpressionResult.call(component, component.propsExpression[key], payload);
		if (error) console.error(error);
		else component.props[key] = result;
	}
}
// 获取监听处理器结果
function getWatcherTargetHandlerResult(this: Component | Schema, handler: string) {
	const schemaStore = useSchema();
	try {
		return {
			result: new Function("state", "$state", "parent", "root", "currentRoot", "schema", handler).call(
				this,
				this.state,
				schemaStore.state,
				!schemaStore.isSchema(this) ? schemaStore.findParent(this.id).parent : null,
				!schemaStore.isSchema(this) ? schemaStore.findRoot(this) : null,
				schemaStore.currentRootComponent,
				schemaStore.$state
			),
		};
	} catch (error: any) {
		return { error };
	}
}
// 初始化监听器
export function initWatchers(component: Component) {
	const payload = {};
	component.watchers.forEach((watcher) => {
		try {
			const { error, result } = getWatcherTargetHandlerResult.call(component, watcher.sourceHandler);
			if (error) throw new Error(error);
			watch(result, () => triggerEmit(watcher, component, payload), {
				immediate: watcher.immediate,
				deep: watcher.deep,
				once: watcher.once,
			});
		} catch (error) {
			console.error(error);
		}
	});
}
// 获取数据源处理器结果
async function getDataSourceHandlerResult(
	this: Component | Schema,
	response: DataSource["response"],
	handler: string,
	payload: any
) {
	const schemaStore = useSchema();
	try {
		return {
			result: await new Function(
				"response",
				"data",
				"state",
				"$state",
				"parent",
				"root",
				"currentRoot",
				"schema",
				"payload",
				handler
			).call(
				this,
				response,
				response.data,
				this.state,
				schemaStore.state,
				!schemaStore.isSchema(this) ? schemaStore.findParent(this.id).parent : null,
				!schemaStore.isSchema(this) ? schemaStore.findRoot(this) : null,
				schemaStore.currentRootComponent,
				schemaStore.$state,
				payload
			),
		};
	} catch (error: any) {
		return { error };
	}
}
// 初始化数据源
export async function initDataSources(component: Component) {
	const payload = {};
	for (let dataSource of component.dataSources) {
		if (dataSource.autoRequest) await requestDataSource(dataSource, component, payload);
	}
}
// 请求数据源
export async function requestDataSource(dataSource: DataSource, component: Schema | Component, payload: any) {
	try {
		const { error: beforeError, result: beforeResult } = await getDataSourceHandlerResult.call(
			component,
			dataSource.response,
			dataSource.beforeHandler,
			payload
		);
		if (beforeError) throw new Error(beforeError);
		if (!beforeResult)
			throw new Error(`"${component.title}" "${dataSource.name}" before handler trigger disrupted.`);
		await fetch(getUrl(), {
			method: dataSource.request.method,
			headers: getHeaders(),
			body: getBody(),
		})
			.then(async (res) => {
				dataSource.response.status = res.status;
				dataSource.response.statusText = res.statusText;
				dataSource.response.headers = res.headers;
				dataSource.response.data =
					dataSource.responseType === "Text"
						? await res.text()
						: dataSource.responseType === "JSON"
						? await res.json()
						: dataSource.responseType === "Blob"
						? await res.blob()
						: dataSource.responseType === "ArrayBuffer"
						? await res.arrayBuffer()
						: dataSource.responseType === "FormData"
						? await res.formData()
						: res;
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}: ${res.statusText}`);
				}
			})
			.catch((error) => {
				throw new Error(error);
			});
		const { error: afterError } = await getDataSourceHandlerResult.call(
			component,
			dataSource.response,
			dataSource.afterHandler,
			payload
		);
		if (afterError) throw new Error(afterError);
		function getUrl() {
			const urlSP = new URLSearchParams(
				dataSource.request.params.reduce((pre, cur) => {
					pre[cur.key] = getExpressionResult.call(component, cur.value, payload).result;
					return pre;
				}, {} as Record<string, string>)
			);
			return dataSource.request.url + urlSP.toString();
		}
		function getHeaders() {
			const headers = new Headers();
			if (dataSource.request.body.type === "form-data") {
				headers.append("Content-Type", "multipart/form-data");
			} else if (dataSource.request.body.type === "x-www-form-urlencoded") {
				headers.append("Content-Type", "application/x-www-form-urlencoded");
			} else if (dataSource.request.body.type === "raw") {
				headers.append(
					"Content-Type",
					dataSource.request.body.rawType === "JavaScript"
						? "application/javascript"
						: dataSource.request.body.rawType === "JSON"
						? "application/json"
						: dataSource.request.body.rawType === "HTML"
						? "text/html"
						: dataSource.request.body.rawType === "XML"
						? "application/xml"
						: "text/plain"
				);
			}
			dataSource.request.headers.forEach((v) => {
				headers.append(v.key, getExpressionResult.call(component, v.value, payload).result.toString());
			});
			return headers;
		}
		function getBody() {
			return dataSource.request.body.type === "form-data"
				? getFormDataBody()
				: dataSource.request.body.type === "x-www-form-urlencoded"
				? getXWwwFormUrlencodedBody()
				: dataSource.request.body.type === "raw"
				? dataSource.request.body.rawContent
				: null;
		}
		function getFormDataBody() {
			const formData = new FormData();
			dataSource.request.body.formDataParams.forEach((v) => {
				formData.append(v.key, getExpressionResult.call(component, v.value, payload).result);
			});
			return formData;
		}
		function getXWwwFormUrlencodedBody() {
			return new URLSearchParams(
				dataSource.request.body.xWwwFormUrlencodedParams.reduce((pre, cur) => {
					pre[cur.key] = getExpressionResult.call(component, cur.value, payload).result.toString();
					return pre;
				}, {} as Record<string, string>)
			);
		}
	} catch (error) {
		console.error(error);
	}
}
// 获取事件处理器结果
async function getActionHandlerResult(this: Component | Schema, handler: string, payload: any, event?: any) {
	const schemaStore = useSchema();
	try {
		const parent = !schemaStore.isSchema(this) ? schemaStore.findParent(this.id).parent : null;
		const emits = async (key: string, data: any) => {
			if (parent && !schemaStore.isSchema(parent) && parent.emits[key]) {
				await triggerEmit(parent.emits[key], parent, data, event);
			}
		};
		return {
			result: await new Function(
				"state",
				"$state",
				"parent",
				"root",
				"currentRoot",
				"schema",
				"emits",
				"payload",
				"event",
				handler
			).call(
				this,
				this.state,
				schemaStore.state,
				parent,
				!schemaStore.isSchema(this) ? schemaStore.findRoot(this) : null,
				schemaStore.currentRootComponent,
				schemaStore.$state,
				emits,
				payload,
				event
			),
		};
	} catch (error: any) {
		return { error };
	}
}
// 触发事件
export const triggerEmit = async (emit: Watcher | EmitEvent, component: Component, payload: any, event?: any) => {
	await delay(emit.timeout);
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
export const triggerAction = async (action: Action, component: Schema | Component, payload: any, event?: any) => {
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
					action.changeVisibleParams.targetComponentsId.forEach((componentId) => {
						const targetComponent = schemaStore.findComponent(componentId);
						if (targetComponent) {
							if (action.changeVisibleParams.visible === "show") targetComponent.hidden = false;
							else if (action.changeVisibleParams.visible === "hide") targetComponent.hidden = true;
							else
								targetComponent.hidden
									? (targetComponent.hidden = false)
									: (targetComponent.hidden = true);
						}
					});
					break;
				}
				case "changeProp": {
					const targetComponent = schemaStore.findComponent(action.changePropParams.targetComponentId);
					if (targetComponent) {
						const { result, error } = getExpressionResult.call(
							component,
							action.changePropParams.expression,
							payload
						);
						if (error) throw new Error(`"${component.title}" "${action.name}" change prop error.`);
						targetComponent.props[action.changePropParams.key] = result;
					}
					break;
				}
				case "changeState": {
					const targetComponent = schemaStore.findComponentWithSchema(
						action.changeStateParams.targetComponentId
					);
					if (targetComponent) {
						const { result, error } = getExpressionResult.call(
							component,
							action.changeStateParams.expression,
							payload
						);
						if (!error) {
							targetComponent.state[action.changeStateParams.key] = result;
						} else throw new Error(`"${component.title}" "${action.name}" change state error.`);
					}
					break;
				}
				case "requestDataSource": {
					const targetComponent = schemaStore.findComponentWithSchema(
						action.requestDataSourceParams.targetComponentId
					);
					const targetDataSource = targetComponent?.dataSources.find(
						(v) => v.name === action.requestDataSourceParams.name
					);
					if (targetComponent && targetDataSource) {
						await requestDataSource(targetDataSource, targetComponent, payload);
					}
					break;
				}
				case "triggerOtherAction": {
					const targetComponent = schemaStore.findComponentWithSchema(
						action.triggerOtherActionParams.targetComponentId
					);
					const targetAction = targetComponent?.actions.find(
						(v) => v.name === action.triggerOtherActionParams.name
					);
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
