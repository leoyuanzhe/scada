import type { Material, MaterialWithLayout } from "./Material";

export interface Asset {
	id: string;
	title: string;
	cover: string;
	categories: string[];
	material: Material | MaterialWithLayout;
}
