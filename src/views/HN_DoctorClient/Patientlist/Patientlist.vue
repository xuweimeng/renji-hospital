<template>
  <div class="patientList">
    <!-- 搜索 -->
    <el-row class="formSearch">
      <el-col :span="24">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
          <el-form-item label="姓名" class="inputLength">
            <el-input v-model.trim="searchParam.patientName" clearable placeholder="请输入患者姓名"></el-input>
          </el-form-item>
          <el-form-item label="随访方案" class="inputLength" v-show="hideInput">
            <el-input v-model.trim="searchParam.schemeName" clearable placeholder="请输入随访方案"></el-input>
          </el-form-item>
          <el-form-item label="疾病诊断" class="inputLength">
            <el-input v-model.trim="searchParam.icdName" clearable placeholder="请输入疾病类型"></el-input>
          </el-form-item>
          <el-form-item label="性别" class="seclectLength">
            <el-select v-model="searchParam.sex" placeholder="请选择" popper-class="searchSelect">
              <el-option label="全部" value=""></el-option>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" class="seclectLength">
            <el-input v-model="searchParam.fromAge" placeholder="0"></el-input>
            <span>-</span>
            <el-input v-model="searchParam.endAge" placeholder="99"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="button" @click.native="waySearchBtn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- tab切换 -->
    <el-row class="rsTabs">
      <el-col :span="24">
        <el-tabs type="border-card" @tab-click="handleClick">
          <!-- 全部患者 -->
          <el-tab-pane :label="`全部患者`">
            <el-table :data="param_all.tableData" style="width: 1110px" class="rsTable"  v-loading="param_all.loading">
              <el-table-column label="姓名" width="120" align="center">
                <template slot-scope="scope">
                  <div class="tbCare fl-left"><i class="iconfont" v-if="scope.row.islike==1">&#xe604;</i></div>
                  <div class="fl-left" style="width:70px;"><span>{{ scope.row.patientName }}</span></div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="性别/年龄" width="204" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.patientSex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="nation" label="民族" align="center">
              </el-table-column>
              <el-table-column prop="diagnoseTime" label="就诊日期" align="center">
              </el-table-column>
              <el-table-column prop="icdName" label="疾病诊断" align="center">
                <template slot-scope="scope">
                  <div style="text-align: left;margin-left: 18px;">
                    <div class="tags">{{scope.row.diagnosetype ==1?'门诊':'住院'}}</div>
                    {{scope.row.icdName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="就诊档案" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="wayButton(scope)" style="height:23px;width:52px;padding:0;font-size
                  :13px;background:#1899ff;">档案</el-button>
                  <el-button type="primary" @click="updateTelBtn(scope)" style="height: 23px;width: 90px;padding: 0;
                  font-size:13px;background:#1899ff;">修改手机号</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="rsfy">
              <el-col :span="14" :offset="10">
                <el-pagination  @current-change="handleCurrentAll" :current-page.sync="param_all.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                  :total="param_all.total" v-if="param_all.tableData.length">
                </el-pagination>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- 特别关心 -->
          <el-tab-pane :label="`特别关心`">
            <el-table :data="param_liked.tableData" style="width: 1110px" class="rsTable"  v-loading="param_liked.loading">
              <el-table-column label="姓名" width="120" align="center">
                <template slot-scope="scope">
                  <div class="tbCare fl-left"><i class="iconfont" v-if="scope.row.islike==1">&#xe604;</i></div>
                  <div class="fl-left" style="width:70px;"><span>{{ scope.row.patientName }}</span></div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="性别/年龄" width="204" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.patientSex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="nation" label="民族" align="center">
              </el-table-column>
              <el-table-column prop="diagnoseTime" label="就诊日期" align="center">
              </el-table-column>
              <el-table-column prop="icdName" label="疾病诊断" align="center">
                <template slot-scope="scope">
                  <div style="text-align: left;margin-left: 18px;">
                    <div class="tags">{{scope.row.diagnosetype ==1?'门诊':'住院'}}</div>
                    {{scope.row.icdName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="就诊档案" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="wayButton(scope)" class="tableBtn" style="">档案</el-button>
                  <el-button type="primary" @click="updateTelBtn(scope)" style="height: 23px;width: 90px;padding: 0;
                  font-size:13px;background:#1899ff;">修改手机号</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="rsfy">
              <el-col :span="16" :offset="8">
                <el-pagination  @current-change="handleCurrentLiked" :current-page.sync="param_liked.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                  :total="param_liked.total" v-if="param_liked.tableData.length">
                </el-pagination>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 弹框 -->
    <!-- 就诊档案 -->
    <!--<patient-file-->
      <!--:patient-id="patientId"-->
      <!--showRecordLink="true"-->
      <!--ref="patientFile"-->
    <!--&gt;</patient-file>-->
    <!-- 就诊档案 -->
    <patient-file
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :show-record-link="true"
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
import { CommonAPI } from '@/api/HN_DoctorClient/common';
import patientFile from 'HNDC/common/patientFile';
import updateTel from 'HNDC/dialog/patientList/updateTel';
const typeMap = ['all', 'liked']; // 依次是 全部、已关注；用来匹配 不同的param_
export default {
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
      /* 全部的数据集合 */
      param_all: {
        page: 1,
        total: 0,
        loading: false,
        tableData: [],
        status: 0
      },
      /* 已关注的数据集合 */
      param_liked: {
        page: 1,
        total: 0,
        loading: false,
        tableData: [],
        status: 1
      },
      userId: '', // 医生id sessionStorage中
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
  mounted() {
    this.getUserId();
    if (this.$route.query.paName) {
      this.searchParam.patientName = this.$route.query.paName;
    }
    this.getList(this.param_all);
  },
  methods: {
    /**
       * 刷新当前列表数据--特别关注切换后--子组件调用
       * @function refreshList
       */
    refreshList() {
      const param_name = `param_${typeMap[this.tabActive]}`;
      this.getList(this[param_name]);
    },
    /**
      * 从sessionStorage获取医生id
      * @function getUserId
      * @param {String} userId 获取医生id
      */
    getUserId() {
      this.userId = this.$store.state.user.token;// 用户名
    },
    /**
      * 获取列表数据
      * @function getList
      * @param {Object} param search参数
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
    getList(param) {
      param.loading = true;
      CommonAPI.patientList({
        ...this.searchParam,
        gz: param.status,
        pager: param.page,
        adminId: this.userId
      }).then((res) => {
        param.loading = false;
        if (res.code === 0) {
          // 匹配当前病人是否被关注
          res.data.forEach((item) => {
            if (item.islike === 0 || item.islike === '0' || !item.islike) {
              item.islike = false;
            } else if (item.islike === 1 || item.islike === '1') {
              item.islike = true;
            }
          });
          param.tableData = res.data;
          param.total = res.count;
        }
      }).catch((error) => {
        console.log(error);
        param.loading = false;
      });
    },
    /**
       * 分页--全部
       * @function handleCurrentAll
       * @param {String} page 当前页码
       * @description
       */
    handleCurrentAll(page) {
      this.param_all.page = page;
      this.getList(this.param_all);
    },
    /**
       * 分页--已关注
       * @function handleCurrentLiked
       * @param {String} page 当前页码
       * @description
       */
    handleCurrentLiked(page) {
      this.param_liked.page = page;
      this.getList(this.param_liked);
    },
    /**
       * 查询
       * @function waySearchBtn
       */
    waySearchBtn() {
      // 修改page会触发 分页方法的调用,无需在调用getList
      const param_name = `param_${typeMap[this.tabActive]}`;
      if (this[param_name].page !== 1) {
        this[param_name].page = 1;
        return false;
      }
      this.getList(this[param_name]);
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
      setTimeout(() => {
        this.$refs.patientFile.toggleShowModal();
      }, 0);
    },
    /**
       *列表上方的tab切换--不改变page
       *@function handleClick
       *@param {object} tab tab信息
       *@param {event} event 点击事件
       */
    handleClick(tab, event) {
      this.tabActive = tab.index;
      const param_name = `param_${typeMap[tab.index]}`;
      this.getList(this[param_name]);
    },
    /**
       * 列表 修改手机号 按钮
       * @function updateTelBtn
       * @param {Object} scope 点击列表的scope的信息
       */
    updateTelBtn(scope) {
      this.patientId = scope.row.hzxxId;
      setTimeout(() => {
        this.$refs.updateTel.toggleShowModal();
      }, 0);
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/PatientList' && this.$route.query.paName) {
        this.searchParam.patientName = this.$route.query.paName;
        this.getList(this.param_all);
      }
    }
  }
};
</script>

<!--<style lang="scss">-->
 <!--@import '../../assets/scss/mixin';-->
 <!--@import '../../assets/scss/reset';-->
 <!--@import '../../common/style/base';-->
  <!--.patientList {-->
    <!--background: $background;-->
  <!--}-->
<!--</style>-->
