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
	testComponent.props.width = 200;
	testComponent.props.height = 100;
	t1.id = Date.now().toString() + "222";
	t2.id = (Date.now() + 1).toString();
	t2.props.left = 100;
	t2.props.top = 50;
	testComponent.components = [t1, t2];
	assetStore.assets.push({
		id: "test",
		title: "测试",
		cover: "",
		material: testComponent,
	});
	schemaStore.components.push({
		id: Date.now().toString(),
		key: "text",
		title: "文本",
		active: false,
		moveable: true,
		resizable: true,
		nestable: false,
		locked: false,
		hidden: false,
		snap: { v: [], h: [] },
		props: {
			left: 15,
			top: 15,
			width: 100,
			height: 50,
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
