import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import { useSchema } from "@/stores/useSchema";
import CodeEditor from "@/components/code-editor";
import { watchEffect } from "vue";

// 代码编辑器编辑对象的属性
export const editObjectValue = async <T extends Partial<Record<string, string>>>(object: T, key: keyof T) => {
	const value = await CodeEditor(object[key]);
	value !== undefined ? (object[key] = value as T[keyof T]) : delete object[key];
};
// 代码编辑器编辑对象的键
export const editObjectKey = async <T extends Partial<Record<string, string>>>(object: T, key: keyof T) => {
	const newKey = await CodeEditor(key.toString());
	if (key in object && newKey !== undefined) {
		const value = object[key];
		delete object[key];
		object[newKey as keyof T] = value;
	}
};
// 获取表达式结果
export const getExpressionResult = (expression: string | undefined, component: Schema | Component) => {
	const schemaStore = useSchema();
	try {
		return { result: new Function("$state", "state", "return " + expression)(schemaStore.state, component.state) };
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
			const { result, error } = getExpressionResult(component.propsExpression[key], component);
			if (!error) component.props[key] = result;
		}
	});
};
