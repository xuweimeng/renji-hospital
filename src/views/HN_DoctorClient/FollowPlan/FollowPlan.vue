<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input  placeholder="请输入患者姓名"  v-model.trim="searchParam.patientName"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >随访方案</label>
        <el-input  placeholder="请输入随访方案"  v-model.trim="searchParam.schemeName"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >疾病诊断</label>
        <el-input  placeholder="请输入疾病诊断"  v-model.trim="searchParam.icdName"></el-input>
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
                   :loading="params[0].loading || params[1].loading || params[2].loading">查询</el-button>
      </li>
    </ul>
    <!-- tab切换 -->
    <el-tabs type="border-card" @tab-click="handleClick">

      <el-tab-pane v-for="item,index in params" :label="index==='0' ? `${item.label}(${item.total})` : `${item.label}`" :key="index">
        <el-table
          :data="item.tableData"
          border highlight-current-row
          v-loading="item.loading"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
        >
          <el-table-column type="selection" align="center" v-if="index==='0'"></el-table-column>
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">
              <i class="iconfont" v-if="scope.row.islike==1">&#xe604;</i>
              <div class="td-hover" @click="tdClick(scope)"><span>{{ scope.row.patientName }}</span></div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="性别/年龄" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.sex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="icdName" label="疾病诊断" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag>{{scope.row.diagnosetype ==1?'门诊':'住院'}}</el-tag>
              {{scope.row.icdName}}
            </template>
          </el-table-column>
          <el-table-column prop="schemeName" label="随访方案" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="visitStartTimeStr" label="计划开始日期" align="center"></el-table-column>
          <template v-if="index!=='0'">
            <el-table-column prop="operator" label="审核人" align="center"></el-table-column>
            <el-table-column prop="dateUpdate" label="审核时间" align="center" show-overflow-tooltip></el-table-column>
          </template>
          <el-table-column label="审核" align="center" width="160" v-if="index==='0'">
            <template slot-scope="scope">
              <el-button size="mini" @click="throughCheck(scope)">通过</el-button>
              <el-button size="mini" @click="noThroughCheck(scope)">不通过</el-button>
            </template>
          </el-table-column>
          <el-table-column label="随访计划" align="center" width="140">
            <template slot-scope="scope">
              <el-button type="primary" @click.stop="wayButton(scope)" size="mini">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <div style='margin-right:10px;float:left' v-if="item.tableData.length && index==='0'">
            <el-button type="primary" @click="toggleSelection(item.tableData)">全选</el-button>
            <el-button type="primary" @click="numCheck">批量通过</el-button>
          </div>
          <el-pagination  @current-change="pageChange" :current-page.sync="item.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                          :total="item.total" v-if="item.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 审核不通过 -->
    <el-dialog title="审核不通过原因"
               :visible.sync="noCheck"
               width="350px"
               custom-class="checknoPass">
      <el-select v-model="selectCheck" placeholder="请选择" @change="changeSelect" popper-class="selectOut">
        <el-option  v-for="item in checkoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span slot="footer">
          <el-button type="primary" @click.native="noothroughCheck">确定</el-button>
          <el-button @click="noCheck=false">取消</el-button>
        </span>
    </el-dialog>
    <!-- 就诊档案 不显示 随访记录 链接-->
    <patient-file
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :show-record-link="false"
      ref="patientFile"
      v-on:refreshData="refreshList"
    ></patient-file>
    <!-- 随访计划 -->
    <follow-plan
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :task-id="taskId"
      ref="followPlan"
      :tab-active="tabActive"
      v-on:passBtn="modelPass"
      v-on:nopassBtn="modelOut"
      v-on:refreshData="refreshList"
    ></follow-plan>
  </div>
</template>

<script>
  /**
   * 随访计划
   * @module followParam
   */
  import { FollowPlan } from 'HNDC_API/FollowPlan';
  import patientFile from 'HNDC/common/patientFile';
  import followPlan from 'HNDC/common/FollowPlan';
  export default {
    data() {
      return {
        params: {
          0: { // 待审核
            label: '待审核',
            page: 1,
            total: 0,
            loading: false,
            tableData: [],
            status: 4
          },
          1: { // 已通过
            label: '已通过',
            page: 1,
            total: 0,
            loading: false,
            tableData: [],
            status: 1
          },
          2: { // 未通过
            label: '未通过',
            page: 1,
            total: 0,
            loading: false,
            tableData: [],
            status: 2
          }
        },
        userId: '', // 从localStorage获取登录页的医生id
        searchParam: {
          limit: 10, // 每页数量
          patientName: '', // 病人名称
          icdName: '', // 疾病类型
          sex: '', // 病人性别
          fromAge: '', // 搜索起始年龄
          endAge: '', // 搜索结束年龄
          schemeName: '' // 方案名称
        },
        // (1:已通过 2:未通过 3:已审核 4:未审核)
        patientId: '', // 病人id
        tabActive: 0, // 当前选中的tab 0：待审核，1：已通过，2：未通过
        multipleSelection: [], // 待审核表格中的选中结果
        noCheck: false, // 审核不通过弹框
        selectCheck: '', // 选中的审核不通过
        // 审核不通过options
        checkoptions: [{
          value: '',
          label: '请选择'
        },
        {
          value: '1',
          label: '患者已死亡'
        }, {
          value: '2',
          label: '患者不接受随访'
        }, {
          value: '3',
          label: '随访方案重复'
        }, {
          value: '4',
          label: '方案不匹配'
        }],
        checkId: [], // 随访通过的id(多选时),
        taskId: '', // 选中的行的id ?
        visitOrderId: '' // 选中的行的visitOrderId
      };
    },
    mounted() {
      this.getUserId();
      this.getList();
    },
    components: {
      patientFile,
      followPlan
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
       * 从sessionStorage获取医生id
       * @function getUserId
       * @param {String} userId 获取医生id
       */
      getUserId() {
        this.userId = this.$store.state.user.token; // 用户名
      },
      /**
       * 列表数据获取
       * @function getList
       * @param {Object} param search参数
       * @param {String} adminId 医生Id
       * @param {String} status 审核状态(1:已通过 2:未通过 3:已审核 4:未审核)
       * @param {String} sex 病人性别
       * @param {String} patientName 病人名称
       * @param {String} icdName 疾病类型
       * @param {String} fromAge 搜索起始年龄
       * @param {String} endAge 搜索结束年龄
       * @param {String} schemeName 方案名称
       * @param {String} pager 当前页码
       * @param {String} limit 每页显示条数
       */
      getList() {
        const param = this.params[this.tabActive];
        param.loading = true;
        FollowPlan.list({
          ...this.searchParam,
          status: param.status,
          pager: param.page,
          adminId: this.userId
        }).then((res) => {
          param.loading = false;
          if (res.code === 0) {
            res.data.forEach((item) => {
              // 匹配审核不通过原因
              const reasonMap = ['', '患者已死亡', '患者不接受随访', '随访方案重复', '方案不匹配'];
              item.notPassReason = reasonMap[item.notPassReason];
              // 随访类型
              if (!item.activeType) {
                item.activeType = 0;
              }
              const activeTypeMap = ['随访', '通知', '临时随访'];
              item.activeType = activeTypeMap[item.activeType];
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
       * 分页
       * @function pageChange
       * @param {String} page 当前页码
       * @description
       */
      pageChange(page) {
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
       * 获取表格选中行信息-点击 详情
       * @function wayButton
       * @param {Object} scope 点击列表的scope的信息
       */
      wayButton(scope) {
        this.checkId = [];
        this.checkId.push(scope.row.id);
        this.isCare = scope.row.islike; // 获取当前患者是否被关注
        this.patientId = scope.row.hzxxId;
        this.taskId = scope.row.id;
        this.visitOrderId = scope.row.visitOrderId;
        setTimeout(() => {
          this.$refs.followPlan.toggleShowModal();
        }, 0);
      },
      /**
       *列表上方的三个tab切换--不改变page
       *@function handleClick
       *@param {object} tab tab信息
       *@param {event} event 点击事件
       */
      handleClick(tab, event) {
        this.tabActive = tab.index;
        this.getList();
      },
      /**
       *待审核表格全选
       *@function toggleSelection
       *@param {object} rows 选中的行（参见element-ui的table-rows）
       */
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      /**
       *待审核表格多选
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /**
       *批量审核
       *@function numCheck
       *@description 批量审核，传入多学值，参考handleCheck
       */
      numCheck() {
        const id_arr = [];
        this.multipleSelection.forEach((item) => {
          id_arr.push(item.id);
        });
        if (!id_arr.length) {
          this.$message.error('请选择患者!');
        } else {
          this.handleCheck(2, 2, id_arr.join(','));
        }
      },
      /**
       *表格内审核通过
       *@function throughCheck
       *@param {object} scope 当前行内容（参加element-ui的table的scope概念）
       */
      throughCheck(scope) {
        this.handleCheck(2, 2, scope.row.id);
      },
      /**
       *表格内审核不通过
       *@function throughCheck
       *@param {object} scope 当前行内容（参加element-ui的table的scope概念）
       */
      noThroughCheck(scope) {
        this.checkId = [];// 每次点击时清空选中的患者id
        this.checkId.push(scope.row.id);
        this.noCheck = true;
        this.selectCheck = '';
      },
      /**
       *审核不通过的原因
       *@function changeSelect
       *@param {String} value 审核不通过的原因
       */
      changeSelect(value) {
        this.selectCheck = value;
      },
      /**
       *审核不通过原因弹框 点击确定
       *@function noothroughCheck
       *@description 点击表格操作弹框不通过
       */
      noothroughCheck() {
        if (this.selectCheck) {
          const id = this.checkId.join(',');
          this.handleCheck(1, 2, id, this.selectCheck);
          this.$refs.followPlan.closeDialog();
          this.getList();
        } else {
          this.$message.error('请选择不通过原因!');
        }
      },
      /**
       *随访计划详情弹框中 点击通过
       *@function modelPass
       */
      modelPass() {
        const id = this.checkId.join(',');
        this.handleCheck(2, 2, id);
        this.$refs.followPlan.toggleShowModal();
        this.getList();
      },
      /**
       *随访计划详情弹框中 点击不通过
       *@function modelOut
       */
      modelOut() {
        this.noCheck = true;
        this.selectCheck = '';
      },
      /**
       *审核功能
       *@function handleCheck
       *@description 审核功能均调用这一个函数
       *@param {String} adminId 医生id
       *@param {String} operateType 通过(1：不通过 2：通过)
       *@param {String} isAll 是否全部提交(1:是 2：否)
       *@param {String} ids 患者id集合,数组转字符串
       *@param {String} noPassReason 审核不通过原因
       */
      handleCheck(operateType, isAll, ids, noPassReason) {
        FollowPlan.editVisitProjectStatus({
          'adminId': this.userId,
          'operateType': operateType,
          'isAll': isAll,
          'ids': ids,
          'noPassReason': noPassReason
        }).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: '操作已完成',
              type: 'success'
            });
            this.getList();
            this.noCheck = false;
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      /**
       *@function tdClick
       *@description 点击患者姓名展示患者就诊档案
       *@param {object} scope 当前行内容（参加element-ui的table的scope概念）
       */
      tdClick(scope) {
        this.patientId = scope.row.hzxxId;
        this.visitOrderId = scope.row.visitOrderId;
        setTimeout(() => {
          this.$refs.patientFile.toggleShowModal();
        }, 0);
      }
    }
  };
</script>
<style scoped>
  .input-separator{
    line-height: 36px;
    padding: 0 3px;
  }
  .td-hover{
    cursor: pointer;
  }
  .td-hover:hover{
    color: #409EFF;
  }
  .app-container .iconfont{
    color: #ff6e40;
    position: absolute;
    left: 15px;
  }
</style>
