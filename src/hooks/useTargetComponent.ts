import { computed, ref } from "vue";
import { useSchema } from "@/stores/useSchema";

const componentId = ref("");
const component = computed(() => {
	const schemaStore = useSchema();
	if (componentId.value) {
		return schemaStore.activedFlatComponents.find((v) => v.id === componentId.value) || null;
	} else if (schemaStore.activedFlatComponents.length == 0) {
		componentId.value = "";
		return null;
	} else if (schemaStore.activedFlatComponents.length === 1) {
		componentId.value = schemaStore.activedFlatComponents[0].id;
		return schemaStore.activedFlatComponents[0];
	} else {
		componentId.value = schemaStore.activedFlatComponents[schemaStore.activedFlatComponents.length - 1].id;
		return schemaStore.activedFlatComponents[schemaStore.activedFlatComponents.length - 1];
	}
});

export const useTargetComponent = () => ({ componentId, component });
