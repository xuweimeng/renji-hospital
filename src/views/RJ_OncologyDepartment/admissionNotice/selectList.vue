<template>
  <div class="addList">
    <el-dialog
      title="选中患者"
      width="1000px"
      custom-class="addDg"
      :visible.sync="dialogFormVisible"
      :before-close="closeDialog">
      <el-table :data="gridData" height="490px">
        <el-table-column type="index" label="顺序" align="center"></el-table-column>
        <el-table-column property="name" label="姓名" align="center"></el-table-column>
        <el-table-column property="date" label="联系电话" align="center"></el-table-column>
        <el-table-column property="date" label="性别" align="center"></el-table-column>
        <el-table-column property="name" label="年龄" align="center"></el-table-column>
        <el-table-column property="date" label="导入时间" align="center"></el-table-column>
        <el-table-column property="address" label="疾病名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="审核" width="140" align="center">
  				<template slot-scope="scope">
  					<el-button @click="passBtn"
            type="danger"
            style="height:22px;width:52px;padding:0;margin:0;font-:13px;">移除</el-button>
  				</template>
  			</el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dialogFormVisible: false,
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],

      }
    },
    props: [
      'elDialog'
    ],
    methods: {
      closeDialog () {
        this.$emit('closeDialogFun', false)
      },
      passBtn () {
        console.log('移除')
      }
    },
    watch: {
      elDialog(old, new3) {
        this.dialogFormVisible = this.elDialog
      }
    }

  }
</script>

<style lang="scss">

</style>
