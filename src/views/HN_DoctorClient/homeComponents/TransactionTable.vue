<template>
  <div style="width: 100%;">
    <div class="Index_header">
      <h3 class="Index_header_title">
        特别关心
      </h3>
      <router-link to="/Patient/PatientList">
        <el-button type="primary" v-if="!total" style="margin-left: 20px;">添加患者</el-button>
      </router-link>
    </div>

    <el-table
      :data="list"
      border highlight-current-row
    >
      <el-table-column label="姓名" prop="patientName" align="center">
      </el-table-column>
      <el-table-column label="特别关心标签" align="center">
        <template slot-scope="scope">
          <el-tag> {{scope.row.gzTag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="patientSex" align="center" >
      </el-table-column>
      <el-table-column label="年龄" prop="patientAge" align="center" >
      </el-table-column>
      <el-table-column prop="icdName" label="疾病名称/病种" align="center"  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address" label="档案" align="center"  >
        <template slot-scope="scope">
          <el-button type="primary" @click="wayButton(scope)" size="mini">档案</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container" v-if="total">
      <el-pagination  @current-change="homeCurrentPage" :current-page.sync="pager" :page-size="limit" layout="total,prev, pager, next"
                      :total="total">
      </el-pagination>
    </div>
    <!-- 就诊档案 -->
    <patient-file
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :show-record-link="true"
      :task-id="taskId"
      v-on:refreshData="refreshList"
      ref="patientFile"
    ></patient-file>
  </div>
</template>

<script>
import { CommonAPI } from 'HNDC_API/common';
import patientFile from 'HNDC/common/patientFile';
export default {
  data() {
    return {
      list: null,
      patientId: '',
      visitOrderId: '',
      taskId: '',
      pager: 1,
      limit: 8,
      total: 0
    };
  },
  props: ['token'],
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      };
      return statusMap[status];
    }
  },
  components: {
    patientFile
  },
  created() {
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    /**
     * 刷新当前列表数据--特别关注切换后--子组件调用
     * @function refreshList
     */
    refreshList() {
      this.fetchData();
    },
    /**
     *@description 获取特别关心患者列表数据
     *@function fetchData
     */
    fetchData() {
      this.list = null;
      CommonAPI.patientList({
        limit: this.limit,
        pager: this.pager,
        adminId: this.token,
        gz: 1
      }).then(res => {
        this.list = res.data;
        this.total = res.count;
      });
    },
    /**
     * @description 分页
     * @function homeCurrentPage
     * @param page 第几页
     */
    homeCurrentPage(page) {
      this.pager = page;
      this.fetchData();
    },
    /**
     *@description获取记录信息  档案 按钮
     * @function wayButton
    */
    wayButton(scope) {
      this.patientId = scope.row.hzxxId;
      this.taskId = scope.row.taskId;
      this.visitOrderId = scope.row.id;
      setTimeout(() => {
        this.$refs.patientFile.toggleShowModal();
      }, 0);
    }
  }
};
</script>
<style lang="scss" scoped>
  .pagination-container{
    background-color: white;
    padding: 15px;
    margin-top: 0;
  }
  .Index{
    &_header{
      border-bottom: 1px solid #f1f1f1;
      box-sizing: border-box;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      padding-bottom: 15px;
      &_title{
        margin: 0;
        font-size: 16px;
        color: #555;
      }
    }
  }
</style>
