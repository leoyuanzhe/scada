import { computed, type ComputedRef } from "vue";
import { useSchema } from "@/stores/useSchema";
import type { Component } from "@/types/Component";
import CodeEditor from "@/components/code-editor";
import type { Schema } from "@/types/Schema";

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
export const openCodeEditor = async <T>(component: Component<T> | Schema<T>, key: keyof T) => {
	const value = await CodeEditor(component.propsExpression[key]);
	value !== undefined ? (component.propsExpression[key] = value) : delete component.propsExpression[key];
};
