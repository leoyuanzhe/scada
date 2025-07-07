import { computed, ref } from "vue";
import { useSchema } from "@/stores/useSchema";

const componentId = ref("");
const component = computed(() => {
	const schemaStore = useSchema();
	if (componentId.value) {
		return schemaStore.activedFlatedComponents.find((v) => v.id === componentId.value) || null;
	} else if (schemaStore.activedFlatedComponents.length == 0) {
		componentId.value = "";
		return null;
	} else if (schemaStore.activedFlatedComponents.length === 1) {
		componentId.value = schemaStore.activedFlatedComponents[0].id;
		return schemaStore.activedFlatedComponents[0];
	} else {
		componentId.value = schemaStore.activedFlatedComponents[schemaStore.activedFlatedComponents.length - 1].id;
		return schemaStore.activedFlatedComponents[schemaStore.activedFlatedComponents.length - 1];
	}
});

export const useTargetComponent = () => ({ componentId, component });
