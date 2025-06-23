import { reactive } from "vue";
import type { MenuItem } from "@/types/ContextMenu";

const position = reactive({ left: 0, top: 0 });
const list = reactive<MenuItem[]>([]);

export const useContextMenu = () => ({ position, list });
