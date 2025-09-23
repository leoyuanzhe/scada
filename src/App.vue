<script setup lang="ts">
import { useConsole } from "@/stores/useConsole";
import { useClient } from "@/stores/useClient";
import Console from "@/components/Console.vue";

const consoleStore = useConsole();
const client = useClient();
consoleStore.init();
</script>

<template>
	<RouterView v-slot="{ Component }">
		<Transition name="fade" mode="out-in">
			<KeepAlive>
				<Component :is="Component"></Component>
			</KeepAlive>
		</Transition>
	</RouterView>
	<Console v-if="client.console.show" class="console" />
</template>
