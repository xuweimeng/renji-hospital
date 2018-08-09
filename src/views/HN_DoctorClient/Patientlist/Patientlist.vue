<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input  placeholder="请输入患者姓名"  v-model.trim="searchParam.patientName"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >疾病名称</label>
        <el-input  placeholder="请输入疾病名称"  v-model.trim="searchParam.icdName"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >性别</label>
        <el-select class="filter-item" v-model="searchParam.sex" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <label class="radio-label">年龄</label>
        <el-input placeholder="0" v-model.trim="searchParam.fromAge"></el-input>
        <span class="input-separator">-</span>
        <el-input placeholder="99" v-model.trim="searchParam.endAge"></el-input>
      </li>
      <li class="common_search_single">
        <el-button type="primary" icon="el-icon-search"  @click="waySearchBtn"
                   :loading="params[0].loading || params[1].loading">查询</el-button>
      </li>
    </ul>
    <!-- tab切换 -->
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="item,index in params" :label="`${item.label}`" :key="index">
        <el-table
          :data="item.tableData"
          border highlight-current-row
          v-loading="item.loading"
        >
          <el-table-column label="姓名" align="center" prop="patientName">
            <template slot-scope="scope">
              <i class="iconfont" v-if="scope.row.islike==1">&#xe604;</i>
              {{scope.row.patientName}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="性别/年龄" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.patientSex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nation" label="民族" align="center">
          </el-table-column>
          <el-table-column prop="diagnoseTime" label="就诊日期" align="center">
          </el-table-column>
          <el-table-column prop="icdName" label="疾病名称/病种" align="center">
            <template slot-scope="scope">
              <el-tag>{{ scope.row.diagnosetype ==1?'门诊':'住院'}}</el-tag>
              {{scope.row.icdName}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" align="center" width="190">
            <template slot-scope="scope">
              <el-button type="primary" @click="wayButton(scope)" size="mini">档案</el-button>
              <el-button type="primary" @click="updateTelBtn(scope)" size="mini">修改手机号</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination  @current-change="handlePage" :current-page.sync="item.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                          :total="item.total" v-if="item.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 弹框 -->
    <!-- 就诊档案 -->
    <patient-file
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :show-record-link="false"
      :task-id="taskId"
      v-on:refreshData="refreshList"
      ref="patientFile"
    ></patient-file>
    <!--修改手机号 by yugou-->
    <update-tel
      :patient-id="patientId"
      ref="updateTel"></update-tel>
  </div>
</template>

<script>
/**
 * 患者列表
 * @module patientList
 */
import { CommonAPI } from 'HNDC_API/common';
import patientFile from 'HNDC/common/patientFile';
import updateTel from 'HNDC/dialog/patientList/updateTel';
import { mapGetters } from 'vuex';
const base_param = {
  page: 1,
  total: 0,
  loading: false,
  tableData: []
};
export default {
  name: 'PatientList',
  data() {
    return {
      hideInput: false, // 隐藏了搜索栏的方案名称
      searchParam: {
        patientName: '', // 患者姓名
        icdName: '', // 疾病类型
        sex: '', // 性别
        fromAge: '', // 搜索起始年龄
        endAge: '', // 搜索借宿年龄
        schemeName: '', // 方案名称
        limit: 10 // 每页条数
      },
      params: {
        0: {
          ...base_param,
          label: '全部患者',
          status: 0
        },
        1: {
          ...base_param,
          label: '特别关心',
          status: 1
        }
      },
      patientId: '', // 病人id
      tabActive: '0', // 当前选中的tab0全部患者1特别关心
      taskId: '',
      visitOrderId: ''
    };
  },
  components: {
    updateTel,
    patientFile
  },
  computed: {
    ...mapGetters({
      userId: 'token'
    })
  },
  mounted() {
    this.getList();
  },
  methods: {
    /**
       * 刷新当前列表数据--特别关注切换后--子组件调用
       * @function refreshList
       */
    refreshList() {
      this.getList();
    },
    /**
      * 获取列表数据
      * @function getList
      * @param {String} adminId 医生Id
      * @param {String} sex 病人性别
      * @param {String} patientName 病人名称
      * @param {String} icdName 疾病类型
      * @param {String} fromAge 搜索起始年龄
      * @param {String} endAge 搜索结束年龄
      * @param {String} schemeName 方案名称
      * @param {String} gz 全部患者(0前部，1已关注)
      * @param {String} pager 当前页码
      * @param {String} limit 每页显示条数
      */
    getList() {
      const param = this.params[this.tabActive];
      param.loading = true;
      CommonAPI.patientList({
        ...this.searchParam,
        gz: param.status,
        pager: param.page,
        adminId: this.userId
      }).then((res) => {
        param.loading = false;
        if (res.code === 0) {
          param.tableData = res.data;
          param.total = res.count;
        }
      }).catch((error) => {
        console.log(error);
        param.loading = false;
      });
    },
    /**
       * 分页
       * @function handlePage
       * @param {String} page 当前页码
       * @description
       */
    handlePage(page) {
      this.params[this.tabActive].page = page;
      this.getList();
    },
    /**
       * 查询
       * @function waySearchBtn
       */
    waySearchBtn() {
      this.params[this.tabActive].page = 1;
      this.getList();
    },
    /**
       * 获取表格选中行信息  查看患者档案
       * @function wayButton
       * @param {Object} scope 点击列表的scope的信息
       */
    wayButton(scope) {
      this.patientId = scope.row.hzxxId;
      this.taskId = scope.row.taskId;
      this.visitOrderId = scope.row.id;
      this.$refs.patientFile.toggleShowModal();
    },
    /**
       *列表上方的tab切换--不改变page
       *@function handleClick
       *@param {object} tab tab信息
       *@param {event} event 点击事件
       */
    handleClick(tab, event) {
      this.tabActive = tab.index;
      this.getList();
    },
    /**
       * 列表 修改手机号 按钮
       * @function updateTelBtn
       * @param {Object} scope 点击列表的scope的信息
       */
    updateTelBtn(scope) {
      this.patientId = scope.row.hzxxId;
      this.$refs.updateTel.toggleShowModal();
    }
  }
};
</script>
<style scoped>
  .input-separator{
    line-height: 36px;
    padding: 0 3px;
  }
  .app-container .iconfont{
    color: #ff6e40;
    position: absolute;
    left: 15px;
  }
</style>
