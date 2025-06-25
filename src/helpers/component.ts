import { watchEffect } from "vue";
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import { useSchema } from "@/stores/useSchema";
import CodeEditor from "@/components/code-editor";

// 代码编辑器编辑对象的属性
export const editObjectValue = <T extends Partial<Record<string, string>>>(object: T, key: keyof T): Promise<null> => {
	return new Promise((resolve) => {
		CodeEditor(object[key])
			.then((value) => {
				object[key] = value as T[keyof T];
				resolve(null);
			})
			.catch(() => {});
	});
};
// 代码编辑器编辑对象的键
export const editObjectKey = <T extends Partial<Record<string, string>>>(object: T, key: keyof T): Promise<null> => {
	return new Promise((resolve) => {
		CodeEditor(key.toString())
			.then((newKey) => {
				const value = object[key];
				delete object[key];
				object[newKey as keyof T] = value;
				resolve(null);
			})
			.catch(() => {});
	});
};
// 获取表达式结果
export const getExpressionResult = (expression: string | undefined, component: Schema | Component) => {
	const schemaStore = useSchema();
	try {
		return { result: new Function("$state", "state", "parent", "return " + expression)(schemaStore.state, component.state, schemaStore.findParent(component.id)) };
	} catch (error: any) {
		console.error(error);
		return { error };
	}
};
export const initComponent = (component: Schema | Component) => {
	watchEffect(() => {
		for (let key in component.stateExpression) {
			delete component.state[key];
			const { result, error } = getExpressionResult(component.stateExpression[key], component);
			if (!error) component.state[key] = result;
			else component.state[key] = null;
		}
		for (let key in component.propsExpression) {
			const { result, error } = getExpressionResult(component.propsExpression[key as keyof typeof component.propsExpression], component);
			if (!error) component.props[key] = result;
		}
	});
};
