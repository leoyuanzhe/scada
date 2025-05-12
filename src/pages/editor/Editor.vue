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
	grid-template-areas:
		"toolbar toolbar toolbar"
		"property renderer setter";
	.toolbar {
		grid-area: toolbar;
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
