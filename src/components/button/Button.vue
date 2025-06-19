<script lang="ts" setup>
interface Props {
	variant?: "" | "info" | "primary" | "success" | "warning" | "danger";
}
const props = withDefaults(defineProps<Props>(), {
	variant: "",
});
</script>

<template>
	<button :class="{ 'yz-button': true, [props.variant]: true }" type="button">
		<slot></slot>
	</button>
</template>

<style lang="scss" scoped>
.yz-button {
	box-sizing: border-box;
	padding: 8px 16px;
	display: block;
	flex: 1;
	width: 100%;
	height: 40px;
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
