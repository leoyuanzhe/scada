<script setup lang="ts">
import { useSchema } from "@/stores/useSchema";
import { openCodeEditor } from "@/helpers/component";

const schemaStore = useSchema();
</script>

<template>
	<details class="config" open>
		<summary>基础</summary>
		<fieldset>
			<article class="form-item">
				<label for="setter-text">文本</label>
				<input id="setter-text" type="text" :value="schemaStore.props.backgroundColor" @input="schemaStore.props.backgroundColor = ($event.target as HTMLInputElement).value" />
				<button @click="openCodeEditor(schemaStore, 'backgroundColor')">
					<svg :class="{ icon: true, active: schemaStore.propsExpression.backgroundColor !== undefined }"><use href="#code-fork" /></svg>
				</button>
			</article>
		</fieldset>
	</details>
</template>

<style lang="scss" scoped>
@use "../../styles/config" as *;
@use "@/styles/form-item" as *;
</style>
