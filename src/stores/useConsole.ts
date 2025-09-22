import { defineStore } from "pinia";

export const useConsole = defineStore("console", {
	state() {
		return {
			logs: [] as {
				type: "log" | "info" | "warn" | "error";
				message: string;
			}[],
		};
	},
	actions: {
		init() {
			const originalLog = console.log;
			const originalInfo = console.info;
			const originalWarn = console.warn;
			const originalError = console.error;
			console.log = (...args) => {
				this.logs.push({
					type: "log",
					message: transform(args),
				});
				originalLog(...args);
			};
			console.info = (...args) => {
				this.logs.push({
					type: "info",
					message: transform(args),
				});
				originalInfo(...args);
			};
			console.warn = (...args) => {
				this.logs.push({
					type: "warn",
					message: transform(args),
				});
				originalWarn(...args);
			};
			console.error = (...args) => {
				this.logs.push({
					type: "error",
					message: transform(args),
				});
				originalError(...args);
			};
			function transform(args: any[]) {
				return args
					.map((v) => {
						try {
							if (v instanceof Error) return v.stack;
							if (typeof v === "object") return JSON.stringify(v);
							if (typeof v === undefined) return v;
							return v.toString();
						} catch (error) {
							return "*";
						}
					})
					.join(" ");
			}
		},
	},
});
