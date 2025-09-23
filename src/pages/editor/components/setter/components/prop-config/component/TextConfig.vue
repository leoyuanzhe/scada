<script setup lang="ts">
import type { Component } from "@/types/Component";
import type { TextProps } from "@/materials/text/Text";
import { generateCodeIcon } from "../helpers/formItem";
import FormItem from "@/components/form-item/FormItem.vue";

interface Props {
	component: Component<TextProps>;
}
const props = withDefaults(defineProps<Props>(), {});
const codeIcon = generateCodeIcon<TextProps>(props.component.propsExpression);
</script>

<template>
	<details class="details" open>
		<summary>文字</summary>
		<fieldset>
			<FormItem label="内容" for="setter-content" :icons="[codeIcon('content')]">
				<input
					id="setter-content"
					type="text"
					:value="props.component.props.content"
					@input="props.component.props.content = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
			<FormItem label="字体颜色" for="setter-font-color" :icons="[codeIcon('color')]">
				<input
					id="setter-font-color"
					type="color"
					:value="props.component.props.color"
					@input="props.component.props.color = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
			<FormItem label="字体大小" for="setter-font-size" :icons="[codeIcon('fontSize')]">
				<input
					id="setter-font-size"
					type="number"
					:value="props.component.props.fontSize"
					@input="props.component.props.fontSize = Number(($event.target as HTMLInputElement).value)"
				/>
			</FormItem>
			<FormItem label="字体样式" for="setter-font-style" :icons="[codeIcon('fontStyle')]">
				<select
					id="setter-font-style"
					:value="props.component.props.fontStyle"
					@input="
						props.component.props.fontStyle = ($event.target as HTMLSelectElement)
							.value as TextProps['fontStyle']
					"
				>
					<option value="normal">正常</option>
					<option value="italic">倾斜</option>
				</select>
			</FormItem>
			<FormItem label="字体加粗" for="setter-font-weight" :icons="[codeIcon('fontWeight')]">
				<select
					id="setter-font-weight"
					:value="props.component.props.fontWeight"
					@input="
						props.component.props.fontWeight = ($event.target as HTMLSelectElement)
							.value as TextProps['fontWeight']
					"
				>
					<option value="normal">正常</option>
					<option value="bold">加粗</option>
				</select>
			</FormItem>
			<FormItem label="行高" for="setter-line-height" :icons="[codeIcon('lineHeight')]">
				<input
					id="setter-line-height"
					type="number"
					:value="props.component.props.lineHeight"
					@input="props.component.props.lineHeight = Number(($event.target as HTMLInputElement).value)"
				/>
			</FormItem>
			<FormItem label="对齐方式" for="setter-text-align" :icons="[codeIcon('textAlign')]">
				<select
					id="setter-text-align"
					:value="props.component.props.textAlign"
					@input="
						props.component.props.textAlign = ($event.target as HTMLSelectElement)
							.value as TextProps['textAlign']
					"
				>
					<option value="left">左对齐</option>
					<option value="center">居中对齐</option>
					<option value="right">右对齐</option>
				</select>
			</FormItem>
			<FormItem label="文字装饰" for="setter-text-decoration-line" :icons="[codeIcon('textDecorationLine')]">
				<select
					id="setter-text-decoration-line"
					:value="props.component.props.textDecorationLine"
					@input="
						props.component.props.textDecorationLine = ($event.target as HTMLSelectElement)
							.value as TextProps['textDecorationLine']
					"
				>
					<option value="none">无</option>
					<option value="overline">上边线</option>
					<option value="line-through">删除线</option>
					<option value="underline">下边线</option>
				</select>
			</FormItem>
		</fieldset>
	</details>
	<details class="details" open>
		<summary>背景</summary>
		<fieldset>
			<FormItem label="背景颜色" for="setter-background-color" :icons="[codeIcon('backgroundColor')]">
				<input
					id="setter-background-color"
					type="color"
					:value="props.component.props.backgroundColor"
					@input="props.component.props.backgroundColor = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
		</fieldset>
	</details>
	<details class="details" open>
		<summary>边框</summary>
		<fieldset>
			<FormItem label="边框宽度" for="setter-border-width" :icons="[codeIcon('borderWidth')]">
				<input
					id="setter-border-width"
					type="number"
					:value="props.component.props.borderWidth"
					@input="props.component.props.borderWidth = Number(($event.target as HTMLInputElement).value)"
				/>
			</FormItem>
			<FormItem label="边框颜色" for="setter-border-color" :icons="[codeIcon('borderColor')]">
				<input
					id="setter-border-color"
					type="color"
					:value="props.component.props.borderColor"
					@input="props.component.props.borderColor = ($event.target as HTMLInputElement).value"
				/>
			</FormItem>
			<FormItem label="边框样式" for="setter-border-style" :icons="[codeIcon('borderStyle')]">
				<select
					id="setter-border-style"
					:value="props.component.props.borderStyle"
					@input="
						props.component.props.borderStyle = ($event.target as HTMLSelectElement)
							.value as TextProps['borderStyle']
					"
				>
					<option value="solid">实线</option>
					<option value="dashed">虚线</option>
					<option value="dotted">点线</option>
				</select>
			</FormItem>
			<FormItem label="圆角边框" for="setter-border-radius" :icons="[codeIcon('borderRadius')]">
				<input
					id="setter-border-radius"
					type="number"
					:value="props.component.props.borderRadius"
					@input="props.component.props.borderRadius = Number(($event.target as HTMLInputElement).value)"
				/>
			</FormItem>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "@/styles/form" as *;
</style>
