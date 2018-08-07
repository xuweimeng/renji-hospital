<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input  placeholder="请输入患者姓名"  v-model.trim="searchParam.patientName"></el-input>
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
        <label class="radio-label" >联系电话</label>
        <el-input  placeholder="请输入患者电话"  v-model.trim="searchParam.mobile"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >随访方案</label>
        <el-input  placeholder="请输入随访方案"  v-model.trim="searchParam.schemeName"></el-input>
      </li>
      <li class="common_search_single common_search_single_time">
        <label class="radio-label">随访时间</label>
        <el-date-picker
          v-model="followTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptionsShortcuts"
          @change="followTimePick"
        >
        </el-date-picker>
      </li>
      <li class="common_search_single common_search_single_time">
        <label class="radio-label">出院时间</label>
        <el-date-picker
          @change="outTimePick"
          v-model="outTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptionsShortcuts"
        >
        </el-date-picker>
      </li>
      <li class="common_search_single">
        <el-button style='margin-right:10px;' type="primary" icon="el-icon-search"  @click="searchBtn" :loading="tableLoading">查询</el-button>
        <el-button class="filter-item" type="primary"  icon="el-icon-download" @click="exportBtn">导出</el-button>
      </li>
    </ul>
    <!--表格-->
    <el-alert style="white-space: pre;"
              :closable="false"
              :title="`${sum_start}  至  ${sum_end}    异常指标人数共计：${total}人`"
              v-if="sum_start"
              type="success">
    </el-alert>
    <el-alert style="white-space: pre;"
              :closable="false"
              :title="`异常指标人数共计：${total}人`"
              v-if="!sum_start"
              type="success">
    </el-alert>
    <el-table
      :data="tableData"
      border highlight-current-row
      v-loading="tableLoading"
    >
      <el-table-column label="姓名" align="center" prop="patientName">
        <template slot-scope="scope">
          <i class="iconfont" v-if="scope.row.GzTag">&#xe604;</i>
          <div class="td-hover" @click="tdClick(scope)"><span>{{ scope.row.brxm }}</span></div>
        </template>
      </el-table-column>
      <el-table-column prop="sexAge" label="性别/年龄" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.brxb}}</span>&nbsp;/&nbsp;<span>{{scope.row.brage}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="outHspitalTime" label="出院时间" align="center"></el-table-column>
      <el-table-column prop="schemeName" label="随访方案" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dateEnd" label="随访时间" align="center"></el-table-column>
      <el-table-column prop="visitErrorInfo" label="随访异常结果" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="leavelDignose" label="出院诊断" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="diseaseInfoStr" label="医生审核意见" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
        <el-pagination  @current-change="pageChange" :current-page.sync="searchParam.pager" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                        :total="total" v-if="total">
        </el-pagination>
    </div>
    <!-- 弹框 -->
    <!-- 就诊档案 -->
    <patient-file
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :show-record-link="true"
      v-on:refreshData="refreshList"
      ref="patientFile"
    ></patient-file>
  </div>
</template>

<script>
  /**
   * 异常数据
   * @module abnormalStatistic
   */
  import { AbnormalStatistic } from 'HNDC_API/AbnormalStatistic';
  import patientFile from 'HNDC/common/patientFile';
  import { mapGetters } from 'vuex';

  // 随访时间，默认是当天
  const follow_default_time = [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 59))];
  function getToday() {
    const now_date = new Date();
    const year = now_date.getFullYear();
    const month = (now_date.getMonth() + 1 + '').padStart(2, '0');
    const day = (now_date.getDate() + '').padStart(2, '0');
    // month = month<10 ? `0${month}` : month;
    // day = day<10? `0${day}` : day;
    return `${year}-${month}-${day}`;
  }
  const today_format = getToday();
  const follow_default_time_format = [today_format + ' 00:00', today_format + ' 23:59'];
  export default {
    data() {
      return {
        searchParam: {
          patientName: '', // 患者姓名
          sex: '', // 性别
          schemeName: '', // 随访方案
          mobile: '', // 联系电话
          startDate: follow_default_time_format[0], // 随访时间开始时间
          endDate: follow_default_time_format[1], // 随访时间结束时间
          diagnoseStartDate: '', // 出院开始时间
          diagnoseEndDate: '', // 出院结束时间
          pager: 1,
          limit: 10
        },
        tableData: [], // 表格数据
        tableLoading: false,
        total: 0, // 表格数据总条数
        followTime: follow_default_time, // 随访时间-搜索
        outTime: [], // 出院时间-搜索
        sum_start: follow_default_time_format[0], // 表格上方的一行数据的时间
        sum_end: follow_default_time_format[1],
        pickerOptionsShortcuts: // 时间日期选择器的快捷方式数据
          {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date(new Date().setHours(23, 59, 59, 59));
                const start = new Date(new Date().setHours(0, 0, 0, 0));
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date(new Date().setHours(23, 59, 59, 59));
                const start = new Date(new Date().setHours(0, 0, 0, 0));
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date(new Date().setHours(23, 59, 59, 59));
                const start = new Date(new Date().setHours(0, 0, 0, 0));
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
        patientId: '', // 患者id--子组件props
        visitOrderId: '' // visitOrderId--子组件props
      };
    },
    computed: {
      ...mapGetters(['token']) // adminId
    },
    components: {
      patientFile
    },
    mounted() {
      this.getData();
    },
    methods: {
      /**
       * @description 刷新列表--供子组件使用
       * @function refreshList
       */
      refreshList() {
        this.getData();
      },
      /**
       * @description 获取表格数据
       * @function getData
       */
      getData() {
        this.tableLoading = true;
        this.tableData = [];
        this.total = 0;
        this.sum_start = this.searchParam.startDate;
        this.sum_end = this.searchParam.endDate;
        this.searchParam.adminId = this.token;
        AbnormalStatistic.list(this.searchParam)
          .then((res) => {
            this.tableLoading = false;
            res.data.forEach(value => {
              value.outHspitalTime = value.outHspitalTime ? value.outHspitalTime.split(' ')[0] : value.outHspitalTime;
              value.dateEnd = value.dateEnd ? value.dateEnd.substring(0, value.dateEnd.length - 3) : value.dateEnd;
            });
            this.tableData = res.data;
            this.total = res.count;
          })
          .catch(error => {
            console.log(error);
            this.tableLoading = false;
          });
      },
      /**
       * 分页
       * @function pageChange
       * @param {String} page 当前页码
       * @description
       */
      pageChange(page) {
        this.searchParam.pager = page;
        this.getData();
      },
      /**
       * @description 随访时间改变触发函数
       * @function followTimePick
       * @param  {array} date 返回的时间值数组
       */
      followTimePick(date) {
        if (date) {
          this.searchParam.startDate = date[0];
          this.searchParam.endDate = date[1];
        } else {
          this.searchParam.startDate = '';
          this.searchParam.endDate = '';
        }
      },
      /**
       * @description 出院时间改变触发函数
       * @function outTimePick
       * @param  {array} date 返回的时间值数组
       */
      outTimePick(date) {
        if (date) {
          this.searchParam.diagnoseStartDate = date[0];
          this.searchParam.diagnoseEndDate = date[1];
        } else {
          this.searchParam.diagnoseStartDate = '';
          this.searchParam.diagnoseEndDate = '';
        }
      },
      /**
       * @description 查询数据
       * @function searchBtn
       */
      searchBtn() {
        this.searchParam.pager = 1;
        this.getData();
      },
      /**
       * @description 导出数据
       * @function exportBtn
       */
      exportBtn() {
        AbnormalStatistic.export(this.searchParam);
      },
      /**
       *@function tdClick
       *@description 点击表格中的患者姓名
       */
      tdClick(scope) {
        this.patientId = scope.row.hzxxId;
        this.visitOrderId = scope.row.visitOrderId || '';
        setTimeout(() => {
          this.$refs.patientFile.toggleShowModal();
        }, 0);
      }
    }
  };
</script>
<style scoped>
  .pagination-container {
    padding: 15px;
    margin-top: 0;
    background-color: white;
  }
  .app-container .iconfont{
    color: #ff6e40;
    position: absolute;
    left: 15px;
  }
  .td-hover{
    cursor: pointer;
  }
  .td-hover:hover{
    color: #409EFF;
  }
</style>
