<script setup lang="ts">
import { useTargetComponent } from "@/hooks/useTargetComponent";

const targetComponent = useTargetComponent();
</script>

<template>
	<form @submit.prevent>
		<h1>画布</h1>
		<fieldset>
			<legend>布局</legend>
		</fieldset>
	</form>
	<form v-if="targetComponent.component.value" @submit.prevent>
		<h1>{{ targetComponent.component.value.title }}</h1>
		<fieldset>
			<legend>布局</legend>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use "@/styles/form-item" as *;
form {
	display: flex;
	flex-direction: column;
	row-gap: 10px;
	h1 {
		font-size: 18px;
		font-weight: bold;
	}
	> fieldset {
		padding: 10px;
		display: flex;
		flex-direction: column;
		row-gap: 10px;
		background-color: #232323;
		border-radius: 10px;
		legend {
			padding: 4px 12px;
			font-weight: bold;
			background-color: #232323;
			border-radius: 10px;
			box-shadow: 0 0 3px 1px #444;
		}
	}
}
</style>
