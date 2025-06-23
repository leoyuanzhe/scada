export type MenuItem = {
	type?: "" | "divider" | "warning" | "danger";
	label?: string;
	disabled?: boolean;
	onClick?: () => void;
	list?: MenuItem[];
};
