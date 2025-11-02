<script lang="ts" setup>
import { computed, type StyleValue } from "vue";
import type { Material } from "@/types/Material";
import type { Component } from "@/types/Component";
import { useClient } from "@/stores/useClient";
import { useMaterial } from "@/stores/useMaterial";
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "@/hooks/useDragger";
import { computedMousePosition, openComponentMenu } from "@/helpers/contextMenu";

interface Props {
	component: Component;
	relative?: boolean;
}
const clientStore = useClient();
const materialStore = useMaterial();
const schemaStore = useSchema();
const dragger = useDragger();
const props = withDefaults(defineProps<Props>(), {
	relative: false,
});
const styleV2 = computed(() => {
	const res: StyleValue = {};
	if (!props.relative) {
		res.position = "absolute";
	}
	if (props.component.layout) {
		res.left = props.component.layout.left + "px";
		res.top = props.component.layout.top + "px";
		res.width = props.component.layout.width + "px";
		res.height = props.component.layout.height + "px";
	}
	return res;
});
const RenderComponent = () =>
	(materialStore.materials.find((v) => v.key == props.component.key) as ReturnType<Material["render"]>)?.render(
		props.component
	);
</script>

<template>
	<Component
		:is="RenderComponent"
		:class="{
			component: true,
			root: schemaStore.isRoot(props.component.id),
			locked:
				!clientStore.previewing &&
				(((dragger.dataTransfer.dragStartAsset || dragger.dataTransfer.dragStartComponent) &&
					!props.component.nestable) ||
					props.component.locked),
			target: !clientStore.previewing && schemaStore.targetComponentId === props.component.id,
			moveable: schemaStore.getComponentLevel(props.component.id) === 2 && props.component.moveable,
			actived: !clientStore.previewing && props.component.actived,
		}"
		v-show="!props.component.hidden"
		:style="styleV2"
		@mousedown="dragger.componentOnMouseDown($event, props.component)"
		@dragover.prevent="dragger.componentOnDragOver($event, props.component)"
		@dragleave.stop="dragger.componentOnDragLeave(props.component)"
		@drop.stop="dragger.componentOnDrop($event, props.component)"
		@contextmenu.prevent.stop="openComponentMenu(computedMousePosition($event))"
	/>
</template>

<style lang="scss" scoped>
.component {
	transition: box-shadow 0.2s;
	&.root {
		&::after {
			content: none;
		}
	}
	&.locked {
		pointer-events: none;
	}
	&.actived {
		box-shadow: 0 0 1px 1px var(--primary-color);
	}
	&.target {
		box-shadow: 0 0 3px 1px var(--primary-color);
		&::after {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	&.moveable {
		&::after {
			cursor: move;
		}
	}
}
</style>
