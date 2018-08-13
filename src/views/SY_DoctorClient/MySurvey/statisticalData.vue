<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li class="common_search_single common_search_single_time">
        <label class="radio-label" >季度</label>
        <el-select
          clearable
          v-show="index == tabActive"
          v-for="item,index in params"
          v-model="item.selectVal"
          placeholder="请选择"
          :key="`op${index}`"
        >
          <el-option
            v-for="op in item.selectOptions"
            :key="op.value"
            :label="op.label"
            :value="op.value">
          </el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <el-button type="primary" style="margin-right: 10px;" icon="el-icon-search" @click="searchBtn" :loading="params[0].loading || params[1].loading">查询</el-button>
        <el-button class="filter-item" type="primary"  icon="el-icon-download" @click="exportBtn">导出</el-button>
      </li>
    </ul>
    <!-- table -->
    <!-- tab切换 -->
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="item,index in params" :label="`${item.label}`" :key="index">
        <el-table :data="item.tableData"
                  border highlight-current-row
                  v-loading="item.loading"
        >
          <el-table-column prop="name" :label="index === '0' ? '医疗组' : '科室'" align="center"></el-table-column>
          <el-table-column prop="percent" :label="index === '0' ? '住院满意度' : '门诊满意度'" align="center"></el-table-column>
          <el-table-column prop="nice" label="满意" align="center"></el-table-column>
          <el-table-column prop="normal" label="一般" align="center"></el-table-column>
          <el-table-column prop="bad" label="不满意" align="center"></el-table-column>
        </el-table>

        <div class="pagination-container" v-if="item.total">
          <el-pagination
            @current-change="handlePage"
            :current-page.sync="item.pager"
            :page-size="limit"
            layout="total,prev, pager, next, jumper"
            :total="item.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import { MySurvey } from 'HNDC_API/MySurvey';
  const base_param ={
    selectOptions: [],
    selectVal: '',
    tableData: [],
    total: 0,
    pager: 1,
    loading: false
  };
  export default {
    name: 'AddUp',
    data() {
      return {
        tabActive: 0,
        params: {
          0: {
            ...base_param,
            activeType: 6,
            label: '住院满意度调查'
          },
          1: {
            ...base_param,
            activeType: 7,
            label: '门诊满意度调查'
          }
        },
        limit: 10
      };
    },
    mounted() {
      this.getSelectTime();
    },
    methods: {
      /**
       * @description 统计数据 查询添加初始化--select的数据获取
       * @function getSelectTime
       */
      getSelectTime() {
        MySurvey.satisfactionTime({
          activeType: this.params[this.tabActive].activeType // 类型(6:住院满意度,7：门诊满意度)
        }).then(res => {
          const options = [];
          const quarter_map = ['0', '第一季度(1-3月)', '第二季度(4-6月)', '第三季度(7-9月)', '第四季度(10-12月)'];
          if (!res.data) {
            return false;
          }
          for (const item of res.data) {
            const per_ops = {};
            per_ops.label = item.years + '年' + quarter_map[item.quarters];
            per_ops.value = item.years + '_' + item.quarters;
            options.push(per_ops);
          }
          this.params[this.tabActive].selectOptions = options;
          this.params[this.tabActive].selectVal = options[0].value;
          this.getTableData();
        }).catch(reason => {
          console.log(reason);
        });
      },
      /**
       *@description 获取表格数据
       *@function getTableData
       */
      getTableData() {
        const param = this.params[this.tabActive];
        param.loading = true;
        param.tableData = [];
        param.total = 0;
        const yearQuarters = param.selectVal;
        if (!yearQuarters) {
          this.$message.error('请选择季度!');
          param.loading = false;
          return false;
        }
        const year = yearQuarters.split('_')[0];
        const quarter = yearQuarters.split('_')[1];
        MySurvey.calculationResult({
          pager: param.pager,
          limit: this.limit,
          activeType: param.activeType, // 类型(6:住院满意度,7：门诊满意度)
          year: year, // 年份（如：2018）
          quarter: quarter // 季度（1:第一季度,2:第二季度,3:第三季度,4:第四季度）
        }).then(res => {
          param.loading = false;
          param.tableData = res.data;
          param.total = res.total;
        });
      },
      /**
       *@description 导出报表
       *@function searchBtn
       */
      exportBtn() {
        const yearQuarters = this.params[this.tabActive].selectVal;
        if (!yearQuarters) {
          this.$message.error('请选择季度!');
          return false;
        }
        const year = yearQuarters.split('_')[0];
        const quarter = yearQuarters.split('_')[1];
        MySurvey.calculationResultExport({
          activeType: this.params[this.tabActive].activeType, // 类型(6:住院满意度,7：门诊满意度)
          year: year, // 年份（如：2018）
          quarter: quarter // 季度（1:第一季度,2:第二季度,3:第三季度,4:第四季度）
        });
      },
      /**
       *@description 切换分页
       *@function handlePage
       */
      handlePage(val) {
        this.params[this.tabActive].pager = val;
        this.getTableData();
      },
      /**
       *@description 查询按钮
       *@function searchBtn
       */
      searchBtn() {
        this.getTableData();
      },
      /**
       *@description 列表上方的tab切换
       *@function handleClick
       *@param {object} tab tab信息
       *@param {event} event 点击事件
       */
      handleClick(tab, event) {
        this.tabActive = tab.index;
        if (this.params[this.tabActive].selectOptions.length === 0) {
          this.getSelectTime();
        }
      },
    }
  };
</script>
