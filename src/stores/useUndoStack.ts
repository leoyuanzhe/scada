import { defineStore } from "pinia";

type Stack = {
	undo: () => void;
	redo: () => void;
};

export const useUndoStack = defineStore("undoStack", {
	state() {
		return {
			stacks: [] as Stack[],
			current: -1,
		};
	},
	actions: {
		push(stack: Stack) {
			this.stacks.splice(this.current + 1);
			this.stacks.push(stack);
			this.current++;
			if (this.stacks.length > 20) {
				this.stacks.shift();
				this.current--;
			}
		},
		undo() {
			if (this.current > -1) {
				this.stacks[this.current].undo();
				this.current--;
			}
		},
		redo() {
			if (this.current < this.stacks.length - 1) {
				this.current++;
				this.stacks[this.current].redo();
			}
		},
	},
});
