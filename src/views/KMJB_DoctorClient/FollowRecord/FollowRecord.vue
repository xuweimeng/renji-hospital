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
        <label class="radio-label" >时间</label>
        <el-select class="filter-item" v-model="searchParam.type" placeholder="请选择">
          <el-option label="全部" value="3"></el-option>
          <el-option label="近七天" value="2"></el-option>
          <el-option label="近30天" value="1"></el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <label class="radio-label">年龄</label>
        <el-input placeholder="0" v-model.trim="searchParam.fromAge"></el-input>
        <span class="input-separator">-</span>
        <el-input placeholder="99" v-model.trim="searchParam.endAge"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >通话状态</label>
        <el-select class="filter-item" v-model="searchParam.backStatus" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="呼叫失败" value="1"></el-option>
          <el-option label="正常通话" value="2"></el-option>
          <el-option label="通话中" value="3"></el-option>
          <el-option label="关停机" value="4"></el-option>
          <el-option label="无人接听" value="5"></el-option>
          <el-option label="空号" value="6"></el-option>
          <el-option label="号码有误" value="7"></el-option>
        </el-select>
      </li>
      <!--add by yugou0625 添加采集情况筛选-->
      <li class="common_search_single">
        <label class="radio-label" >采集情况</label>
        <el-select class="filter-item" v-model="searchParam.scquisitionState" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="无异常" value="1"></el-option>
          <el-option label="有异常" value="2"></el-option>
          <el-option label="部分采集" value="3"></el-option>
          <el-option label="接通未采集" value="4"></el-option>
          <el-option label="接通无应答" value="5"></el-option>
          <el-option label="未接通未采集" value="6"></el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <el-button type="primary" icon="el-icon-search"  @click="waySearchBtn"
                   :loading="params[0].loading || params[1].loading">查询</el-button>
      </li>
    </ul>
    <!-- tab切换 -->
    <el-tabs type="border-card"  @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in params" :label="index==='0' ? `${item.label}(${item.total})` : `${item.label}`" :key="index">
        <el-table
          :data="item.tableData"
          border highlight-current-row
          v-loading="item.loading"
        >
          <el-table-column label="姓名" align="center" prop="patientName">
            <template slot-scope="scope">
              <i class="iconfont" v-if="scope.row.islike==1">&#xe604;</i>
              <div class="td-hover" @click="tdClick(scope)"><span>{{ scope.row.patientName }}</span></div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="性别/年龄" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.patientSex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="icdName" label="疾病诊断" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag>{{scope.row.diagnosetype ==1?'门诊':'住院'}}</el-tag>
              {{scope.row.icdName}}
            </template>
          </el-table-column>
          <el-table-column label="随访计划" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="td-hover" @click="sfjhModel(scope)">{{scope.row.schemeName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dateBegin" label="随访日期" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="随访进度" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.currentVisitTime}}/{{scope.row.visitCount}}</span>
            </template>
          </el-table-column>
          <el-table-column label="通话状态" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.backStatusStr}}</span>
            </template>
          </el-table-column>
          <!--update by yugou 情况进一步细分-->
          <el-table-column label="采集情况" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.currentVisitError ===0 " :class="scope.row.stateClass">{{scope.row.scquisitionStateText}}</span>
              <span v-if="scope.row.currentVisitError !==0 " class="yyc">{{scope.row.currentVisitError}}项异常</span>
            </template>
          </el-table-column>
          <el-table-column label="处理意见" align="center" v-if="index !== '0'">
            <template slot-scope="scope">
                  <span v-bind:class="[scope.row.visitResult==1?'yyc':scope.row.visitResult==2?'originC':'wyc']">
                    {{scope.row.visitResult==0?'病情稳定':scope.row.visitResult==1?'通知就诊':scope.row.visitResult==2?'暂不处理':'未知'}}
                  </span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="随访记录" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="wayButton(scope)" class="operateBtn">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination @current-change="handlePage" :current-page.sync="item.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                          :total="item.total" v-if="item.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 随访记录 -->
    <follow-record
      :patient-id="patientId"
      :task-id="taskId"
      :sf-number="sfNumber+''"
      :tab-active="tabActive+''"
      v-on:refreshData="refreshList"
      ref="followRecord"></follow-record>
    <!-- 就诊档案 不显示 随访记录 链接 -->
    <patient-file
      :patient-id="patientId"
      ref="patientFile"
      v-on:refreshData="refreshList"
    ></patient-file>
    <!-- 随访计划 -->
    <follow-plan
      :patient-id="patientId"
      :task-id="taskId"
      v-on:refreshData="refreshList"
      ref="followPlan"
    ></follow-plan>
  </div>
</template>

<script>
/**
 * 随访结果
 * @module followway
 */
import { FollowRecord } from 'KMJB_API/FollowRecord';
import patientFile from 'KMJB/common/patientFile';
import followPlan from 'KMJB/common/FollowPlan';
import followRecord from 'KMJB/common/followRecord';
import { mapGetters } from 'vuex';
const base_param = {
  page: 1,
  total: 0,
  loading: false,
  tableData: []
};
export default {
  data() {
    return {
      searchParam: {
        sex: '', // 病人性别
        patientName: '', // 姓名
        icdName: '', // 疾病类型
        fromAge: '', // 搜索起始年龄
        endAge: '', // 搜索结束年龄
        type: '1', // 时间 3：全部，2：近7天，1：近30天
        schemeName: '', // 方案名称
        backStatus: '', // 通话状态
        scquisitionState: '', // 采集状态 1、无异常。2、有异常。3、部分采集。4、接通未采集。5、接通无应答。6、未接通未采集。
        limit: 10 // 每页条数
      },
      params: {
        0: {
          ...base_param,
          label: '未处理',
          status: 1
        },
        1: {
          ...base_param,
          label: '已处理',
          status: 11
        }
      },
      patientId: '', // 病人id
      taskId: '', // 获取病人的taskId
      sfNumber: '', // 选中第几次
      tabActive: 0 // 当前选中的tab 0未处理，1已处理
    };
  },
  mounted() {
    this.getList();
  },
  components: {
    followRecord,
    patientFile,
    followPlan
  },
  computed: {
    ...mapGetters({
      userId: 'token'
    })
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
      * 列表数据获取
      * @function getList
      * @param {Object} param search参数
      * @param {String} adminId 医生Id
      * @param {String} sex 病人性别
      * @param {String} patientName 病人名称
      * @param {String} icdName 疾病类型
      * @param {String} fromAge 搜索起始年龄
      * @param {String} endAge 搜索结束年龄
      * @param {String} type 时间 3：全部，2：近7天，1：近30天
      * @param {String} schemeName 方案名称
      * @param {String} vetStatus 未处理(1未处理，11已处理)
      * @param {String} backStatus 通话状态
      * @param {String} pager 当前页码
      * @param {String} limit 每页显示条数
      */
    getList() {
      const param = this.params[this.tabActive];
      param.loading = true;
      FollowRecord.list({
        ...this.searchParam,
        vetStatus: param.status,
        pager: param.page,
        adminId: this.userId
      }).then((res) => {
        param.loading = false;
        if (res.code === 0) {
          const scquisitionStateMap = ['', '无异常', '有异常', '部分采集', '接通未采集', '接通无应答', '未接通未采集'];
          const stateColorMap = ['', 'wyc', 'yyc', 'yyc', 'cjsb', 'originC', ''];
          // 采集情况 文字颜色的类名、数字转文字处理
          res.data.forEach((item) => {
            item.stateClass = stateColorMap[item.scquisitionState];
            item.scquisitionStateText = scquisitionStateMap[item.scquisitionState];
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
       * @function handlePage
       * @param {String} val 当前页码
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
      * 获取表格选中行信息
      * @function wayButton
      * @param {Object} scope 点击列表的scope的信息
      */
    wayButton(scope) {
      this.patientId = scope.row.hzxxId;
      this.taskId = scope.row.taskId;
      this.sfNumber = scope.row.currentVisitTime;
      this.$refs.followRecord.toggleShowModal();
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
       *@function tdClick
       *@description 点击表格中的患者姓名
       */
    tdClick(scope) {
      this.patientId = scope.row.hzxxId;
      this.$refs.patientFile.toggleShowModal();
    },
    /**
       *@function sfjhModel
       *@description 点击表格中的随访计划，弹出 随访方案 框
       */
    sfjhModel(scope) {
      this.patientId = scope.row.hzxxId;
      this.taskId = scope.row.taskId;
      this.$refs.followPlan.toggleShowModal();
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
  .wyc {
    color: #00ae00;
  }
  .yyc {
    color: #ff2626;
  }
  .cjsb {
    color: #ffb15d;
  }
  .originC {
    color: #ff6800;
  }
  .app-container .iconfont{
    color: #ff6e40;
    position: absolute;
    left: 15px;
  }
</style>
