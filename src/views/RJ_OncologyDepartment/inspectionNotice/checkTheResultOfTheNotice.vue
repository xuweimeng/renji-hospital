<template>
  <div class="app-container">
    <!-- 查询 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >患者姓名</label>
        <el-input v-model.trim="searchParams.name" clearable placeholder="请输入姓名"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系方式</label>
        <el-input v-model.trim="searchParams.mobile" clearable placeholder="请输入联系方式"></el-input>
      </li>
     <li class="common_search_single common_search_single_date">
          <label class="radio-label" >检查时间</label>
          <el-date-picker
              v-model='startTime'
              @change='timeChange'
              type="daterange"
							value-format="yyyy-MM-dd"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
              :picker-options="pickerTime">
            </el-date-picker>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >检查项目</label>
        <el-select v-model='searchParams.icdCheckItem' clearable filterable  placeholder='请选择'>
          <el-option
            v-for='item in ProjectList'
            :key='item.icd10'
            :label='item.jbmc'
            :value='item.icd10'>
            </el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >状态</label>
        <el-select v-model="searchParams.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="已通知" value="2"></el-option>
          <el-option label="通知失败" value="3"></el-option>
          <el-option label="已取消" value="4"></el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <el-button type="primary" icon="el-icon-search" @click="searchParams.pager=1,getData()">查询</el-button>
      </li>
    </ul>
  
    <el-table border :data="tableData" style="width: 100%;" v-loading="dataLoading">
      <el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
      <el-table-column label="性别/年龄" align="center" width="115">
        <template slot-scope="scope">
          {{scope.row.brxb}} <span v-if="scope.row.brxb && scope.row.age">/</span> {{scope.row.age}}
        </template>
      </el-table-column>
      <el-table-column prop="icdName" label="检查项目" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderTime" label="检查时间" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="vetRemark" label="通知结果" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="vetDate" label="通知时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusStr" label="状态" align="center" width="100"></el-table-column>
      <el-table-column label="检查详情" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detailBtn(scope.row)">检查详情</el-button>
        </template>
      </el-table-column>
    </el-table>
      
    <div class="pagination-container" style="text-align:right;margin-top:15px;">
      <el-pagination style="display:inline-block" background  @current-change="handleCurrentChange" :current-page="searchParams.pager"  :page-size="searchParams.limit" layout="total,  prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
    	<!-- 步骤一已预约检查 -->
    <checked-list
      :infoShow2="infoShow"
      :checkListData="gridData"
      @closeDialog="closeList">
    </checked-list>
  </div>
</template>
<script>
import { InspectionNotice } from 'RJZL_API/InitiateNotification';
import { commonUrl } from 'RJZL_API/commonUrl';
import AdResult from '@/components/dialog/aDresult/ppResult';
import CheckedList from './checkedList/checkedList';
import * as getTime from 'utils/getDate';
import * as utilsIndex from 'utils';
export default {
  name: 'checkTheResultOfTheNotice',
  data() {
    return {
      totalPage: null, // 总页数
      /* 搜索条件 */
      searchParams: {
        pager: 1, // 当前页码
        limit: 10, // 每页条数
        name: '', // 患者姓名（可选）
        startOrderTime: '', // 生成开始时间（可选）
        endOrderTime: '', // 生成结束时间（可选）
        mobile: '', // 联系方式
        icdCheckItem: '', // 疾病名称
        status: '' // '0 等待通知 1 通知中 2 已随访 3 通知失败 4 已取消'
      },
      startTime: [],
      tableData: [],
      dataLoading: false, // 表格数据请求等待
      infoShow: false, // 详情弹窗
      ProjectList: [], // 检查项目
      gridData: [],
      pickerTime: {
        shortcuts: utilsIndex.pickerOptions
      }
    };
  },
  components: {
    AdResult,
    CheckedList
  },
  mounted() {
    this.getCurrent();
    this.getProjectList();
    this.getData();
  },
  methods: {
    /** 随访日期 */
    getCurrent() {
      this.searchParams.startOrderTime = getTime.currentTime + ' ' + '00:00:00';
      this.searchParams.endOrderTime = getTime.currentTime + ' ' + '23:59:59';
      this.startTime = [this.searchParams.startOrderTime, this.searchParams.endOrderTime];
    },
    /** 获取检查项目列表 */
    getProjectList() {
      commonUrl.getdiseasefix({
        diseasetype: '2'
      }).then(res => {
        this.ProjectList = res.data;
      });
    },
    /** @description
     * 创建时间更改
     */
    timeChange(time) {
      if (time) {
        this.searchParams.startOrderTime = time[0] + ' ' + '00:00:00';
        this.searchParams.endOrderTime = time[1] + ' ' + '23:59:59';
      } else {
        this.searchParams.startOrderTime = '';
        this.searchParams.endOrderTime = '';
      }
    },
    searchBtn() {
      this.searchParams.pager = '1';
      this.getData();
    },
    /* 获取数据 */
    getData() {
      this.dataLoading = true;
      InspectionNotice.clinetQueryCheck(this.searchParams).then(res => {
        this.dataLoading = false;
        this.tableData = res.data;
        if (this.searchParams.pager === 1) {
          this.totalPage = res.count;
        }
      });
    },
    /** 分页 */
    handleCurrentChange(page) {
      this.dataLoading = true;
      this.searchParams.pager = page;
      this.getData();
    },
    /** 详情 */
    detailBtn(rows) {
      this.infoShow = true;
      this.getDetails(rows);
    },
    /**
     * 获取详情数据
     */
    getDetails(rows) {
      InspectionNotice
        .queryCheckDetail({
          hzxxId: rows.hzxxId,
          orderTime: rows.orderTime.slice(0, 10)
        })
        .then(res => {
          if (res.code == 0) {
            this.gridData = res.data;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(error => {});
    },
    /**
     * 关闭已预约的弹框
     */
    closeList(value) {
      this.infoShow = value;
    }
  }
};
</script>
<style lang="scss">
  @import '~styles/search';
  .checkTheResultOfTheNotice {
  }
</style>