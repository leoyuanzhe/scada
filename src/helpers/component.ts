import { computed, type ComputedRef } from "vue";
import { useSchema } from "@/stores/useSchema";
import type { Schema } from "@/types/Schema";
import type { Component } from "@/types/Component";
import CodeEditor from "@/components/code-editor";

type ComputedProps<T> = {
	[K in keyof T]: ComputedRef<T[K]>;
};
// 获取与expressions计算后的组件props
export const getComputedProps = <T>(component: Schema<T> | Component<T>) => {
	const schemaStore = useSchema();
	const props: Partial<ComputedProps<T>> = {};
	for (let key in component.props) {
		props[key] = computed(() => {
			if (component.propsExpression[key] !== undefined)
				try {
					return new Function("$state", "state", "return " + component.propsExpression[key])(schemaStore.state, component.state);
				} catch (error) {
					console.error("属性表达式错误", error);
					return component.props[key];
				}
			else return component.props[key];
		});
	}
	return props as ComputedProps<T>;
};
export const openExpressionCodeEditor = async <T extends Partial<Record<string, string>>>(object: T, key: keyof T) => {
	const value = await CodeEditor(object[key]);
	if (key in object) {
		value !== undefined ? (object[key] = value as T[keyof T]) : delete object[key];
	}
};
