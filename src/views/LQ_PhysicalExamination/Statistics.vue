<template>
  <div class="app-container">
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input  placeholder="姓名"  v-model="searchParams.brxm"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系电话 </label>
        <el-input  placeholder="联系电话"  v-model="searchParams.mobile"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >身份证号</label>
        <el-input  placeholder="身份证号"  v-model="searchParams.sfzh"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >通知结果</label>
        <el-input  placeholder="通知结果"  v-model="searchParams.vetRemark"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >通话状态</label>
        <el-select clearable  class="filter-item" v-model="searchParams.backStatus" placeholder="通话状态">
          <el-option v-for="item in statusList" :key="item" :label="statusList[item]" :value="item">
          </el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >是否过来</label>
        <el-select clearable  class="filter-item" v-model="searchParams.isCome" placeholder="是否过来">
        <el-option  label="来" :value="1">
          </el-option>
          <el-option  label="不来" :value="0">
          </el-option>
        </el-select>
      </li>
      <li class="common_search_single">
         <label class="radio-label">实际是否体检</label>
        <el-select clearable  class="filter-item" v-model="searchParams.actualIsCome" placeholder="实际是否体检">
          <el-option  label="等待"  :value="0" ></el-option >
          <el-option  label="已体检"  :value="1"></el-option >
        </el-select>
      </li>
      <li class="common_search_single">
        <label class="radio-label">是否已导出</label>
        <el-select clearable  class="filter-item" v-model="searchParams.isExport" placeholder="是否已导出">
          <el-option  label="是" :value="1" ></el-option >
          <el-option  label="否"  :value="0"></el-option >
        </el-select>
      </li>
      <li class="common_search_single common_search_single_time">
          <label class="radio-label">通知时间</label>
          <el-date-picker
								@change="timeChange"
								v-model="noticeTime"
								type="datetimerange"
								start-placeholder="开始日期"
					      end-placeholder="结束日期">
            </el-date-picker>
      </li>
      <li class="common_search_single">
        <el-button style='margin-right:10px;' type="primary" icon="el-icon-search"  @click="searchData" :loading="listLoading">查询</el-button>
        <el-button class="filter-item" type="primary"  icon="el-icon-download" @click="dataDownload">导出</el-button>
      </li>
    </ul>
    <el-alert style="white-space: pre;"
      :closable="false"
      :title="`查询结果：已通知人次:${callCount}人    已确认到场:${isComeCount}人    参与体检人数:${actualIsComeCount}人`"
      type="success">
    </el-alert>
    <el-table @selection-change="handleSelectionChange" style="margin-top:10px" :data="list" v-loading="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column type="selection" align="center" width="50">
      </el-table-column>
      <el-table-column align="center" label='姓名'  prop="brxm">
      </el-table-column>
      <el-table-column align="center" label="联系电话" prop="mobile">
      </el-table-column>
      <el-table-column align="center" label="身份证号" prop="sfzh">
      </el-table-column>
      <el-table-column align="center" label="体检时间" prop="orderTime">
      </el-table-column>
      <el-table-column align="center" label="通知时间" prop="DateEnd">
      </el-table-column>
      <el-table-column align="center" label="通知结果" prop="vetRemark">
      </el-table-column>
      <el-table-column align="center" label="通话状态" >
        <template slot-scope="scope">
          <el-tag v-show="statusList[scope.row.backStatus]">{{statusList[scope.row.backStatus]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否已导出">
        <template slot-scope="scope">
          {{scope.row.isExport==1?"是":"否"}}
          </template>
      </el-table-column>

      <el-table-column align="center" label="是否过来" >
        <template slot-scope="scope">
        {{scope.row.isCome==1?"是":"否"}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际是否体检" >
        <template slot-scope="scope">
         {{scope.row.actualIsCome==1?"已体检":"等待"}}
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align:right">
      <el-button style='margin-right:10px;float:left' type="primary" icon="el-icon-edit"  @click="notification" >发起通知</el-button>
      <el-pagination style="display:inline-block" background  @current-change="pageChange" :current-page="searchParams.pager"  :page-size="searchParams.limit" layout="total,  prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils';
import { Statistics } from 'LQPE_API/Statistics';

export default {
  name: 'Statistics',
  data() {
    return {
      noticeTime: null,
      list: null,
      listLoading: false,
      searchParams: {
        pager: 1, // 当前页码
        limit: 10, // 每页条数
        brxm: null, // 姓名
        mobile: null, // 手机号
        sfzh: null, // 身份证号
        vetRemark: null, // 通知结果
        backStatus: null, // 通话状态
        isCome: null, // 电话中是否过来（1是0不是）
        actualIsCome: null, // 实际是否过来（1是0不是）
        isExport: null, // 是否导出过  （1是0不是）
        startDateEnd: null, // 通知时间
        endDateEnd: null
      },
      total: 0,
      statusList: {
        1: '呼叫失败',
        2: '正常通话',
        3: '通话中',
        4: '关停机',
        5: '无人接听',
        6: '空号',
        7: '号码有误'
      },
      callCount: 0,
      actualIsComeCount: 0,
      isComeCount: 0,
      idList: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      Statistics.getHealthExamStatisticList(
        this.searchParams
      ).then(res => {
        this.list = res.data.healthExamStatisticVoList;
        this.listLoading = false;
        if (res.total) {
          this.total = res.total;
        }
        this.callCount = res.data.callCount;
        this.isComeCount = res.data.isComeCount;
        this.actualIsComeCount = res.data.actualIsComeCount;
      }).catch(err => {
        console.log(err);
      });
    },
    searchData() {
      this.searchParams.pager = 1;
      this.fetchData();
    },
    /**
     * @function 导出数据
     * @return {type} {description}
     */
    dataDownload() {
      const currentParams = deepClone(this.searchParams);
      delete currentParams.pager;
      delete currentParams.limit;
      let getParams = '';
      for (const item in currentParams) {
        getParams += (item + '=' + currentParams[item] + '&');
      }
      window.open(Statistics.exportHealthExamStatistic + '?' + getParams);
    },
    /**
     * @function 时间切换函数
     * @param  {type} date {description}
     * @return {type} {description}
     */
    timeChange(date) {
      if (!date) {
        this.searchParams.startDateEnd = null;
        this.searchParamsendDateEnd = null;
        return false;
      }
      this.searchParams.startDateEnd = date[0];
      this.searchParamsendDateEnd = date[1];
    },
    pageChange(page) {
      console.log(page);
      this.searchParams.pager = page;
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.idList = [];
      for (const item of val) {
        this.idList.push(item.hzxxId);
      }
    },
    notification() {
      localStorage.setItem('idList', JSON.stringify(this.idList));
      this.$router.push({
        path: '/AdNotice'
      });
    }
  }
};
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>

