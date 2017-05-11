<template>
	<div class="articlesList diyscrollbar">
		<div class="article" v-for="(a,index) in articles">
			<el-badge :value="a.state==0?'未发表':''" class="item">
				<div class="a-title" :title="a.title">{{a.title}}</div>
			</el-badge>
			<!--<div class="a-author">
				作者&nbsp;:&nbsp;{{a.author}}
			</div>-->
			<div class="a-time">
				发布时间&nbsp;:&nbsp;{{a.publishedTime}}
			</div>
			<!--<div class="a-views">
				浏览次数&nbsp;:&nbsp;{{a.views}}
			</div>-->
			<div class="a-content">
				内容摘要&nbsp;:&nbsp;{{getAbstracts(a.mdContent)}}
			</div>
			<div class="a-tags">
				文章标签&nbsp;:&nbsp;<br />
				<span v-for="tag in a.tagSet">
					{{tag.name}}
				</span>
			</div>
			<div class="a-operation">
				<el-button title="查看文章" @click="read(a)" type="info" icon="view"></el-button>
				<el-button title="发表文章" @click="publish(a)" type="success" icon="upload2"></el-button>
				<el-button title="编辑文章" @click="amend(a)" type="primary" icon="edit"></el-button>
				<el-button title="删除文章" @click="delArticle(a)" type="danger" icon="delete"></el-button>
			</div>
		</div>
		<div class="fixclear"></div>
		<div class="paging">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-sizes="[20, 60, 80, 100,500,1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="page.totalArticles">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { markdown } from 'markdown'
	import Vue from 'vue'
	export default {
		name: 'articlesList',
		props: ['articles','page'],
		components: {

		},
		data() {
			return {

			}
		},
		created() {

		},
		methods: {
			getAbstracts(mdContent) {//获取文章前面的200个字符并过滤
				return markdown.toHTML(mdContent).replace(/<[^>]+>/g, "").substring(0, 200);
			},
			handleSizeChange(val) {
				this.$emit('setCurrentNum', val);
				this.$emit('childGetArticles', this.page.currentPage, val, this.page.searchText);
			},
			handleCurrentChange(val) {
				this.$emit('setCurrentPage', val);
				this.$emit('childGetArticles', val, this.page.currentNum, this.page.searchText);
			},
			delArticle(a) {
				this.$emit('del', a);
			},
			publish(a){
				this.$emit('publish', a);
			},
			read(a) {
				this.$emit('read', a);
			},
			amend(a) {
				this.$emit('amend', a);
			}
		},
	}
</script>

<style>
	.articlesList {
		position: relative;
		padding: 5px 10px;
		overflow: auto;
		height: calc(100% - 66px);
	}

	.article {
		float: left;
		position: relative;
		width: 250px;
		margin: 7px;
		border: 1px solid #ccc;
	}

	.a-title {
		font-size: 20px;
		padding: 7px;
		width: 236px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		border-bottom: 1px solid #ccc;
	}

	.a-author,
	.a-time,
	.a-views,
	.a-content,
	.a-tags {
		font-size: 13px;
		line-height: 20px;
		padding: 1px 5px;
	}

	.article .el-badge__content.is-fixed {
		z-index: 3;
		right: -10px;
		top: -5px;
	}

	.a-content {
		display: -webkit-box !important;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}

	.a-tags {
		background-color: #fff;
	}

	.a-tags span {
		display: inline-block;
		font-size: 12px;
		border: 1px solid #20A0FF;
		padding: 1px 5px;
		margin: 1px 5px 1px 0;
		border-radius: 40px;
		cursor: pointer;
		color: #1D8CE0;
		max-width: 220px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.a-operation {
		padding: 5px;
	}

	.a-operation .el-button {
		margin-left: 5px;
		padding: 7px;
	}
</style>