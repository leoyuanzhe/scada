<script setup lang="ts">
import { useClient } from "./stores/useClient";
import { useMaterial } from "./stores/useMaterial";
import { useProperty } from "./stores/useProperty";

const clientStore = useClient();
const materialStore = useMaterial();
const propertyStore = useProperty();
init();
function init() {
	clientStore.init();
	materialStore.init();
	propertyStore.init();
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
