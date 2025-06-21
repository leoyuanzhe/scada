<script setup lang="ts">
import { useTargetComponent } from "@/hooks/useTargetComponent";

const targetComponent = useTargetComponent();
</script>

<template>
	<form class="form" @submit.prevent>
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
@use "@/styles/form" as *;
</style>
