<template>
	<div class="login-bg" :style="{'background-image':'url('+bgUrl+')'}">
		<div class="title">
			后台管理
		</div>
		<div class="login-panel" :class="{isLogin:isLogin}">
			<div class="top">
				<ul class="fixclear">
					<li>
						<a @click="switchSignin" href="javascript:;">注册</a>
					</li>
					<li class="active">
						<a @click="switchSignin" href="javascript:;">账号登陆</a>
					</li>
				</ul>
				<div class="switchBorder"></div>
			</div>
			<div class="login-form">
				<ul class="fixclear">
					<li>
						<div>
							<el-form :model="loginData" :rules="registerRules" ref="registerData">
								<!--<el-form-item prop="email">
									<el-input v-model="loginData.email" placeholder="邮箱" auto-complete="off"></el-input>
								</el-form-item>-->
								<el-form-item prop="username">
									<el-input type="text" placeholder="用户名" v-model="registerData.username" auto-complete="off"></el-input>
								</el-form-item>
								<el-form-item prop="password">
									<el-input type="password" placeholder="密码" v-model="registerData.password" auto-complete="off"></el-input>
								</el-form-item>
								<!--<el-form-item prop="checkPass">
									<el-input type="password" placeholder="确认密码" v-model="registerData.checkPass" auto-complete="off"></el-input>
								</el-form-item>-->
								<el-form-item>
									<el-button type="primary" :loading="isBtnRegister" @click="register('registerData')">注册</el-button>
								</el-form-item>
								<p>
									<a href="javascript:;">注册遇到问题？</a>
								</p>
							</el-form>
						</div>
					</li>
					<li>
						<div>
							<el-form :model="loginData" :rules="loginRules" ref="loginData">
								<el-form-item prop="username">
									<el-input type="text" placeholder="用户名" v-model="loginData.username" auto-complete="off"></el-input>
								</el-form-item>
								<el-form-item prop="password">
									<el-input type="password" placeholder="密码" v-model="loginData.password" auto-complete="off"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" :loading="isBtnLogin" @click="login('loginData')">登录</el-button>
								</el-form-item>
								<p>
									<a href="javascript:;">登陆遇到问题？(密码账号随便填)</a>
								</p>
							</el-form>
						</div>
					</li>
				</ul>
			</div>
		</div>

	</div>
</template>
<script>
	var bg = require('../../assets/img/login-bg.jpg');
	export default {
		data() {
			var checkUserName = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入用户名'));
				} else {
					callback();
				}
			};
			var checkPassWord = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入密码'));
				} else {
					callback();
				}

			};
			return {
				bgUrl: bg,
				isLogin: true,
				isBtnLogin: false,
				isBtnRegister: false,
				loginData: {
					'username': '',
					'password': '',
				},
				registerData: {
					'email': '',
					'username': '',
					'password': '',
					'checkPass': ''
				},
				loginRules: {
					'username': [{
						validator: checkUserName,
						trigger: 'blur,change'
					}],
					'password': [{
						validator: checkPassWord,
						trigger: 'blur,change'
					}],

				},
				registerRules: {

				}
			};
		},
		methods: {
			switchSignin() {
				this.isLogin = !this.isLogin;
			},
			login(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.isBtnLogin = !this.isBtnLogin;
						this.$router.push('/Content');
					} else {
						this.$message.error('登录失败');
						return false;
					}
				});
			},
			register(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.isBtnRegister = !this.isBtnRegister;
						//this.$router.push('/content');
					} else {
						this.$message.error('登录失败');
						return false;
					}
				});
			}
		},
	}
</script>
<style scoped>
	.login-bg {
		position: relative;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .1);
	}

	.title {
		width: 402px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -201px;
		margin-top: -211px;
		z-index: 999;
		font-size: 40px;
		text-align: center;
	}

	.login-panel {
		background-color: #fff;
		width: 352px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -176px;
		margin-top: -141px;
		z-index: 999;
		background: #fff;
		border-radius: 3px;
		vertical-align: middle;
		-webkit-box-shadow: rgba(0, 0, 0, 0.3) 0 0 50px;
		-moz-box-shadow: #000 0 0 50px;
		box-shadow: rgba(0, 0, 0, 0.3) 0 0 50px;
	}

	.top {
		background-color: #fff;
		height: 50px;
		border-top-left-radius: 3px;
		border-top-right-radius: 3px;
		border-bottom: 3px solid #f3f8ff;
	}

	.top ul {
		width: 100%;
	}

	.top li {
		width: 50%;
		float: left;
	}

	.top li a {
		cursor: pointer;
		display: inline-block;
		line-height: 50px;
		text-align: center;
		color: #333;
		font-size: 16px;
		width: 80%;
		margin: 0 10%;
	}

	.switchBorder {
		width: 156px;
		margin: 0 10px;
		border-bottom: 3px solid #337dfc;
		transition: transform ease .5s;
		transform: translateX(0);
	}

	.isLogin .switchBorder {
		transform: translateX(176px);
	}

	.login-form {
		overflow: hidden;
	}

	.login-form ul {
		width: 200%;
		background-color: #fff;
		/*transition: transform ease .5s;*/
		transform: translateX(0);
	}

	.isLogin .login-form ul {
		transform: translateX(-352px);
	}

	.login-form li {
		width: calc(50% - 40px);
		margin: 20px;
		float: left;
	}

	.login-form .el-button {
		width: 100%;
	}

	.fixclear {
		*zoom: 1;
	}

	.fixclear:after {
		display: block;
		content: "clear";
		height: 0;
		clear: both;
		overflow: hidden;
		visibility: hidden;
	}
</style>