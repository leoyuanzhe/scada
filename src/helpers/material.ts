import { computed, type ComputedRef } from "vue";
import { useSchema } from "@/stores/useSchema";
import type { Component } from "@/types/Component";

type ComputedProps<T> = {
	[K in keyof T]: ComputedRef<T[K]>;
};
// 获取与expressions计算后的组件props
export const getComputedProps = <T extends Component["props"]>(component: Component<T>) => {
	const schemaStore = useSchema();
	const props: Partial<ComputedProps<T>> = {};
	for (let key in component.props) {
		props[key] = computed(() => {
			if (component.expressions[key] !== undefined)
				try {
					return new Function("state", "return " + component.expressions[key])(schemaStore.state);
				} catch (error) {
					console.error("属性表达式错误", error);
					return component.props[key];
				}
			else return component.props[key];
		});
	}
	return props as ComputedProps<T>;
};
