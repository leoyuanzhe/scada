<script setup lang="ts">
import { useClient } from "./stores/useClient";
import { useMaterial } from "./stores/useMaterial";
import { useProperty } from "./stores/useProperty";
import { useSchema } from "./stores/useSchema";

const clientStore = useClient();
const materialStore = useMaterial();
const propertyStore = useProperty();
const schemaStore = useSchema();
init();
function init() {
	clientStore.init();
	materialStore.init();
	propertyStore.init();
	clientStore.canvasScale = 1.2;
	schemaStore.canvas.width = 400;
	schemaStore.canvas.height = 400;
	schemaStore.components.push({
		id: Date.now().toString(),
		name: "text",
		title: "文本",
		active: false,
		nestable: false,
		locked: false,
		hidden: false,
		snap: { v: [], h: [] },
		left: 0,
		top: 0,
		width: 100,
		height: 50,
		props: {
			text: "这是一段文本",
			color: "#ffffff",
		},
		children: [],
	});
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
