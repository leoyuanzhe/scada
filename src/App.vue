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
	const c1 = Container();
	const c2 = Container();
	c1.id = Date.now().toString() + "1";
	c2.id = Date.now().toString() + "2";
	const t1 = Text();
	const t2 = Text();
	t1.id = Date.now().toString() + "3";
	t2.id = Date.now().toString() + "4";
	t2.props.left = 100;
	t2.props.top = 50;
	c1.components = [t2];
	c2.components = [t1, c1];
	assetStore.assets.push({
		id: "test",
		title: "测试",
		cover: "",
		material: c2,
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
