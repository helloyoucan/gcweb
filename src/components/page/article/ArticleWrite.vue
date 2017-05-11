<template>
	<div class="editMd">
		<el-input size="large" placeholder="标题" v-model="article.title">
		</el-input>
		<div class="labels">
			<el-form ref="dialog.form" :model="article" label-width="80px">
				<el-form-item label="文章标签">
					<el-tag :key="tag.name" v-for="tag in article.tagSet" :closable="true" :close-transition="false" @close="handleClose(tag)">
						{{tag.name}}
					</el-tag>
					<el-autocomplete v-model="dialog.form.inputTag" :fetch-suggestions="querySearchTag" placeholder="请输入标签" :trigger-on-focus="false" @select="handleSelect" ref="saveTagInput" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-autocomplete>
					<el-button @click="handleInputConfirm">添加</el-button>
				</el-form-item>
				<input type="text" style="display: none;">
			</el-form>
		</div>
		<div id="editormd"></div>
		<div class="submit">
			<el-button @click="cancel">取消</el-button>
			<el-button :loading="saveLoading" type="primary" @click="save">保存文章</el-button>
			<el-button :loading="submitLoading" type="primary" @click="submitArticle">发布文章</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'articleWrite',
		props: ['article', 'page'],
		components: {

		},
		data() {
			return {
				saveLoading: false,
				submitLoading: false,
				content: '',
				editorObj: {},
				dialog: {
					inputAddLabelShow: false,
					inputNewLabelValue: '',
					control: false, //控制dialog的开关
					form: {
						inputTag: ''
					},
					restaurants: [],
				},

			}
		},
		methods: {
			cancel() {
				this.$emit('close');
			},
			save() {
				this.saveLoading = true;
				if(this.article.id) { //修改
					console.log("修改文章");
					console.log({
						"title": this.article.title,
						"tagSet": this.article.tagSet,
						"mdContent": testEditor.getMarkdown(),
					});
					this.$http.post('/admin/article', {
						"id": this.article.id,
						"title": this.article.title,
						"tagSet": this.article.tagSet,
						"mdContent": testEditor.getMarkdown(),
					}).then((response) => {
						//2.有结果返回后，返回的数据提交到state
						this.cancel();
						this.$emit('childGetArticles', this.page.currentPage, this.page.currentNum, this.page.searchText);
						this.$message.success('保存成功');
						this.$emit('close');
						this.saveLoading = false;
					}, (response) => {
						this.$message.error('保存失败');
					});

				} else { //保存
					console.log("保存文章");
					console.log({
						"id": this.article.id,
						"title": this.article.title,
						"tagSet": this.article.tagSet,
						"mdContent": testEditor.getMarkdown(),
					});
					this.$http.post('/admin/article', {
						"id": this.article.id,
						"title": this.article.title,
						"tagSet": this.article.tagSet,
						"mdContent": testEditor.getMarkdown(),
					}).then((response) => {
						//2.有结果返回后，返回的数据提交到state
						this.$emit('close');
						this.$emit('childGetArticles', this.page.currentPage, this.page.currentNum, this.page.searchText);
						this.$message.success('修改成功');
						this.$emit("getArticles");
						this.saveLoading = false;
					}, (response) => {
						this.$message.error('修改失败');
					});
				}
			},
			submitArticle() {
				//新增
				console.log("发表文章");
				console.log({
					"title": this.article.title,
					"tagSet": this.article.tagSet,
					"mdContent": testEditor.getMarkdown(),
				});
				this.submitLoading = true;
				this.$http.post('/admin/article/release', {
					"id": this.article.id,
					"title": this.article.title,
					"tagSet": this.article.tagSet,
					"mdContent": testEditor.getMarkdown(),
				}).then((response) => {
					//2.有结果返回后，返回的数据提交到state
					this.$emit('childGetArticles', this.page.currentPage, this.page.currentNum, this.page.searchText);
					this.$message.success('发表成功');
					this.$emit('close');
					this.submitLoading = false;
				}, (response) => {
					this.$message.error('发表失败');
				});

			},
			handleClose(tag) { //删除显示的标签
				var index = 0;
				for(let i = 0; i < this.article.tagSet.length; i++) {
					if(this.article.tagSet[i].name == tag.name) {
						index = i;
					}
				}
				this.article.tagSet.splice(index, 1);
			},
			handleInputConfirm() { //添加标签
				let inputTag = this.dialog.form.inputTag;
				if(inputTag) {
					this.article.tagSet.push({
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
			getAllTags() {//获取所有标签提供输入提示
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
		created() {
			this.getAllTags();
		}
	}
</script>

<style>
	/*.input-new-tag {
		width: 100px;
	}

	.el-dialog .el-tag {
		display: inline-block;
		font-size: 14px;
		height: 36px;
		line-height: 34px;
		padding: 0 7px;
		margin-right: 10px;
	}*/

	.labels .el-form-item {
		margin: 0;
		padding: 5px 0;
		background-color: #f7f7f7;
		width: 100%;
	}

	.ql-editor {
		min-height: 500px;
	}

	.editMd .el-input__inner {
		border-radius: 0;
	}

	.editormd {
		/*border-top: none;*/
	}

	.submit {
		/*text-align: center;*/
	}
</style>