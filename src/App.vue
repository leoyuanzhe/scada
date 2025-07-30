<script setup lang="ts">
import { useClient } from "./stores/useClient";
import { useMaterial } from "./stores/useMaterial";
import { useAsset } from "./stores/useAsset";
import { useSchema } from "./stores/useSchema";
import { Container } from "./materials/container/Container";
import { Text } from "./materials/text/Text";
import { assetTransferComponent } from "./helpers/schema";

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
		const t1 = Text();
		const t2 = Text();
		t2.layout.left = 200;
		t2.layout.top = 250;
		container.components.push(t1);
		container.components.push(t2);
		c.components.push(container);
		c.props.backgroundColor = "#333";
		schemaStore.createRootComponent(c);
		schemaStore.currentRootId = schemaStore.components[0].id;
	}
	const t1 = Text();
	const t2 = Text();
	t1.title = "t1";
	t1.layout.top = 300;
	t2.title = "t2";
	t2.layout.top = 400;
	schemaStore.createComponent(t1);
	schemaStore.createComponent(t2);
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
