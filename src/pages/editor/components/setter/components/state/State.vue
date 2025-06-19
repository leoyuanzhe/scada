<script setup lang="ts">
import { ref } from "vue";
import { useSchema } from "@/stores/useSchema";
import { deserialize, serialize } from "@/utils/conversion";

const schemaStore = useSchema();
const value = ref("");
init();
function init() {
	value.value = serialize(schemaStore.state);
}
const input = () => {
	const state = deserialize(value.value);
	if (state) schemaStore.state = state;
};
</script>

<template>
	<div class="state">
		<textarea v-model="value" @input="input()"></textarea>
	</div>
</template>

<style scoped lang="scss">
.state {
	box-sizing: border-box;
	padding: 10px;
	height: 100%;
	background-color: #333;
	display: flex;
	flex-direction: column;
	textarea {
		flex: 1;
		padding: 10px;
		background-color: #232323;
		border-radius: 10px;
		resize: none;
	}
}
</style>
