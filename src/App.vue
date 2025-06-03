<script setup lang="ts">
import { useClient } from "./stores/useClient";
import { useMaterial } from "./stores/useMaterial";
import { useAsset } from "./stores/useAsset";
import { useSchema } from "./stores/useSchema";
import { Container } from "./materials/container/Container";
import { Text } from "./materials/text/Text";

const clientStore = useClient();
const materialStore = useMaterial();
const assetStore = useAsset();
const schemaStore = useSchema();
init();
function init() {
	clientStore.init();
	materialStore.init();
	assetStore.init();

	const testComponent = Container();
	const t1 = Text();
	const t2 = Text();
	testComponent.width = 200;
	testComponent.height = 100;
	t1.id = Date.now().toString() + "222";
	t2.id = (Date.now() + 1).toString();
	t2.left = 100;
	t2.top = 50;
	testComponent.components = [t1, t2];
	assetStore.assets.push({
		id: "test",
		title: "测试",
		cover: "",
		material: testComponent,
	});
	schemaStore.components.push({
		id: Date.now().toString(),
		name: "text",
		title: "文本",
		active: false,
		nestable: false,
		resizable: true,
		locked: false,
		hidden: false,
		snap: { v: [], h: [] },
		left: 15,
		top: 15,
		width: 100,
		height: 50,
		props: {
			text: "这是一段文本",
			color: "#ffffff",
		},
		components: [],
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
