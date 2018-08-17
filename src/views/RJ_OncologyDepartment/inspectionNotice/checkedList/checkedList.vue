<template>
  <div class="checkList">
    <!-- 已选择的检查项目 -->
    <el-dialog
      :visible.sync="infoShow2"
      width="840"
      title="检查详情"
      custom-class="infoShow"
      :before-close="closeList">
      <!-- 通知结果 -->
      <el-row v-if="$route.path==='/InResult'" class="vet-row">
        <el-col :span="6" class="bgColor">通知状态</el-col>
        <el-col :span="6"> &nbsp;{{checkListData.length?checkListData[0].statusStr: ''}}</el-col>
        <el-col :span="6" class="bgColor">通知时间</el-col>
        <el-col :span="6">&nbsp;{{checkListData.length?checkListData[0].dateVet: ''}}</el-col>
        <el-col :span="24" class="bgColor">通知结果</el-col>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          v-model="vetRemark">
        </el-input>
      </el-row>
      <!-- 表格 -->
      <el-table :data="checkListData" class="gridData" width="100%" border>
        <el-table-column property="brxm" label="姓名" align="center" ></el-table-column>
        <el-table-column property="mobile" label="联系方式" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column label="性别/年龄" align="center" width="115">
          <template slot-scope="scope">
            {{scope.row.brxb}} <span v-if="scope.row.brxb && scope.row.age">/</span> {{scope.row.age}}
          </template>
        </el-table-column>
        <el-table-column property="icdName" label="检查项目" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column property="locationName" label="检查地点" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column property="orderTime" label="检查时间" width="180" align="center" show-overflow-tooltip ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CheckedList',
  data() {
    return {
      vetRemark: ''
    }
  },
  props: [
    'checkListData',
    'infoShow2'
  ],
  mounted (){
  },
  methods: {
    closeList () {
      this.$emit('closeDialog', false)
    }
  },
  watch: {
    // 获取通知结果
    checkListData(newV, oldV) {
      if (newV.length) {
        this.vetRemark = newV[0].notPassRemark
      }
    }
  }
}
</script>
<style lang="scss">
// 检查项目
  .checkList {
    .infoShow {
      min-width: 800px;
      .el-dialog__header {
        border-bottom: 1px solid #eee;
        .el-dialog__title {
          font-size: 14px;
          color: #666;
        }
      }
      .el-dialog__body {
        padding: 10px 20px 30px;
        .vet-row {
          .el-col {
            margin-top: 10px;
            border: 1px solid #ccc;
            text-align: center;
            height: 40px;
            line-height: 40px;
          }
          .el-col:nth-of-type(2), .el-col:nth-of-type(3), .el-col:nth-of-type(4) {
            border-left: 0;
          }
          .el-col:nth-of-type(5) {
            border-bottom: 0;
          }
          .el-textarea {
            margin-bottom: 20px;
          }
        }
        .el-table{
          td {
            padding: 10px 0;
          }
        }
      }
    }
    .bgColor {
      background: #f5f7fa;
    }
  }
</style>