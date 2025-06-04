import { computed, ref } from "vue";
import { useSchema } from "@/stores/useSchema";

const componentId = ref("");
const component = computed(() => {
	const schemaStore = useSchema();
	if (schemaStore.targetComponentId) {
		return schemaStore.activeFlatComponents.find((v) => v.id === schemaStore.targetComponentId) || null;
	} else if (schemaStore.activeFlatComponents.length == 0) {
		schemaStore.targetComponentId = "";
		return null;
	} else if (schemaStore.activeFlatComponents.length === 1) {
		schemaStore.targetComponentId = schemaStore.activeFlatComponents[0].id;
		return schemaStore.activeFlatComponents[0];
	} else {
		schemaStore.targetComponentId = schemaStore.activeFlatComponents[schemaStore.activeFlatComponents.length - 1].id;
		return schemaStore.activeFlatComponents[schemaStore.activeFlatComponents.length - 1];
	}
});

export const useTargetComponent = () => ({ componentId, component });
