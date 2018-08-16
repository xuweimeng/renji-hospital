<style lang="scss" scoped>
  .common_search{
    .el-checkbox{
      background-color: white;
      margin-right: 5px;
      &-group{
        height: 36px;
        line-height: 36px;
      }
    }
  }
  .common_search_single_all_line{
    width: 100%;
  }
  .pagination-container {
    padding: 15px;
    margin-top: 0;
    background-color: white;
  }
</style>
<template>
  <div class="app-container">
    <!-- 查询 -->
    <ul class="common_search">
      <li class="common_search_single common_search_single_all_line">
        <label class="radio-label">通话状态</label>
        <el-checkbox :indeterminate="isIndeterminateMobileStatus" v-model="isCheckAllmobileStatus" @change="handleCheckAllChangeStatus">全选</el-checkbox>
        <el-checkbox-group v-model="form.backStatuss" @change="checkedmobileStatus">
          <el-checkbox v-for="(item, index) in mobileStatusList" :label="index+1" :key="item">{{item}}</el-checkbox>
        </el-checkbox-group>
      </li>
      <li class="common_search_single common_search_single_time">
        <label class="radio-label">接听人身份</label>
        <el-checkbox :indeterminate="isIndeterminateMobilePerson" v-model="isCheckAllmobilePerson" @change="handleCheckAllChangePerson">全选</el-checkbox>
        <el-checkbox-group v-model="fieldValues1" @change="checkedmobilePerson">
          <el-checkbox v-for="(item, index) in mobilePersonList" :label="index+1" :key="item">{{item}}</el-checkbox>
        </el-checkbox-group>
      </li>
      <li class="common_search_single common_search_single_time">
        <label class="radio-label">随访日期</label>
        <el-date-picker
          v-model="dateTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptionsShortcuts"
          @change="changeTime"
        >
        </el-date-picker>
      </li>
      <li class="common_search_single">
        <el-button style='margin-right:10px;' type="primary" icon="el-icon-search"  @click="searchBtn" :loading="loading">查询</el-button>
        <el-button class="filter-item" type="primary"  icon="el-icon-download" @click="exportExcel">导出</el-button>
      </li>
    </ul>
    <el-table
      :data="tableAll"
      border highlight-current-row
      v-loading="loading">
      <el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
      <el-table-column prop="xbnl" label="性别/年龄" align="center"></el-table-column>
      <el-table-column prop="schemeName" label="随访方案" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dateEnd" label="随访时间" align="center"></el-table-column>
      <el-table-column prop="backStatusStr" label="通话状态" align="center"></el-table-column>
      <el-table-column prop="resultStatusStr" label="采集情况" align="center"></el-table-column>
      <el-table-column prop="fieldValue" label="接听人身份" align="center"></el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="form.pager"
        :page-size="form.limit"
        layout="total,prev, pager, next, jumper"
        :total="totalPage"
        v-show="tableAll.length">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { DataAddUp } from 'KMJB_API/DataAddUp';
  // import * as getTime from '@/common/js/getDate';
  // import { parseTime } from '@/utils/index.js';
  export default {
    name: 'returnVisit',
    data() {
      return {
        mobileStatusList: ['呼叫失败', '正常通话', '通话中', '关停机', '无人接听', '空号', '号码有误'], // 通话状态list
        mobileStatusList1: [1, 2, 3, 4, 5, 6, 7],
        mobilePersonList: ['本人', '家属', '号码错误'], // 接听人身份List
        mobilePersonList1: [1, 2, 3],
        isIndeterminateMobileStatus: true, // 通话状态indeternibate
        isCheckAllmobileStatus: false, // 通话状态checkall
        isIndeterminateMobilePerson: true, // 接听人身份indeternibate
        isCheckAllmobilePerson: false, // 接听人身份checkall
        dateTime: '', // 随访日期
        fieldValues1: [1, 2, 3],
        form: {
          backStatuss: [1, 2, 3, 4, 5, 6, 7], // 通话状态
          fieldValues: [0], // 接听人身份
          dateEndBegin: '', // 开始时间
          dateEndEnd: '', // 结束时间
          pager: 1,
          limit: 10
        },
        tableAll: [],
        loading: false,
        totalPage: null,
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
          }
      };
    },
    mounted() {
      // this.getCurrent()
      this.list();
    },
    methods: {
      // 设置查询时间
      // getCurrent() {
      //   // let currentDate1;
      //   // getTime.currentDate - 3 > 0 ? currentDate1 = getTime.currentDate - 3 : currentDate1 = 1;
      //   // const date1 = getTime.currentTime1 + currentDate1 + ' ' + '00:00:00';
      //   // const date2 = getTime.currentTime + ' ' + '23:59:59';
      //   this.dateTime = [parseTime(new Date().setHours(0, 0, 0, 0)), parseTime(new Date().setHours(23, 59, 59, 59))];
      // },
      /** 通话状态全选  */
      handleCheckAllChangeStatus(val) {
        this.form.backStatuss = val ? this.mobileStatusList1 : [];
        this.isIndeterminateMobileStatus = false;
      },
      checkedmobileStatus(value) {
        const checkedCount = value.length;
        this.isCheckAllmobileStatus = checkedCount === this.mobileStatusList.length;
        this.isIndeterminateMobileStatus = checkedCount > 0 && checkedCount < this.form.backStatuss.length;
      },
      /** 接听人全选  */
      // 备注： 后台要求全选时传0，非全选时传下标
      handleCheckAllChangePerson(val) {
        this.fieldValues1 = val ? this.mobilePersonList1 : [];
        this.isIndeterminateMobilePerson = false;
        if (val) {
          this.form.fieldValues ? this.form.fieldValues.length = 0 : this.form.fieldValues;
          this.form.fieldValues.push(0);
        } else {
          this.form.fieldValues.length = 0;
        }
      },
      checkedmobilePerson(value) {
        const checkedCount = value.length;
        this.isCheckAllmobilePerson = checkedCount === this.mobilePersonList.length;
        this.isIndeterminateMobilePerson = checkedCount > 0 && checkedCount < this.fieldValues1.length;
        if (value.length === 3) {
          this.form.fieldValues ? this.form.fieldValues.length = 0 : this.form.fieldValues;
          this.form.fieldValues.push(0);
        } else {
          this.form.fieldValues ? this.form.fieldValues.length = 0 : this.form.fieldValues;
          this.form.fieldValues = [...this.fieldValues1];
        }
      },
      /** 随访日期  */
      changeTime(value) {
        if (value) {
          this.form.dateEndBegin = value[0];
          this.form.dateEndEnd = value[1];
        } else {
          this.form.dateEndBegin = '';
          this.form.dateEndEnd = '';
        }
      },
      /** 分页 */
      handleCurrentChange(val) {
        this.form.pager = val;
        this.list();
      },
      /** 查询  */
      searchBtn() {
        this.form.pager = 1;
        this.list();
      },
      /** 查询  */
      list() {
        this.loading = true;
        DataAddUp.query(this.form)
          .then(res => {
            this.loading = false;
            if (res.code === 0) {
              this.tableAll = res.data;
              this.totalPage = res.total;
            }
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
          });
      },
      /** 导出 */
      exportExcel() {
        if (!this.form.dateEndBegin || !this.form.dateEndEnd) {
          this.$message.error('请填写开始时间和结束时间！');
        } else {
          // const data1 = this.form.backStatuss.join(',');
          // const data2 = this.form.fieldValues.join(',');
          const param = {
            dateEndBegin: this.form.dateEndBegin,
            dateEndEnd: this.form.dateEndEnd,
            backStatuss: this.form.backStatuss.join(','),
            fieldValues: this.form.fieldValues.join(',')
          };
          DataAddUp.returnVisitExport(param);

          // let pp=`http://192.168.1.218:8095/statistic/returnVisit/export?backStatuss=${data1}&dateEndBegin=${this.form.dateEndBegin}&dateEndEnd=${this.form.dateEndEnd}&fieldValues=${data2}`
          // window.location.href = `/statistic/returnVisit/export?backStatuss=${data1}&dateEndBegin=${this.form.dateEndBegin}&dateEndEnd=${this.form.dateEndEnd}&fieldValues=${data2}`;
          // console.log(pp);
        }
      }
    }
  };
</script>
