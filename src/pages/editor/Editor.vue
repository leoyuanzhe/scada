<script setup lang="ts">
import MenuBar from "./components/menu-bar/MenuBar.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import Renderer from "./components/renderer/Renderer.vue";
import Setter from "./components/setter/Setter.vue";
</script>

<template>
	<div class="editor">
		<MenuBar class="menu-bar" />
		<Sidebar class="sidebar" />
		<Renderer class="renderer" />
		<Setter class="setter" />
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
	grid-template-columns: 300px auto 400px;
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
