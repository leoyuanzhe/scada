<script lang="ts" setup>
const props = defineProps({
    show: { type: Boolean, default: false }, // 是否显示模态框
    zIndex: { type: Number, default: 9 }, // 层级
    closeOnClickModal: { type: Boolean, default: true }, // 是否点击遮罩关闭
    backgroundColor: { type: String, default: "rgba(0, 0, 0, 0.5)" },
    backdropFilter: { type: String, default: "blur(5px) brightness(100%)" },
});
const emits = defineEmits(["update:show", "close"]);
// 点击模糊区域
const markClick = () => {
    if (props.closeOnClickModal) {
        emits("update:show", false);
        emits("close");
    }
};
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <dialog class="my-dialog" v-show="show" :style="{ zIndex, backgroundColor, backdropFilter }" @click.stop="markClick()">
                <slot></slot>
            </dialog>
        </Transition>
    </Teleport>
</template>

<style lang="scss" scoped>
.fade-enter-from {
    opacity: 0;
}
.fade-enter-active {
    transition: all 0.2s;
}
.fade-leave-to {
    opacity: 0;
}
.fade-leave-active {
    position: absolute;
    transition: all 0.2s;
}
.my-dialog {
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    border: none;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
