// 生成id
export const generateId = () => {
	return Math.random().toString(36).substring(2, 7);
};
// 延迟
export const delay = (time: number) => {
	return new Promise((resolve) => setTimeout(() => resolve(null), time));
};
