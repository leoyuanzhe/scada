import { h, nextTick, render } from "vue";
import CodeEditor from "./CodeEditor.vue";

export default (value?: string): Promise<string | undefined> => {
	return new Promise((resolve) => {
		const vNode = h(CodeEditor, {
			value: value ?? "",
			onClose: (e) => {
				render(null, document.body);
				resolve(e);
			},
		});
		render(vNode, document.body);
		nextTick(() => {
			vNode.component!.exposed?.showModal();
		});
	});
};
