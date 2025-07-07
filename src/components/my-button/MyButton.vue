<script lang="ts" setup>
interface Props {
	type?: "button" | "submit";
	variant?: "" | "info" | "primary" | "success" | "warning" | "danger";
}
const props = withDefaults(defineProps<Props>(), {
	type: "button",
	variant: "",
});
</script>

<template>
	<button :class="{ 'my-button': true, [props.variant]: true }" :type="props.type">
		<slot></slot>
	</button>
</template>

<style lang="scss" scoped>
.my-button {
	box-sizing: border-box;
	display: block;
	padding: 2px 8px;
	width: 100%;
	height: 30px;
	border-radius: 4px;
	background-color: transparent;
	border: 1px solid var(--info-color);
	transition: background-color 0.2s, border-color 0.2s;
	&:hover {
		border-color: var(--darken-info-color);
	}
	@each $variant in info, primary, success, warning, danger {
		&.#{$variant} {
			background-color: var(--#{$variant}-color);
			border-color: var(--#{$variant}-color);
			&:hover {
				background-color: var(--darken-#{$variant}-color);
				border-color: var(--darken-#{$variant}-color);
			}
		}
	}
}
</style>
