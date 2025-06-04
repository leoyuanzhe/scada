<script setup lang="ts">
import { useSchema } from "@/stores/useSchema";
import { useDragger } from "../../hooks/useDragger";
import { computed } from "vue";
import { useTargetComponent } from "@/hooks/useTargetComponent";

const schemaStore = useSchema();
const targetComponent = useTargetComponent();
const dragger = useDragger();
const moveOutDisabled = computed(() => {
	const parent = schemaStore.findParent(targetComponent.componentId.value);
	return !(parent && !schemaStore.isSchema(parent));
});
const joinGroup = () => {
	schemaStore.joinGroup(targetComponent.componentId.value);
};
</script>

<template>
	<div class="menu-bar">
		<div class="logo">L</div>
		<menu>
			<li v-if="targetComponent.component.value">
				<button>编辑</button>
				<menu>
					<li><button :disabled="targetComponent.component.value.locked" @click="targetComponent.component.value.locked = true">锁定</button></li>
					<li><button :disabled="!targetComponent.component.value.locked" @click="targetComponent.component.value.locked = false">解锁</button></li>
					<li><button :disabled="!targetComponent.component.value.hidden" @click="targetComponent.component.value.hidden = false">显示</button></li>
					<li><button :disabled="targetComponent.component.value.hidden" @click="targetComponent.component.value.hidden = true">隐藏</button></li>
					<li><button @click="schemaStore.removeComponent(targetComponent.componentId.value), dragger.computedSelector()">删除</button></li>
					<hr />
					<li>
						<button @click="joinGroup()">加入分组</button>
						<menu>
							<li>
								<button v-for="v in schemaStore.flatComponents.filter((v) => v.nestable)" :key="v.id">{{ v.title }}</button>
							</li>
						</menu>
					</li>
					<li><button :disabled="moveOutDisabled" @click="schemaStore.moveOut(targetComponent.componentId.value)">移出分组</button></li>
					<li><button :disabled="!Boolean(targetComponent.component.value.components.length)" @click="schemaStore.flatChindren(targetComponent.componentId)">展开子组件</button></li>
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
