<script lang="ts" setup>
interface Props {
	label?: string;
	for?: string;
	icons?: ({
		href: string;
		disabled?: boolean;
		variant?: "info" | "primary" | "success" | "warning" | "danger";
		onClick?: () => void;
	} | null)[];
}
const props = withDefaults(defineProps<Props>(), {
	id: "",
	label: "",
	buttons: () => [],
});
</script>

<template>
	<article class="form-item">
		<label v-show="props.label" :for="props.for">{{ props.label }}</label>
		<div class="control">
			<slot></slot>
		</div>
		<template v-for="(v, i) in props.icons" :key="i">
			<button v-if="v?.href" :disabled="v.disabled" @click="v.onClick?.()">
				<svg :class="{ icon: true, [v.variant ?? '']: true }"><use :href="v.href" /></svg>
			</button>
		</template>
	</article>
</template>

<style lang="scss" scoped>
.form-item {
	display: flex;
	align-items: flex-start;
	column-gap: 10px;
	> label {
		flex-shrink: 0;
		min-width: 80px;
		font-size: 14px;
		line-height: 30px;
	}
	.control {
		flex: 1;
	}
	> button {
		flex-shrink: 0;
		padding: 0 10px;
		height: 30px;
		font-size: 14px;
		border-radius: 2px;
		transition: background-color 0.2s;
		.icon {
			color: #ccc;
			@each $variant in info, primary, success, warning, danger {
				&.#{$variant} {
					color: var(--#{$variant}-color);
					&:hover {
						color: var(--darken-#{$variant}-color);
					}
				}
			}
		}
		&:hover {
			background-color: #111;
		}
	}
}
</style>
