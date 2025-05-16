<script setup lang="ts">
import { useMaterial } from "./stores/useMaterial";

const materialStore = useMaterial();
init();
function init() {
	materialStore.init();
}
</script>

<template>
	<RouterView v-slot="{ Component }">
		<Transition name="fade" mode="out-in">
			<KeepAlive>
				<Component :is="Component"></Component>
			</KeepAlive>
		</Transition>
	</RouterView>
</template>
