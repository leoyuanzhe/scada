<script setup lang="ts">
import { useClient } from "./stores/useClient";
import { useMaterial } from "./stores/useMaterial";
import { useAsset } from "./stores/useAsset";
import { useSchema } from "./stores/useSchema";
import { Container } from "./materials/container/Container";
import { Text } from "./materials/text/Text";
import { assetTransferComponent } from "./helpers/component";

const clientStore = useClient();
const materialStore = useMaterial();
const assetStore = useAsset();
const schemaStore = useSchema();
init();
function init() {
	clientStore.canvas.scale = 0.8;
	schemaStore.stateExpression = {
		a: "1",
	};
	clientStore.init();
	materialStore.init();
	assetStore.init();
	schemaStore.init();
	const m = assetStore.assets.find((v) => v.title === "模版1");
	if (m) {
		const c = assetTransferComponent(m);
		const container = Container();
		const text = Text();
		container.components.push(text);
		c.components.push(container);
		schemaStore.createRootComponent(c);
		schemaStore.current = schemaStore.components[0].id;
	}
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
