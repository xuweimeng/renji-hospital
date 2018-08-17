<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input v-model.trim="searchParams.brxm" clearable placeholder="请输入姓名"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系方式</label>
        <el-input v-model.trim="searchParams.mobile" clearable placeholder="请输入联系方式"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >证件号</label>
        <el-input v-model.trim="searchParams.sfzh" clearable placeholder="请输入证件号"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >通知方案</label>
        <el-input v-model.trim="searchParams.schemeName" clearable placeholder="请输入通知方案"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >体检套餐</label>
        <el-select
          v-model="searchParams.icd"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入体检套餐"
          :remote-method="remoteMethod">
          <el-option
            v-for="item in diseaseList"
            :key="item.icd"
            :label="item.name"
            :value="item.icd">
          </el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <el-button type="primary" icon="el-icon-search" @click="getDataAction">查询</el-button>
      </li>
    </ul>
    <!-- tab切换 -->
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" class="mdTabs" >
      <el-tab-pane label="体检通知" name="first" v-loading="tableLoading">
        <el-table
          @selection-change="selectChange"
          :data="tableData"
          border fit highlight-current-row
        >
          <el-table-column type="selection"  width="55" align="center"></el-table-column>
          <el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="sfzh" label="证件号" align="center"></el-table-column>
          <el-table-column prop="schemeName" label="通知方案" align="center"></el-table-column>
          <el-table-column prop="icdName" label="体检套餐" align="center"></el-table-column>
          <el-table-column prop="orderTime" label="预约时间" align="center"></el-table-column>
          <el-table-column prop="visitStartTime" label="通知开始时间" align="center"></el-table-column>
          <el-table-column label="详情" align="center" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showInfo(scope)">详情</el-button>
              <el-button size="mini" type="danger" @click="termination(scope.row.id)" v-if="scope.row.isComplete==0">终止</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="tableData.length" class="pagination-container" style="text-align:right;margin-top:15px;">
          <el-button style='margin-right:10px;float:left' type="warning"   @click="batchTermination" >批量终止</el-button>
          <el-pagination style="display:inline-block" background  @current-change="handleCurrentChange" :current-page="searchParams.pager"  :page-size="searchParams.limit" layout="total,  prev, pager, next, jumper" :total="totalPage">
          </el-pagination>
        </div>

      </el-tab-pane>
      <el-tab-pane label="终止通知" name="second">
        <el-table
          :data="noPassData"
          border fit highlight-current-row
          v-loading="noPassLoading"
        >
          <el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="sfzh" label="证件号" align="center"></el-table-column>
          <el-table-column prop="schemeName" label="通知方案" align="center"></el-table-column>
          <el-table-column prop="icdName" label="体检套餐" align="center"></el-table-column>
          <el-table-column prop="orderTime" label="预约时间" align="center"></el-table-column>
          <el-table-column prop="visitStartTime" label="通知开始时间" align="center"></el-table-column>
          <el-table-column label="详情" align="center" >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showInfo(scope)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="noPassData.length" class="pagination-container" style="text-align:right;margin-top:15px;">
          <el-pagination style="display:inline-block" background  @current-change="pageChange" :current-page="nosearchParams.pager"  :page-size="nosearchParams.limit" layout="total,  prev, pager, next, jumper" :total="noTotalPage">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 审核不通过 -->
    <el-dialog title="审核不通过原因" :visible.sync="noCheck" width="350px"   @close="cancelSelect">
      <el-row slot>
        <el-col :span="24" >
          <el-select v-model="selectCheck" placeholder="请选择"  popper-class="selectOut">
            <el-option  v-for="item in checkoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col
          :span="24"
          class="btnCheck"
          style="margin-top:28px;text-align: center;"
        >
          <el-button type="primary"  @click.native="noothroughCkeck">确定</el-button>
          <el-button type="info" @click="cancelSelect">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <plan-info ref="record"   :patientId="patientId"  :hzxxId="hzxxId"></plan-info>
  </div>
</template>
<script>
  import { NoticePlan } from 'LQPE_API/NoticePlan'; // 引入 api
  import { mapGetters } from 'vuex';
  import PlanInfo from './components/PlanInfo';

  export default {
    components: {
      PlanInfo
    },
    data() {
      return {
        patientId: '',
        hzxxId:"",   //患者id
        tableLoading: true,
        noPassLoading: true,
        dataRecord: 0,
        recordFlag: 1, // 1.代表终止 2.代表批量终止
        ordersList: [], // 采集指标
        searchParams: {
          adminId: this.token,
          pager: 1, // 当前页码
          limit: 10, // 每页条数
          brxm: '', // 患者姓名（可选）
          mobile: null, // ；联系方式（可选）
          icd: '', // 体检套餐名称id
          sfzh: '', // 身份证号
          schemeName: '',
          activeType: 5
        },
        nosearchParams: {
          adminId: this.token,
          pager: 1, // 当前页码
          limit: 10, // 每页条数
          brxm: '', // 患者姓名（可选）
          mobile: '', // ；联系方式（可选）
          icd: '', // 体检套餐名称id
          sfzh: '', // 身份证号
          schemeName: '',
          activeType: 5
        },
        noTotalPage: 0,
        totalPage: 0, // 总页数
        activeName: 'first', // tab
        tableData: [],
        noPassData: [],
        diseaseList: [] /* 疾病列表 */,
        checkoptions: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: '1',
            label: '客户已死亡'
          },
          {
            value: '2',
            label: '客户不接受随访'
          },
          {
            value: '3',
            label: '随访方案重复'
          },
          {
            value: '4',
            label: '方案不匹配'
          },
          {
            value: '5',
            label: '其他'
          }
        ],
        selectCheck: '', // 选中的审核不通过
        checkId: [], // 随访通过的id(多选时),
        noCheck: false // 审核不通过弹框
      };
    },
    mounted() {
      this.getData();
    },
    computed: {
      ...mapGetters(['token'])
    },
    methods: {
      /**
       * @function 取消终止
       * @return {type} {description}
       */
      cancelSelect() {
        this.noCheck = false;
        this.selectCheck = '';
        this.checkId = [];
      },
      /**
       * @function 搜索按钮
       * @return {type} {description}
       */
      getDataAction() {
        if (!this.dataRecord) {
          this.tableLoading = true;
          this.searchParams.pager = 1;
          this.getData();
        } else {
          this.noPassLoading = true;
          this.nosearchParams.pager = 1;
          this.nosearchParams.brxm = this.searchParams.brxm; // 患者姓名（可选）
          this.nosearchParams.mobile = this.searchParams.mobile; // ；联系方式（可选）
          this.nosearchParams.icd = this.searchParams.icd; // 体检套餐名称id
          this.nosearchParams.sfzh = this.searchParams.sfzh; // 身份证号
          this.nosearchParams.schemeName = this.searchParams.schemeName;
          this.getDateNotice();
        }
      },
      /**
       * @function 体检套餐自动补全
       * @param  {type} query {description}
       * @return {type} {description}
       */
      remoteMethod(query) {
        if (query === '') {
          return false;
        }
        this.diseaseList = [];
        NoticePlan.autoComplete({
          zjm: query,
          diseaseType: 1
        })
          .then(res => {
            this.diseaseList = res.data;
          })
          .catch(error => {
            console.log(error);
          });
      },
      /**
       * @function 获取体检通知列表
       * @return {type} {description}
       */
      getData() {
        NoticePlan.getPlan(this.searchParams).then(res => {
          this.tableLoading = false;
          this.tableData = res.data;
          this.totalPage = res.total;
        });
      },
      /**
       * @function 获取终止通知列表
       * @return {type} {description}
       */
      getDateNotice() {
        NoticePlan.zlistDate(this.nosearchParams).then(res => {
          this.noPassData = res.data;
          this.noTotalPage = res.total;
          this.noPassLoading = false;
        });
      },
      /**
       * @function 查看随访计划详情
       * @param  {type} scope {description}
       * @return {type} {description}
       */
      showInfo(scope) {
        this.patientId = scope.row.id;
        this.hzxxId = scope.row.hzxxId; //患者id
        this.$refs.record.dialogTableVisible = true;
      },
      /**
       * @function 监听所选的按钮
       * @param  {type} selection {description}
       * @return {type} {description}
       */
      selectChange(selection) {
        this.checkId = selection;
      },
      /**
       *弹框点击不通过确定
       *@function noothroughCkeck
       *@description 点击表格操作弹框不通过
       */
      noothroughCkeck() {
        const ids = [];
        for (const iterator of this.checkId) {
          ids.push(iterator.id);
        }

        if (this.selectCheck) {
          if (this.recordFlag === 1) {
            this.handleCheck(ids, this.selectCheck); // 单条终止
          } else {
            this.cancelBatchCancelPlot(ids, this.selectCheck); // 批量终止
          }
        } else {
          this.$message.warning('请选择原因');
        }
      },
      /**
       * @function 单个终止提交
       * @param  {type} ids           {description}
       * @param  {type} notPassReason {description}
       * @return {type} {description}
       */
      handleCheck(ids, notPassReason) {
        NoticePlan.cancelNotice({
          id: ids[0],
          adminId:sessionStorage.getItem("userId"),
          notPassReason: notPassReason,
          notPassRemark: '终止计划'
        })
          .then(res => {
            this.getData();
            this.noCheck = false;
            this.selectCheck = '';
          })
          .catch(error => {
            console.log(error);
          });
      },
      /**
       * @function 批量终止提交
       * @param  {type} ids           {description}
       * @param  {type} notPassReason {description}
       * @return {type} {description}
       */
      cancelBatchCancelPlot(ids, notPassReason) {
        NoticePlan.cancelBatchCancel({
          ids: ids,
          adminId:sessionStorage.getItem("userId"),
          notPassReason: notPassReason,
          notPassRemark: '终止计划'
        })
          .then(res => {
            this.getData();
            this.noCheck = false;
            this.selectCheck = '';
          })
          .catch(error => {
            console.log(error);
          });
      },
      /**
       * @function 切换table
       * @param  {type} tab   {description}
       * @param  {type} event {description}
       * @return {type} {description}
       */
      handleClick(tab, event) {
        switch (tab.index) {
          case '0':
            this.getData();
            this.dataRecord = 0;
            break;
          case '1':
            this.dataRecord = 1;
            this.getDateNotice();
            break;
        }
      },
      /**
       * @function table两种类型的分页
       * @param  {type} page {description}
       * @return {type} {description}
       */
      handleCurrentChange(page) {
        this.searchParams.pager = page;
        this.getData();
      },
      pageChange(page) {
        this.nosearchParams.pager = page;
        this.getDateNotice();
      },
      /**
       * @function 批量终止
       * @return {type} {description}
       */
      batchTermination() {
        if (this.checkId.length === 0) {
          this.$message.warning('请选择所选项');
          return false;
        }
        this.recordFlag = 2;
        this.noCheck = true;
      },
      /**
       * @function 终止通知
       * @param  {type} id {description}
       * @return {type} {description}
       */
      termination(id) {
        this.checkId = [
          {
            id: id
          }
        ];
        // 单个终止
        this.recordFlag = 1;
        this.noCheck = true;
      }
    }
  };
</script>



