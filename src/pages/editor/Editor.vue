<script setup lang="ts">
import { reactive } from "vue";
import { useRuler } from "./hooks/useRuler";
import MenuBar from "./components/MenuBar.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import Renderer from "@/components/renderer/Renderer.vue";
import Setter from "./components/setter/Setter.vue";

const ruler = useRuler();
const layout = reactive({
	setterWidth: 400,
});
const onUpdateSetterWidth = (e: number) => {
	layout.setterWidth = e;
	ruler.drawRulerH();
};
</script>

<template>
	<div class="editor" :style="{ gridTemplateColumns: '300px auto ' + layout.setterWidth + 'px' }">
		<MenuBar class="menu-bar" />
		<Sidebar class="sidebar" />
		<Renderer class="renderer" />
		<Setter class="setter" :width="layout.setterWidth" @update:width="onUpdateSetterWidth($event)" />
	</div>
</template>

<style scoped lang="scss">
.editor {
	height: 100vh;
	display: grid;
	background-color: #232323;
	grid-template-areas:
		"menu-bar menu-bar menu-bar"
		"sidebar renderer setter";
	grid-template-rows: 40px auto;
	.menu-bar {
		grid-area: menu-bar;
		box-shadow: 0 0 3px 1px #666;
		z-index: 2;
	}
	.sidebar {
		grid-area: sidebar;
		box-shadow: 0 0 3px 1px #666;
		z-index: 1;
	}
	.renderer {
		grid-area: renderer;
	}
	.setter {
		grid-area: setter;
		box-shadow: 0 0 3px 1px #666;
		z-index: 1;
	}
}
</style>
