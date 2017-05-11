import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		redirect: '/Login'
	}, {
		path: '/Login',
		component: resolve => require(['../components/page/Login.vue'], resolve)
	}, {
		path: '/Content',
		component: resolve => require(['../components/common/Content.vue'], resolve),
		children: [{
			path: '/',
			redirect: '/UserInfoManage'
		}, {
			path: '/CourseManage',
			component: resolve => require(['../components/page/CourseManage.vue'], resolve)
		}, {
			path: '/UserInfoManage',
			component: resolve => require(['../components/page/UserInfoManage.vue'], resolve)
		}, {
			path: '/PermissionsManage',
			component: resolve => require(['../components/page/PermissionsManage.vue'], resolve)
		}, {
			path: '/ArticlesManage',
			component: resolve => require(['../components/page/ArticlesManage.vue'], resolve)
		}, {
			path: '/TagsManage',
			component: resolve => require(['../components/page/TagsManage.vue'], resolve)
		}, ]

	}, ]
})