export type MenuPosition = {
	left: number;
	top: number;
};
export type MenuItem = {
	type?: "" | "divider" | "warning" | "danger";
	label?: string;
	disabled?: boolean;
	remark?: string;
	onClick?: () => void;
	list?: MenuItem[];
};
