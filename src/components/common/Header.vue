<template>
	<header>
		<nav>
			<div class="nav-title">
				后台管理
			</div>
			<div class="user_info">
				<img :src="user.icon" />
				<el-dropdown trigger="click">
					<span class="el-dropdown-link">
      				  {{user.name}}
      				  <i class="el-icon-caret-bottom el-icon--right"></i>
      				</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>
							<a href="/logout">退出</a>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</nav>
	</header>
</template>

<script>
	var iconImg = require("../../assets/img/user-icon.jpg");
	export default {
		name: 'Header',
		data() {
			return {
				user: {
					name: "Admin",
					icon: iconImg
				}
			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	header {
		background-color: #324157;
		width: 100%;
		height: 60px;
	}

	.nav-title {
		float: left;
		width: 90px;
		height: 60px;
		color: white;
		line-height: 60px;
		font-size: 22px;
		padding: 0 0 0 10px;
	}

	.user_info {
		float: right;
		font-size: 0;
		padding-right: 10px;
	}

	.user_info img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		padding: 10px 5px;
	}

	.user_info div {
		cursor: pointer;
		float: right;
		color: white;
		font-size: 16px;
		line-height: 60px;
	}

	.el-icon-caret-bottom {
		color: #D3DCE6;
		font-size: 12px;
	}
</style>