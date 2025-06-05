<script setup lang="ts">
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "../../hooks/useDragger";
import { computed, useTemplateRef } from "vue";
import { useTargetComponent } from "@/hooks/useTargetComponent";

const schemaStore = useSchema();
const targetComponent = useTargetComponent();
const dragger = useDragger();
const oMenuBarEdit = useTemplateRef("oMenuBarEdit");
const moveOutDisabled = computed(() => {
	return schemaStore.activeFlatComponents.every((component) => {
		const parent = schemaStore.findParent(component.id);
		return parent && schemaStore.isSchema(parent);
	});
});
</script>

<template>
	<div class="menu-bar">
		<div class="logo">L</div>
		<menu class="menu">
			<li ref="oMenuBarEdit" v-if="schemaStore.activeFlatComponents.length">
				<button popovertarget="menu-bar-edit">编辑</button>
			</li>
		</menu>
		<Teleport to="body">
			<menu
				v-if="schemaStore.activeFlatComponents.length"
				id="menu-bar-edit"
				class="menu-popover"
				popover="auto"
				:style="{ left: oMenuBarEdit?.getBoundingClientRect().left + 'px', top: (oMenuBarEdit?.getBoundingClientRect().top ?? 0) + 40 + 'px' }"
			>
				<li><button :disabled="schemaStore.activeFlatComponents.every((v) => v.locked)" @click="schemaStore.activeFlatComponents.forEach((v) => (v.locked = true))">锁定</button></li>
				<li><button :disabled="schemaStore.activeFlatComponents.every((v) => !v.locked)" @click="schemaStore.activeFlatComponents.forEach((v) => (v.locked = false))">解锁</button></li>
				<li><button :disabled="schemaStore.activeFlatComponents.every((v) => !v.hidden)" @click="schemaStore.activeFlatComponents.forEach((v) => (v.hidden = false))">显示</button></li>
				<li><button :disabled="schemaStore.activeFlatComponents.every((v) => v.hidden)" @click="schemaStore.activeFlatComponents.forEach((v) => (v.hidden = true))">隐藏</button></li>
				<li><button class="danger" @click="schemaStore.activeFlatComponents.forEach((v) => schemaStore.removeComponent(v.id)), dragger.computedSelector()">删除</button></li>
				<hr />
				<li>
					<button>加入分组</button>
					<menu>
						<li>
							<button v-for="v in schemaStore.flatComponents.filter((v) => v.nestable)" :key="v.id" @click="schemaStore.joinGroup(targetComponent.componentId.value, v.id)">{{ v.title }}</button>
						</li>
					</menu>
				</li>
				<li><button :disabled="moveOutDisabled" @click="schemaStore.activeFlatComponents.forEach((v) => schemaStore.moveOut(v.id))">移出分组</button></li>
				<li><button :disabled="schemaStore.activeFlatComponents.every((v) => !v.components.length)" @click="schemaStore.activeFlatComponents.forEach((v) => schemaStore.flatChindrenToSchema(v.id))">展开子组件到根组件</button></li>
			</menu>
		</Teleport>
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
		> li {
			position: relative;
			> button {
				padding: 0 14px;
				font-size: 12px;
				line-height: 40px;
				transition: background-color 0.2s;
			}

			&:hover {
				> button {
					background-color: #232323;
				}
			}
		}
	}
}
.menu-popover {
	position: fixed;
	width: 200px;
	flex-direction: column;
	background-color: #333;
	border-radius: 4px;
	box-shadow: 0 0 3px 1px #666;
	z-index: 9;
	li {
		position: relative;
		button {
			padding: 0 14px;
			width: 100%;
			font-size: 12px;
			line-height: 30px;
			text-align: left;
			transition: background-color 0.2s;
			&.danger {
				color: var(--danger-color);
			}
		}
		menu {
			position: absolute;
			left: 100%;
			top: 0;
			width: 200px;
			display: none;
			flex-direction: column;
			background-color: #333;
			border-radius: 4px;
			box-shadow: 0 0 3px 1px #666;
			z-index: 9;
		}
		&:hover {
			button:not(:disabled) {
				background-color: #232323;
			}
			menu {
				display: flex;
			}
		}
	}
	hr {
		width: 100%;
		border-color: #666;
	}
}
</style>
