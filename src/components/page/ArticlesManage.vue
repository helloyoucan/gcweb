<template>
	<div>
		<div class="secction diyscrollbar">
			<v-list-top placeholder="输入文章名/标签字查找" btnText="添加文章" @addBtn="addArticle" @search="searchArticleAction">
			</v-list-top>
			<v-articles-list @del="delArticle" @childGetArticles="getArticles" @publish="publishArtcile" @amend="amendArticle" @read="readArticle" :page="page" :articles="articlesList">
			</v-articles-list>
		</div>
		<el-dialog :title="dialog.title" @close="closeDialog" v-model="dialog.control" top="10px" size="full">
			<v-article-write @childGetArticles="getArticles" :page="page" @close="closeDialog" :article="dialog.article">
			</v-article-write>
		</el-dialog>
	</div>
</template>

<script>
	import vArticleWrite from './article/ArticleWrite.vue'
	import vListTop from './public/ListTop.vue'
	import vArticlesList from './article/ArticlesList.vue'
	export default {
		name: 'articlesManage',
		components: {
			vArticleWrite,
			vListTop,
			vArticlesList
		},
		data() {
			return {
				dialog: {
					article: {},
					title: '',
					control: false, //控制dialog的显示与关闭
				},
				articlesList: [],
				page: {
					currentPage: 1, //当前页
					totalCourses: 0, //总条数
					currentNum: 30, //每页多少条
					searchText: '',
				}
			}
		},
		created() {
			this.getArticles(this.page.currentPage, this.page.currentNum, this.page.searchText);
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
			getArticles(page, rows, search) { //获取数据
				this.currentNum = rows;
				this.$http.get("../../../../static/testData/articles.json?searchStr=" + search + "&page=" + (page - 1) + "&size=" + rows).then((response) => {
					this.articlesList = response.data;
				}, (response) => {
					this.$message.error('获取文章失败');
				});

			},
			publishArtcile(a) {
				this.$http.post('/admin/article/release', {
					"id": a.id,
					"title": a.title,
					"tagSet": a.tagSet,
					"mdContent": a.mdContent,
				}).then((response) => {
					//2.有结果返回后，返回的数据提交到state
					this.getArticles(this.page.currentPage, this.page.currentNum, this.page.searchText);
					this.$message.success('发表成功');

				}, (response) => {
					this.$message.error('发表失败');
				});
			},
			readArticle() {

			},
			addArticle() { //显示添加的dialog
				this.dialog.article = {
					id: '',
					title: '',
					tagSet: [],
					state: 1,
					content: '',
				};
				this.openDialog();
				this.dialog.title = "添加文章";
				createdEditormd('editormd', ''); //初始化Editor.md
				setTimeout(function() {
					testEditor.clear();
					testEditor.insertValue("")
				}, 100);//延迟加入任务队列

			},
			amendArticle(article) { //显示修改的dialog
				this.dialog.article = article;
				this.openDialog();
				this.dialog.title = "修改文章";
				createdEditormd('editormd', JSON.parse(JSON.stringify(article.mdContent))); //初始化Editor.md
				setTimeout(function() {
					testEditor.clear();
					testEditor.insertValue(JSON.parse(JSON.stringify(article.mdContent)));
				}, 100)//延迟加入任务队列

			},
			delArticle(article) {
				this.$confirm('此操作将永久删除' + article.title + ', 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.delete("/admin/article/" + article.id).then((response) => {
						if(response.data) {
							this.$message.success('删除成功');
							this.getArticles(this.page.currentPage, this.page.currentNum, this.page.searchText);
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
			searchArticleAction(searchKey) { //搜索按钮

			},
			closeDialog() {
				this.dialog.control = false;
			},
			openDialog() {
				this.dialog.control = true;
			},
		},
	}
</script>

<style>

</style>