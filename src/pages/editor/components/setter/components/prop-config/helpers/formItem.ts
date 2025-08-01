import type { FormItemIcon } from "@/components/form-item/FormItem.vue";
import { editObjectValue } from "@/helpers/schema";

export const generateCodeIcon =
	<T extends Record<string, any>>(propsExpression: Partial<Record<keyof T, string>>) =>
	(key: keyof T): FormItemIcon => {
		return {
			href: "#code",
			variant: propsExpression[key] !== undefined ? "primary" : "info",
			onClick: () => editObjectValue(propsExpression, key as any),
		};
	};
