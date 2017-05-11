<template>
	<div>
		<div class="secction diyscrollbar">
			<el-table :data="tableData" border>
				<el-table-column prop="userName" label="账号">
				</el-table-column>
				<el-table-column prop="permissions" label="权限">
				</el-table-column>
				<el-table-column label="操作" width="137">
					<template scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
					permissions: '1'
				}, {
					userName: '123456789',
					permissions: '2'
				}, {
					userName: '123456789',
					permissions: '3'
				}, {
					userName: '123456789',
					permissions: '4'
				}, ],
				currentPage: 1
			}
		},
		methods: {
			handleEdit(index, row) {
				console.log(index, row);
			},
			handleDelete(index, row) {
				console.log(index, row);
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				console.log(`当前页: ${val}`);
			},
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