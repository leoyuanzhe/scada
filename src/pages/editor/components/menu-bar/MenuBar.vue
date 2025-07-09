<script setup lang="ts">
import {
	openFileMenu,
	openComponentMenu,
	computedTargetPosition,
	openSettingMenu,
	openEditMenu,
} from "@/helpers/contextMenu";
</script>

<template>
	<div class="menu-bar">
		<div class="logo">L</div>
		<menu class="menu">
			<button @click="openFileMenu(computedTargetPosition($event))">文件</button>
			<button @click="openSettingMenu(computedTargetPosition($event))">设置</button>
			<button @click="openEditMenu(computedTargetPosition($event))">编辑</button>
			<button @click="openComponentMenu(computedTargetPosition($event))">组件</button>
		</menu>
	</div>
</template>

<style scoped lang="scss">
.menu-bar {
	padding: 0 10px;
	background-color: #333;
	display: flex;
	align-items: center;
	.logo {
		margin-right: 10px;
		width: 26px;
		height: 26px;
		font-size: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #000;
		border-radius: 50%;
	}
	.menu {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: flex-start;
		button {
			padding: 0 14px;
			font-size: 12px;
			line-height: 40px;
			transition: background-color 0.2s;
			cursor: context-menu;
			&:hover {
				background-color: #232323;
			}
		}
	}
}
</style>
