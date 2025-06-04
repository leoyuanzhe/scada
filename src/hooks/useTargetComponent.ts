import { computed, ref } from "vue";
import { useSchema } from "@/stores/useSchema";

const componentId = ref("");
const component = computed(() => {
	const schemaStore = useSchema();
	if (componentId.value) {
		return schemaStore.activeFlatComponents.find((v) => v.id === componentId.value) || null;
	} else if (schemaStore.activeFlatComponents.length == 0) {
		componentId.value = "";
		return null;
	} else if (schemaStore.activeFlatComponents.length === 1) {
		componentId.value = schemaStore.activeFlatComponents[0].id;
		return schemaStore.activeFlatComponents[0];
	} else {
		componentId.value = schemaStore.activeFlatComponents[schemaStore.activeFlatComponents.length - 1].id;
		return schemaStore.activeFlatComponents[schemaStore.activeFlatComponents.length - 1];
	}
});

export const useTargetComponent = () => ({ componentId, component });
