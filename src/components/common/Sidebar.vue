<template>
	<el-menu class="diyscrollbar" :default-active="onRoutes" @select="handleSelect"  unique-opened router>
		<el-submenu index="user">
			<template slot="title"><i class="el-icon-menu"></i>用户管理</template>
			<el-menu-item index="UserInfoManage">信息管理</el-menu-item>
			<el-menu-item index="PermissionsManage">权限管理</el-menu-item>
		</el-submenu>
		<el-menu-item index="CourseManage">
			<i class="el-icon-setting"></i>课程管理
		</el-menu-item>
		<el-menu-item index="ArticlesManage">
			<i class="el-icon-document"></i>文章管理
		</el-menu-item>
		<el-menu-item index="TagsManage">
			<i class="el-icon-star-on"></i>标签管理
		</el-menu-item>
	</el-menu>
</template>

<script>
	export default {
		name:"Sidebar",
		computed: {
			onRoutes() {
				return this.$route.path.replace('/', '');
			}
		},
		methods: {
			handleSelect(key, keyPath) {
				var key_arr = {
					user: "用户管理",
					UserInfoManage: "信息管理",
					PermissionsManage: "权限管理",
					CourseManage: "课程管理",
					ArticlesManage: "文章管理",
					TagsManage: "标签管理",
				};
				var text_arr=[];
				for(var i=0,l=keyPath.length;i<l;i++){
					text_arr.push(key_arr[keyPath[i]]);
				}
				this.$emit('childSetBreadcrumb', text_arr)
			}
		}
	}
</script>

<style>
	.el-menu {
		height: 100%;
		background-color: white!important;
		overflow: auto;
	}
</style>