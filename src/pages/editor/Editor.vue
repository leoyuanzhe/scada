<script setup lang="ts">
import Toolbar from "./components/toolbar/Toolbar.vue";
import Property from "./components/property/Property.vue";
import Renderer from "./components/renderer/Renderer.vue";
import Setter from "./components/setter/Setter.vue";
</script>

<template>
	<div class="editor">
		<Toolbar class="toolbar" />
		<Property class="property" />
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
		"toolbar toolbar toolbar"
		"property renderer setter";
	grid-template-rows: 70px auto;
	grid-template-columns: 300px auto 400px;
	.toolbar {
		grid-area: toolbar;
		box-shadow: 0 0 3px 1px #666;
		z-index: 2;
	}
	.property {
		grid-area: property;
	}
	.renderer {
		grid-area: renderer;
	}
	.setter {
		grid-area: setter;
	}
}
</style>
