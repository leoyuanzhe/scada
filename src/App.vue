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
schemaStore.stateExpression = {
	a: "1",
};
schemaStore.init();
schemaStore.stateExpression.a = "2";
function init() {
	clientStore.init();
	materialStore.init();
	assetStore.init();
	const c1 = Container();
	const c2 = Container();
	c1.id = Date.now().toString() + "1";
	c2.id = Date.now().toString() + "2";
	c1.title = "小盒子";
	c2.title = "大盒子";
	const t1 = Text();
	const t2 = Text();
	const t3 = Text();
	t1.id = Date.now().toString() + "3";
	t2.id = Date.now().toString() + "4";
	t3.id = Date.now().toString() + "5";
	t2.layout!.left = 100;
	t2.layout!.top = 50;
	t3.layout!.left = 200;
	t3.layout!.top = 100;
	c1.layout!.left = 100;
	c1.layout!.top = 50;
	c2.layout!.height = 150;
	c1.components = [t2, t3];
	c2.components = [t1, c1];
	assetStore.assets.push({
		id: "test",
		title: "测试",
		cover: "",
		material: c2,
	});
	const text = Text();
	schemaStore.createComponent(text);
	const text2 = Text();
	text2.title = "文本2";
	text2.layout.left = 50;
	text2.layout.top = 200;
	text2.layout.width = 55;
	schemaStore.createComponent(text2);
	clientStore.grid.span = 20;
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
