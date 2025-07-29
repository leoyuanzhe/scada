import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			name: "主页",
			path: "/",
			component: () => import("@/pages/index/Index.vue"),
			meta: {
				access: [],
			},
			children: [],
		},
		{
			name: "编辑器",
			path: "/editor",
			component: () => import("@/pages/editor/Editor.vue"),
			meta: {
				access: [],
			},
			children: [],
		},
		{
			name: "预览",
			path: "/preview",
			component: () => import("@/pages/preview/Preview.vue"),
			meta: {
				access: [],
			},
			children: [],
		},
		{
			name: "404",
			path: "/:patchMatch(.*)*",
			component: () => import("@/pages/not-found/NotFound.vue"),
			meta: {
				access: [],
			},
			children: [],
		},
	],
	scrollBehavior(_to, _from, savedPosition) {
		return savedPosition ? savedPosition : { top: 0 };
	},
});
router.beforeEach((_to, _from, next) => {
	next();
});
router.afterEach((_to, _from) => {});

export default router;
