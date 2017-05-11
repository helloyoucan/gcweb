<template>
	<div id="courses-list" class="courses-list diyscrollbar fixclear" :class="{ hideScrollbar: isHideScrollbar }">
		<div class="course diyscrollbar" v-for="(c,courseIndex) in childCoursesList" :style="{top:readTop + 'px'}" :class="{ read: c.id==readCourseId }">
			<div class="close" @click="closeRead" @keyup.esc="closeRead"> <i class="el-icon-close"></i></div>
			<div class="c-title" :style="{'background-image':'url('+c.imgUrl+')'}">
				<h2>{{c.name&&c.name}}</h2>
			</div>
			<div class="c-describe">
				<div class="left">
					课程简介&nbsp;:&nbsp;
				</div>
				<div class="right">
					<p>{{c.description&&c.description}}</p>
				</div>
			</div>
			<div class="c-prompt">
				<div class="left">
					课程提示&nbsp;:&nbsp;
				</div>
				<div class="right">
					<p>{{c.prompt&&c.prompt}}</p>
				</div>
			</div>
			<div class="c-img">
				<div class="left">
					课程背景图&nbsp;:&nbsp;
				</div>
				<div class="right"><img :src="c.imgUrl" /></div>
			</div>
			<div class="c-operation">
				<el-button @click="readCourse(c)" title="查看课程" class="btn-c-read" icon="view" :plain="true" type="info"></el-button>
				<el-button @click="amendCourse(c)" title="修改课程信息" class="btn-c-edit" icon="edit" :plain="true" type="warning"></el-button>
				<el-button @click="delCourse(c)" title="删除课程" class="btn-c-del" icon="delete" :plain="true" type="danger"></el-button>
			</div>
			<div class="c-sections">
				<div class="cc-title">
					章节列表
					<el-button @click="switchSort()" type="text">{{btnSwitchSortText}}</el-button>
					<el-button @click="addChapter(c)" title="添加章" icon="plus">添加章</el-button>
				</div>

				<el-collapse :class="{isSwitchSort:isSwitchSort}">
					<el-collapse-item v-for="(ch,chapterIndex) in c.sections">
						<template slot="title">
							{{ch.name&&ch.name}}
							<el-button @click.stop="amendChapter(ch)" title="修改章" icon="edit" :plain="true" type="warning"></el-button>
							<el-button @click.stop="delChapter(ch)" title="删除章" icon="delete" :plain="true" type="danger"></el-button>
							<div class="sort-butGroup">
								<el-button @click.stop="moveUpChapter(c.sections,chapterIndex,courseIndex)" :disabled="chapterIndex==0" title="上移" icon="caret-top" :plain="true" type="info"></el-button>
								<el-button @click.stop="moveDowmChapter(c.sections,chapterIndex,courseIndex)" :disabled="chapterIndex==c.sections.length-1" title="下移" icon="caret-bottom" :plain="true" type="info"></el-button>
							</div>
						</template>
						<div class="ch-tags">
							<span v-for="t in ch.tags">
								{{t.name}}
							</span>
						</div>
						<div class="ch-describe">
							{{ch.description&&ch.description}}
						</div>
					</el-collapse-item>
				</el-collapse>
			</div>
		</div>
		<div class="null-course" v-show="showNullCourse">
		</div>
		<div class="fixclear"></div>
		<div class="paging">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-sizes="[20, 50, 80, 100,500,1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCourses">
			</el-pagination>
		</div>
		<el-dialog :title="dialog.title" v-model="dialog.control">
			<el-form label-width="70px" :model="dialog.form">
				<el-form-item label="章名称">
					<el-input v-model="dialog.form.name"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" :rows="3" v-model="dialog.form.description"></el-input>
				</el-form-item>
				<el-form-item label="文章标签">
					<el-tag :key="tag.name" v-for="tag in dialog.form.tags" :closable="true" :close-transition="false" @close="handleClose(tag)">
						{{tag.name}}
					</el-tag>
					<el-autocomplete v-model="dialog.form.inputTag" :fetch-suggestions="querySearchTag" placeholder="请输入标签" :trigger-on-focus="false" @select="handleSelect" ref="saveTagInput" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-autocomplete>
					<el-button @click="handleInputConfirm">添加</el-button>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
   				 <el-button @click="dialog.control = false">取 消</el-button>
   				 <el-button @click="onSubmit" type="primary">确 定</el-button>
  			</span>
		</el-dialog>
	</div>
</template>

<script>
	import Vue from 'vue'
	export default {
		name: 'courseList',
		components: {

		},
		props: ['childCoursesList', 'page'],
		data() {
			return {
				readCourseId: "", //课程id，用于点击查看后展开哪个课程
				isHideScrollbar: false, //包围课程的div是否有滚动条
				readTop: "", //控制查看课程时该div的top
				showNullCourse: false, //控制查看课程时添加一个空的div，避免course-list的高度变变化
				dialog: {
					control: false, //控制dialog的开关
					title: '',
					form: {
						id: '',
						name: '',
						description: '',
						tags: [],
						inputTag: '', //用于添加标签的input
					},
					restaurants: [],
				},
				isSwitchSort: false, //是否在排序
				btnSwitchSortText: '排序', //排序按钮Text

			};
		},
		created() {
			this.getAllTags();
		},
		methods: {
			handleSizeChange(val) {
				//console.log(`每页 ${val} 条`);
				this.$emit('setCurrentNum', val);
				this.$emit('childGetCourses', this.page.currentPage, val, this.page.searchText);
			},
			handleCurrentChange(val) {
				//this.currentPage = val;
				//console.log(`当前页: ${val}`);
				this.$emit('setCurrentPage', val);
				this.$emit('childGetCourses', val, this.page.currentNum, this.page.searchText);
			},
			showDialog() {
				this.dialog.control = true;
			},
			closeDialog() {
				this.dialog.control = false;
			},
			readCourse(course) { //查看课程
				this.readTop = this.$el.scrollTop;
				this.isHideScrollbar = this.showNullCourse = true;
				this.readCourseId = course.id;
				this.isSwitchSort = false;
				this.btnSwitchSortText = '排序';
			},
			closeRead() { //关闭查看课程
				this.isHideScrollbar = this.showNullCourse = false;
				this.readCourseId = '';
			},
			amendCourse(course) { //修改课程
				this.$emit('childAmendCourse', course); //执行父组件中监听修改的事件
			},
			delCourse(course) { //删除课程
				this.$emit('sonDelCourse', course.id);
			},
			switchSort() {
				this.btnSwitchSortText = this.isSwitchSort ? '排序' : '排序结束';
				this.isSwitchSort = !this.isSwitchSort;
			},
			addChapter(course) { //添加章
				this.dialog.form = {
					id: '',
					name: '',
					description: '',
					tags: [],
					inputTag: ''
				};
				this.showDialog();
			},
			amendChapter(ch) { //修改章
				this.dialog.form = JSON.parse(JSON.stringify(ch));
				this.dialog.form.inputTag = '';
				this.showDialog();
			},
			delChapter(ch) { //删除章
				this.$confirm('是否永久删除' + ch.name, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log("删除章vvv" + ch.id);
					this.$http.delete("/admin/section/" + ch.id).then((response) => {
						this.dialog.control = false;
						console.log(response);
						this.$emit('childGetCourses', this.page.currentPage, this.page.currentNum, this.page.searchText);
						this.$message.success('删除成功');
					}, (response) => {
						this.$message.error('删除失败');
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			moveUpChapter(chs, chapterIndex, courseIndex) { //章上移
				var tempChs = JSON.parse(JSON.stringify(chs));
				Vue.set(chs, chapterIndex, tempChs[chapterIndex - 1]);
				chs[chapterIndex].order = chapterIndex;
				Vue.set(chs, chapterIndex - 1, tempChs[chapterIndex]);
				chs[chapterIndex - 1].order = chapterIndex - 1;
			},
			moveDowmChapter(chs, chapterIndex, courseIndex) { //章下移
				var tempChs = JSON.parse(JSON.stringify(chs));
				Vue.set(chs, chapterIndex + 1, tempChs[chapterIndex]);
				chs[chapterIndex + 1].order = chapterIndex + 1;
				Vue.set(chs, chapterIndex, tempChs[chapterIndex + 1]);
				chs[chapterIndex].order = chapterIndex;
			},
			onSubmit() { //处理添加或修改章
				var se = JSON.parse(JSON.stringify(this.dialog.form));
				if(!this.dialog.form.id) { //添加章
					this.$http.post("/admin/section", {
						"courseId": this.readCourseId,
						"description": se.description,
						"id": se.id,
						"name": se.name,
						"tags": se.tags,
					}).then((response) => {
						this.dialog.control = false;
						this.$emit('childGetCourses', this.page.currentPage, this.page.currentNum, this.page.searchText);
						this.$message.success('添加成功');

					}, (response) => {
						this.$message.error('添加失败');
					});
				} else { //修改章
					this.$http.put("/admin/section", {
						"courseId": this.readCourseId,
						"description": se.description,
						"id": se.id,
						"name": se.name,
						"tags": se.tags,
					}).then((response) => {
						this.dialog.control = false;
						this.$emit('childGetCourses', this.page.currentPage, this.page.currentNum, this.page.searchText);
						this.$message.success('修改成功');

					}, (response) => {
						this.$message.error('修改失败');
					});
				}

			},

			handleClose(tag) { //删除显示的标签
				var index = 0;
				for(let i = 0; i < this.dialog.form.tags.length; i++) {
					if(this.dialog.form.tags[i].name == tag.name) {
						index = i;
					}
				}
				this.dialog.form.tags.splice(index, 1);
			},
			handleInputConfirm() { //添加标签
				let inputTag = this.dialog.form.inputTag;
				if(inputTag) {
					this.dialog.form.tags.push({
						"name": inputTag
					});
				}
				this.dialog.form.inputTag = '';
			},
			querySearchTag(queryString, callback) { //根据输入的查找标签
				var restaurants = this.dialog.restaurants;
				var results = queryString ? restaurants.filter(this.createFilterTag(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				callback(results);
			},
			createFilterTag(queryString) { //根据输入的标签过滤相关地1标签
				return(restaurant) => {
					return(restaurant.value.indexOf(queryString) === 0);
				};
			},
			handleSelect(item) { //点击筛选后的标签列表
				//console.log(item);
				this.handleInputConfirm();
			},
			getAllTags() { //获取所有标签提供输入提示
				this.$http.get('../../../../static/testData/tags.json').then((response) => {
					console.log(response.data);
					response.data.forEach((tag) => {
						this.dialog.restaurants.push({
							value: tag.name
						});
					});
					console.log(this.dialog.restaurants)
				}, (response) => {
					console.log("获取所有标签失败");
				});
			}
		},
	}
</script>

<style>
	.courses-list {
		position: relative;
		padding: 5px 10px;
		overflow: auto;
		height: calc(100% - 66px);
	}

	.courses-list.hideScrollbar {
		overflow-y: hidden;
	}

	.course {
		cursor: pointer;
		float: left;
		/*position: relative;*/
		overflow: hidden;
		border-radius: 3px;
		border: 1px solid #999;
		width: 250px;
		height: 154px;
		margin: 10px;
		background-color: white;
		transition: height ease .8s, width ease .8s, transform ease .3s;
	}

	.course:hover {
		transform: scale(1.1, 1.1);
	}

	.course.diyscrollbar::-webkit-scrollbar-thumb {
		background-color: #35A0F4;
	}

	.null-course {
		float: left;
		width: 250px;
		height: 154px;
		margin: 10px;
		/*background: #000000;*/
	}

	.close {
		opacity: 0;
		position: absolute;
		right: 0;
		top: 0;
		font-size: 16px;
		padding: 10px;
		width: 20px;
		height: 20px;
		text-align: center;
		cursor: pointer;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
		transition: opacity ease .8s;
	}

	.close:hover {
		color: #FF4949;
	}

	.close:active {
		color: #000000;
	}

	.c-title {
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	.c-title h2 {
		color: white;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 20px;
		font-weight: 200;
		padding: 10px;
		background-color: rgba(0, 0, 0, .5);
	}

	.course .left {
		float: left;
		width: 0;
		height: 19px;
		overflow: hidden;
		text-align: justify;
		text-align-last: justify;
		transition: width ease .8s;
	}

	.course .right {
		float: left;
		width: 100%;
		transition: width ease .8s;
	}

	.c-describe,
	.c-prompt,
	.c-img,
	.c-sections {
		overflow: hidden;
		font-size: 14px;
		padding: 10px 20px 0;
		height: 0;
		transition: height ease .8s;
	}

	.c-describe {
		height: 100px;
		padding-top: 20px;
	}

	.c-describe p,
	.c-prompt p {
		line-height: 22px;
		/*仅仅webkit内核(移动端多数为webkit内核)*/
		display: -webkit-box !important;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		/*行数*/
	}

	.c-describe p {
		width: 100%;
	}

	.c-img img {
		max-width: 200px;
		max-height: 120px;
	}

	.c-operation {
		position: relative;
		/*bottom: -100%;
		left: 0;
		right: 0;*/
		margin-top: 0px;
		background-color: #fff;
		border-top: 1px solid #ccc;
		text-align: center;
		transition: margin-top ease .3s;
		z-index: 99;
	}

	.course:hover .c-operation {
		/*bottom: 0;*/
		margin-top: -75px;
	}

	.c-operation .el-button {
		border-radius: 50%;
		width: 35px;
		height: 35px;
		padding: 10px;
		margin: 3px 15px;
		/*float: left;*/
	}
	/*章节列表*/

	.c-sections {
		/*display: none;*/
		/*padding: 10px;*/
	}

	.cc-title {
		font-size: 17px;
		border-bottom: 2px dotted #aaa;
		padding: 5px;
	}

	.cc-title .el-button:first-child {
		padding: 0;
		margin: 0 10px;
	}

	.cc-title .el-button:last-child {
		float: right;
		cursor: pointer;
		width: 90px;
		overflow: hidden;
		transition: width ease .8s;
		padding: 7px;
		margin-top: -6px;
		border-radius: 40px;
		color: #1D8CE0;
	}

	.courses-list .el-collapse {
		border: none;
		padding: 0 10px;
	}

	.courses-list .el-collapse-item__header {
		border: 0;
		border-bottom: 1px solid #dfe6ec;
	}

	.courses-list .el-collapse-item__header:hover {
		background-color: #dfe6ec;
	}

	.courses-list .el-collapse-item .el-button {
		float: right;
		border-radius: 50%;
	}

	.el-collapse-item {
		overflow: hidden;
	}

	.el-collapse-item .el-button {
		padding: 10px;
		margin: 4px 2px;
		margin-right: -100px;
		border: 1px solid #bfcbd9;
		transition: margin-right ease .8s;
	}

	.el-collapse-item:hover .el-button {
		margin-right: 2px;
	}

	.isSwitchSort .el-collapse-item:hover .el-button {
		margin-right: -100px;
	}

	.sort-butGroup {
		float: right;
		position: relative;
		height: 44px;
		width: 38px;
		margin-right: -150px;
		transition: margin-right ease .3s;
	}

	.isSwitchSort .sort-butGroup {
		margin-right: 0;
	}

	.sort-butGroup .el-button {
		position: absolute;
		margin: 0;
		border-radius: 0;
	}

	.sort-butGroup .el-button:hover {
		z-index: 2;
	}

	.sort-butGroup .el-button:hover,
	.sort-butGroup .el-button:active,
	.sort-butGroup .el-button:focus {
		border-color: #bfcbd9;
		color: #1f2d3d;
	}

	.sort-butGroup .el-button:first-child {
		padding-top: 3px;
		padding-bottom: 0px;
		border-radius: 44px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		top: 4px;
		border-bottom-width: 0;
	}

	.sort-butGroup .el-button:first-child:hover {
		border-bottom-width: 1px;
	}

	.sort-butGroup .el-button:last-child {
		padding-top: 0px;
		padding-bottom: 3px;
		bottom: 4px;
		border-radius: 44px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		border-top-width: 0;
	}

	.sort-butGroup .el-button:last-child:hover {
		border-top-width: 1px;
	}

	.ch-tags {
		padding: 0 0 10px;
	}

	.ch-tags span {
		display: inline-block;
		font-size: 13px;
		border: 1px solid #20A0FF;
		padding: 0px 10px;
		margin-right: 10px;
		border-radius: 40px;
		cursor: pointer;
		color: #1D8CE0;
	}

	.ch-describe {
		text-indent: 2em;
	}

	.paging {
		text-align: center;
		background-color: #fff;
		padding: 10px 0;
	}
	/**
	 * 查看单个课程时
	 * */

	.course.read {
		position: absolute;
		/*top: 0;*/
		left: 0;
		right: 0;
		bottom: 0;
		cursor: auto;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		border: 5px solid rgba(0, 0, 0, .6);
		border-radius: 0;
		overflow: auto;
		margin: 0;
		z-index: 3;
	}

	.read.course:hover {
		transform: scale(1, 1);
	}

	.read .close {
		opacity: 1;
	}

	.read .c-title {
		background-image: none!important;
	}

	.read .c-title h2 {
		padding: 10px 40px 10px 10px;
		color: #000;
		background-color: #fff;
	}

	.read .left {
		width: 100px;
	}

	.read .right {
		width: calc(100% - 110px);
		padding-left: 5px;
	}

	.read .c-describe {
		height: auto;
		padding-top: 10px;
	}

	.read .c-prompt {
		height: auto;
		overflow: auto;
	}

	.read .c-operation {
		display: none;
	}

	.read .c-img {
		height: 120px;
	}

	.read .c-sections {
		height: auto;
	}
</style>