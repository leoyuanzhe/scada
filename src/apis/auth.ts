import { useUser } from "@/stores/useUser";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

// axios.defaults.headers = { xxx: "xxx", … }; // 默认请求头
// axios.defaults.withCredentials = true; // 发送请求携带cookie
export const pending = new Map(); // 正在请求的列表
export const instance = axios.create({
	// baseURL: baseURL, // api地址（如使用代理服务器则不需要配置）
	timeout: 10000, // 超时时间--超过时间自动认为请求失败
	// headers: { xxx: "xxx" }, // 设置默认请求头
	// 配置默认请求的数据格式，axios默认发送的是json数据，所以请求为json格式不需要配置（需要将transformRequest也注释掉），而不是json格式则需要配置
	// transformRequest: [
	/*
            x-www格式数据使用此方法（?a=1&b=2）
        */
	// function (data, headers) {
	//     let str = "";
	//     for (let key in data) {
	//         str += key + "=" + data[key] + "&";
	//     }
	//     return str.slice(0, str.length - 1);
	// },
	/*
            FormData格式数据使用此方法
        */
	// function (data, headers) {
	//     let fd = new FormData();
	//     for (let key in data) {
	//         fd.append(key, data[key]);
	//     }
	//     return fd;
	// },
	// ],
});
instance.interceptors.request.use(
	function (config) {
		const pendingInfo = getPendingInfo(config);
		const controller = new AbortController();
		const userStore = useUser();
		!pending.has(pendingInfo) ? pending.set(pendingInfo, controller) : controller.abort();
		config.signal = controller.signal;
		config.headers["Authorization"] = "Bearer " + userStore.token;
		return config;
	},
	function (error) {
		return Promise.resolve(error);
	}
);
instance.interceptors.response.use(
	function (response) {
		pending.delete(getPendingInfo(response.config));
		return response;
	},
	function (error) {
		pending.delete(getPendingInfo(error.config));
		return Promise.resolve(error);
	}
);
function getPendingInfo(config: AxiosRequestConfig) {
	return [config.method, config.url].join("&");
}

export const getA = (params: { a: string }) => instance.get("/xxx", { params });
export const postB = (params: { b: string }) => instance.post("/xxx", params);
