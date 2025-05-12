import { zeroAdd } from "./conversion";

// 日期格式化
export const datetimeFormat = (date: Date | number | string, format = "Y-M-D h:m:s") => {
	const oDate = new Date(date);
	let res = "";
	for (let i = 0; i < format.length; i++) {
		switch (format[i]) {
			case "Y":
				res += oDate.getFullYear();
				break;
			case "M":
				res += zeroAdd(oDate.getMonth() + 1);
				break;
			case "D":
				res += zeroAdd(oDate.getDate());
				break;
			case "h":
				res += zeroAdd(oDate.getHours());
				break;
			case "m":
				res += zeroAdd(oDate.getMinutes());
				break;
			case "s":
				res += zeroAdd(oDate.getSeconds());
				break;
			default:
				res += format[i];
				break;
		}
	}
	return res;
};
