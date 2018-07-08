<template>
  <el-row class="tablePagination">
    <el-col :span="12" :offset="12">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total,prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-col>
  </el-row>
</template>
<script>
  export default {
    name: 'TablePagination',
    data () {
      return {
        currentPage: 1, // 当前页
        pp: 50
      }
    },
     props: [
      'total'
    ],
    methods: {
      /** 切换页码 */
      handleCurrentChange (val) {
        // console.log(val);

        this.$emit('currentPageFail', val)
      }
    },
  }
</script>
<style lang="scss">
  .tablePagination {
    height: 48px;
    .el-col {
      padding: 10px 0
    }
  }
</style>