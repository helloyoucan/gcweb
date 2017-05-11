<template>
	<div class="home">
		<v-head></v-head>
		<v-sidebar v-on:childSetBreadcrumb="setBreadcrumb" class="sidebar"></v-sidebar>
		<div class="content">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item v-for="b in readcrumbs">{{b}}</el-breadcrumb-item>
			</el-breadcrumb>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import vHead from './Header.vue';
	import vSidebar from './Sidebar.vue';
	export default {
		name:"Home",
		components: {
			vHead,
			vSidebar
		},
		data() {
			return {
				readcrumbs: ['用户管理', '信息管理'],
			}
		},
		methods: {
			setBreadcrumb(readcrumb_arr) {
				this.readcrumbs = readcrumb_arr;
			}
		}
	}
</script>
<style scoped>
	.home {
		background-color: #eef1f6;
		width: 100%;
		height: 100%;
	}

	.sidebar {
		display: block;
		position: absolute;
		width: 250px;
		left: 0;
		height: calc(100% - 60px);
		height: -moz-calc(100% - 60px);
		height: -webkit-calc(100% - 60px);
	}

	.content {
		position: absolute;
		background-color: white;
		left: 265px;
		right: 15px;
		top: 75px;
		bottom: 15px;
	}

	.content>div:last-child {
		height: 100%;
	}
</style>