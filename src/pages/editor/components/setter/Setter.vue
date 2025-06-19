<script setup lang="ts">
import { ref } from "vue";
import Prop from "./components/prop/Prop.vue";
import Emit from "./components/emit/Emit.vue";

const current = ref<"prop" | "emit">("prop");
</script>

<template>
	<div class="setter">
		<menu>
			<button :class="{ active: current === 'prop' }" @click="current = 'prop'">属性</button>
			<button :class="{ active: current === 'emit' }" @click="current = 'emit'">事件</button>
		</menu>
		<div class="container">
			<Prop v-if="current === 'prop'" />
			<Emit v-if="current === 'emit'" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.setter {
	display: flex;
	flex-direction: column;
	menu {
		padding: 10px;
		display: flex;
		column-gap: 10px;
		background-color: #333;
		box-shadow: 0 0 3px 1px #666;
		z-index: 1;
		button {
			width: 40px;
			height: 40px;
			background-color: #444;
			border-radius: 4px;
			transition: box-shadow 0.2s;
			&.active,
			&:hover {
				box-shadow: 0 0 3px 1px var(--primary-color);
			}
		}
	}
	.container {
		flex: 1;
		padding: 10px;
		background-color: #333;
		overflow: auto;
		display: flex;
		flex-direction: column;
		row-gap: 10px;
	}
}
</style>
