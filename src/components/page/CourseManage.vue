<template>
	<div>
		<div class="secction diyscrollbar">
			<v-list-top placeholder="输入课程名查找" btnText="添加课程" @addBtn="addCourse" @search="searchCourseAction"></v-list-top>
			<v-courses-list @setSearchText="setSearchText" @setCurrentNum="setCurrentNum" @setCurrentPage="setCurrentPage" :page="page" :child-courses-list='coursesList' @sonDelCourse="fatherDelCourse" @childGetCourses="getCourses" @childAmendCourse="fatherAmendCourse"></v-courses-list>
		</div>
		<el-dialog :title="dialog.title" v-model="dialog.control" size="small">
			<el-form ref="dialog.form" :model="dialog.form" label-width="80px">
				<el-form-item label="课程名">
					<el-input v-model="dialog.form.name"></el-input>
				</el-form-item>
				<el-form-item label="课程简介">
					<el-input type="textarea" :rows="3" v-model="dialog.form.description"></el-input>
				</el-form-item>
				<el-form-item label="课程提示">
					<el-input type="textarea" :rows="3" v-model="dialog.form.prompt"></el-input>
				</el-form-item>
				<el-form-item label="课程图片">
					<el-upload name="editormd-image-file" class="avatar-uploader" action="/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
						<img v-if="dialog.form.imgUrl" :src="dialog.form.imgUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
    			<el-button @click="dialog.control = false">取 消</el-button>
    			<el-button type="primary" @click="onSubmit">确 定</el-button>
 			 </span>
		</el-dialog>
	</div>
</template>

<script>
	import vCoursesList from './course/CoursesList.vue'
	import vListTop from './public/ListTop.vue'
	export default {
		name: 'CourseManage',
		components: {
			vListTop,
			vCoursesList,
		},
		data() {
			return {
				dialog: {
					title: '',
					control: false, //控制dialog的显示与关闭
					form: {
						name: '', //课程名
						description: '', //课程简介
						prompt: '', //课程提示
						imgUrl: '', //课程图片
					},
				},
				coursesList: [],
				page: {
					currentPage: 1, //当前页
					totalCourses: 0, //总条数
					currentNum: 30, //每页多少条
					searchText: '',
				}

			}
		},
		created() {
			this.getCourses(this.page.currentPage, this.page.currentNum, this.page.searchText);
		},
		methods: {
			setCurrentPage(num) {
				this.page.currentPage = num;
			},
			setCurrentNum(num) {
				this.page.currentNum = num;
			},
			setSearchText(keyText) {
				this.page.searchText = keyText;
			},
			getCourses(page, rows, search) { //获取数据(页数，每页多少条，关键词)
				this.$http.get("../../../../static/testData/courses.json?name=" + search + "&page=" + (page-1) + "&rows=" + rows).then((response) => {
					this.coursesList = response.data;
					this.page.totalCourses = response.data.totalElements;
					this.setCurrentPage(page);
					this.setCurrentNum(rows);
					this.setSearchText(search);
				}, (response) => {
					this.$message.error('获取课程失败');
				});
			},
			addCourse() { //显示添加的dialog
				this.dialog.form = {
					name: '', //课程名
					description: '', //课程简介
					prompt: '', //课程提示
					imgUrl: '', //课程图片
				};
				this.dialog.control = true;
				this.dialog.title = "添加课程";
			},
			fatherAmendCourse(course) { //显示修改的dialog
				this.dialog.form = JSON.parse(JSON.stringify(course));
				this.dialog.control = true;
				this.dialog.title = "修改课程";
			},
			fatherDelCourse(id) {
				this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.delete("/admin/course/" + id).then((response) => {
						if(response.data.data) {
							this.$message.success('删除成功');
							this.getCourses(this.page.currentPage, this.page.currentNum, this.page.searchText);
						} else {
							this.$message.error('删除失败');
						}

					}, (response) => {
						this.$message.error('链接失败');
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			searchCourseAction(keyWord) { //搜索按钮
				this.searchText = keyWord;
				this.getCourses(this.page.currentPage, this.page.currentNum, this.page.searchText);
			},
			onSubmit() { //处理添加或修改课程
				if(!this.dialog.form.id) { //添加课程
					this.$http.post("/admin/course",
						JSON.parse(JSON.stringify(this.dialog.form))
					).then((response) => {
						if(response.data.status == 200) {
							this.dialog.control = false;
							this.$message.success('添加成功');
							this.getCourses(this.page.currentPage, this.page.currentNum, this.page.searchText);
						} else {
							this.$message.error('添加失败');
						}

					}, (response) => {
						this.$message.error('链接失败');
					});
				} else { //修改课程
					this.$http.put("/admin/course",
						JSON.parse(JSON.stringify(this.dialog.form))
					).then((response) => {
						if(response.data.status == 200) {
							this.dialog.control = false;
							this.$message.success('修改成功');
							this.getCourses(this.page.currentPage, this.page.currentNum, this.page.searchText);
						} else {
							this.$message.error('修改失败');
						}

					}, (response) => {
						this.$message.error('链接失败');
					});
				}

			},
			handleAvatarSuccess(file) {
				 this.dialog.form.imgUrl = file.url
			},
			beforeAvatarUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 4;
				if(!isLt2M) {
					this.$message.error('上传图片大小不能超过 4MB!');
				}
				return isLt2M;
			},
		},
	}
</script>

<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 100%;
		max-width: 300px;
		max-height: 169px;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #20a0ff;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100%;
		height: 100%;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 100%;
		height: 100%;
		max-width: 300px;
		max-height: 169px;
		display: block;
	}
</style>