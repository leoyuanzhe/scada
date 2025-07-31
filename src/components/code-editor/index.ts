import { h, nextTick, render } from "vue";
import CodeEditor from "./CodeEditor.vue";

export default (value?: string): Promise<string | undefined> => {
	return new Promise((resolve, reject) => {
		const vNode = h(CodeEditor, {
			value: value ?? "",
			onCancel: () => {
				render(null, document.body);
				reject();
			},
			onConfirm: (e) => {
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
