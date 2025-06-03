<script setup lang="ts">
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "../../hooks/useDragger";
import { computed } from "vue";

const schemaStore = useSchema();
const dragger = useDragger();
const moveOutDisabled = computed(() => {
	const parent = schemaStore.findParentComponent(schemaStore.targetComponentId);
	return !(parent && "key" in parent && parent.key === "container");
});
const joinGroup = () => {
	schemaStore.joinGroup(schemaStore.targetComponentId);
};
</script>

<template>
	<div class="menu-bar">
		<div class="logo">L</div>
		<menu>
			<li v-if="schemaStore.targetComponent">
				<button>编辑</button>
				<menu>
					<li><button :disabled="schemaStore.targetComponent.locked" @click="schemaStore.targetComponent.locked = true">锁定</button></li>
					<li><button :disabled="!schemaStore.targetComponent.locked" @click="schemaStore.targetComponent.locked = false">解锁</button></li>
					<li><button :disabled="!schemaStore.targetComponent.hidden" @click="schemaStore.targetComponent.hidden = false">显示</button></li>
					<li><button :disabled="schemaStore.targetComponent.hidden" @click="schemaStore.targetComponent.hidden = true">隐藏</button></li>
					<li><button @click="schemaStore.removeComponent(schemaStore.targetComponentId), dragger.computedSelector()">删除</button></li>
					<hr />
					<li><button @click="joinGroup()">加入分组</button></li>
					<li><button :disabled="moveOutDisabled" @click="schemaStore.moveOut(schemaStore.targetComponentId)">移出分组</button></li>
					<li><button :disabled="!Boolean(schemaStore.targetComponent.components.length)" @click="schemaStore.flatChindren(schemaStore.targetComponentId)">展开子组件</button></li>
				</menu>
			</li>
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
	> menu {
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
			> menu {
				position: absolute;
				left: 0;
				top: 100%;
				width: 200px;
				display: none;
				flex-direction: column;
				background-color: #333;
				border-radius: 4px;
				overflow: hidden;
				box-shadow: 0 0 3px 1px #666;
				li {
					button {
						padding: 0 14px;
						width: 100%;
						font-size: 12px;
						line-height: 30px;
						text-align: left;
						transition: background-color 0.2s;
					}
					&:hover {
						button:not(:disabled) {
							background-color: #232323;
						}
					}
				}
				hr {
					width: 100%;
					border-color: #666;
				}
			}
			&:hover {
				> button {
					background-color: #232323;
				}
				> menu {
					display: flex;
				}
			}
		}
	}
}
</style>
