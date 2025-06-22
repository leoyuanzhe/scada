import type { Material, MaterialWithLayout } from "./Material";

export interface Asset {
	id: string;
	title: string;
	cover: string;
	material: Material | MaterialWithLayout;
}
