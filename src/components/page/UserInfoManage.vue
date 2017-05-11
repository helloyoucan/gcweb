<template>
	<div>
		<div class="secction diyscrollbar">
			<el-table :data="tableData" border>
				<el-table-column prop="userName" label="账号">
				</el-table-column>
				<el-table-column prop="email" label="邮箱">
				</el-table-column>
				<el-table-column label="操作" width="78">
					<template scope="scope">
						<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="paging">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
				</el-pagination>
			</div>

		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
					userName: '123456789',
					email: '123456789@qq.com'
				}, {
					userName: '123456789',
					email: '123456789@qq.com'
				}, {
					userName: '123456789',
					email: '123456789@qq.com'
				}, {
					userName: '123456789',
					email: '123456789@qq.com'
				}, ],
				currentPage: 1
			}
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				console.log(`当前页: ${val}`);
			},
			handleDelete(index, row) {
				console.log(index, row);
			}
		}
	}
</script>

<style>
	.el-table {
		margin: 5px;
		width: calc(100% - 10px);
	}

	.paging {
		text-align: center;
	}
</style>