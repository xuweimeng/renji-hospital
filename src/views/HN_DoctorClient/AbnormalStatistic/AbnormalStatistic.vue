<template>
  <div class="abnormalStatistic">
    <!-- 搜索 -->
    <el-row class="form-search">
      <el-col :span="24">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
          <el-form-item label="姓名" class="inputLength">
            <el-input v-model.trim="searchParam.patientName" clearable placeholder="请输入患者姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" class="seclectLength">
            <el-select v-model="searchParam.sex" placeholder="请选择" popper-class="searchSelect">
              <el-option label="全部" value=""></el-option>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" class="inputLength">
            <el-input v-model.trim="searchParam.mobile" clearable placeholder="请输入患者电话"></el-input>
          </el-form-item>
          <el-form-item label="随访方案" class="inputLength">
            <el-input v-model.trim="searchParam.schemeName" clearable placeholder="请输入随访方案"></el-input>
          </el-form-item>
          <el-col :span="24" style="margin-top: 20px;height: 50px;">
          <el-form-item label="随访时间" class="seclectLength">
            <el-date-picker
              v-model="followTime"
              popper-class="popper-timepicker"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              default-time="00:00"
              size="mini"
              @change="followTimePick"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="出院时间" class="seclectLength">
            <el-date-picker
              v-model="outTime"
              popper-class="popper-timepicker"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="mini"
              @change="outTimePick"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="searchBtn">
            <el-button type="button" @click="searchBtn">查询</el-button>
          </el-form-item>
            <el-form-item class="searchBtn exportBtn">
              <el-button type="button" @click="exportBtn">导出数据</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="info-tag">
      <span v-show="sum_start">{{sum_start}}至{{sum_end}}</span>
      异常指标人数共计：{{total}}人
    </el-row>
    <el-table :data="tableData" style="width: 1110px" class="rsTable" v-loading="tableLoading">
      <el-table-column prop="brxm" label="姓名" align="center" width="70"></el-table-column>
      <el-table-column prop="sexAge" label="性别/年龄" align="center" width="90">
        <template slot-scope="scope">
          <span>{{scope.row.brxb}}</span>&nbsp;/&nbsp;<span>{{scope.row.brage}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="outHspitalTime" label="出院时间" align="center"></el-table-column>
      <el-table-column prop="schemeName" label="随访方案" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dateEnd" label="随访时间" align="center" width="140"></el-table-column>
      <el-table-column prop="visitErrorInfo" label="随访异常结果" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="leavelDignose" label="出院诊断" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="diseaseInfoStr" label="医生审核意见" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="rsfy">
      <el-col :span="14" :offset="10" style="margin-top: 11px;">
        <el-pagination  @current-change="pageChange" :current-page.sync="searchParam.pager" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                        :total="total" v-if="total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
 * 异常数据
 * @module abnormalStatistic
 */
import { AbnormalStatistic } from '@/api/HN_DoctorClient/AbnormalStatistic'

// 随访时间，默认是当天
const follow_default_time = [new Date(new Date().setHours(0, 0, 0, 0)),new Date(new Date().setHours(23, 59, 59, 59))];
function getToday() {
  let now_date = new Date();
  let year = now_date.getFullYear();
  let month = (now_date.getMonth()+1+'').padStart(2,'0');
  let day = (now_date.getDate()+'').padStart(2,'0');
  // month = month<10 ? `0${month}` : month;
  // day = day<10? `0${day}` : day;
  return `${year}-${month}-${day}`;
}
const today_format = getToday();
const follow_default_time_format = [today_format+' 00:00',today_format+' 23:59'];
  export default {
    data() {
      return {
        userId: '', //医生id sessionStorage中
        searchParam: {
          patientName: '', // 患者姓名
          sex: '', // 性别
          schemeName: '', // 随访方案
          mobile: '', // 联系电话
          startDate: follow_default_time_format[0], //随访时间开始时间
          endDate: follow_default_time_format[1], //随访时间结束时间
          diagnoseStartDate: "", // 出院开始时间
          diagnoseEndDate: "", // 出院结束时间
          pager: 1,
          limit: 10,
        },
        tableData: [], // 表格数据
        tableLoading: false,
        total: 0, // 表格数据总条数
        followTime: follow_default_time, // 随访时间-搜索
        outTime: [], // 出院时间-搜索
        sum_start: follow_default_time_format[0], // 表格上方的一行数据的时间
        sum_end: follow_default_time_format[1],
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
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
        AbnormalStatistic.list(this.searchParam)
          .then( (res) => {
            this.tableLoading = false;
            res.data.forEach( value => {
              value.outHspitalTime = value.outHspitalTime ? value.outHspitalTime.split(' ')[0] : value.outHspitalTime;
              value.dateEnd = value.dateEnd ?  value.dateEnd.substring(0,value.dateEnd.length-3) : value.dateEnd;
            });
            this.tableData = res.data;
            this.total = res.count;
          })
          .catch(error => {
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
          this.searchParam.diagnoseStartDate = "";
          this.searchParam.diagnoseEndDate = "";
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
    }
  }
</script>

<style lang="scss">
 /*@import '../../assets/scss/mixin';*/
 /*@import '../../assets/scss/reset';*/
 /*@import '../../common/style/base';*/
  /*************搜索************/
 .abnormalStatistic{
   .form-search {
     background: #fff;
     border-bottom: 13px solid #ececec;
     .el-col {
       .el-form {
         /*height: 52px;*/
         padding-left: 25px;
         .el-form-item{
           margin-bottom: 5px;
           float: left;
         }
         //姓名，随访方案，疾病诊断
         .inputLength{
           margin-bottom: 0;
           float: left;
           height: 26px;
           .el-form-item__label {
             height: 26px;
             line-height: 52px;
             color: #333;
             font-size: 13px;
             padding-right: 10px;
           }
           .el-form-item__content{
             height: 26px;
             line-height: 52px;
             .el-input {
               width: 125px !important;
               height: 26px;
               .el-input__inner {
                 border-radius: 12px;
                 height: 26px;
                 padding-left: 5px;
               }
             }
           }
         }
         //性别
         .seclectLength{
           margin-bottom: 0;
           float: left;
           height: 26px;
           .el-form-item__label {
             height: 26px;
             line-height: 52px;
             color: #333;
             font-size: 13px;
             padding-right: 10px;
           }
           .el-form-item__content{
             height: 26px;
             line-height: 52px;
             .el-input {
               width: 90px;
               height: 26px;
               .el-input__inner {
                 border-radius: 12px;
                 height: 26px;
                 text-align: center;
               }
             }
           }
         }
         .el-input__inner{
           border-radius: 18px;
         }
         //搜索,导出
         .searchBtn{
           margin-bottom: 0;
           height: 26px;
           .el-form-item__label {
             height: 26px;
             line-height: 52px;
             color: #333;
             font-size: 13px;
             padding-right: 10px;
           }
           .el-form-item__content{
             height: 26px;
             line-height: 40px;
             .el-button {
               height: 26px;
               line-height: 0;
               margin-top: 13px !important;
               background: #fff9f7;
               border-color: #fdd3c4;
               color: #ff6e40;
               font-size: 14px;
             }
           }
         }
         .el-form-item:last-child.exportBtn{
           .el-form-item__content {
             .el-button {
               background: #ecf5ff;
               border-color: #b3d8ff;
               color: #409eff;
             }
           }
         }
       }
     }
   }
   .el-input--suffix .el-input__inner{
     border-radius: 12px;
     height: 26px;
     text-align: center;
   }
   .info-tag{
     background-color: white;
     text-align: left;
     margin: 0 15px;
     margin-top: 10px;
     padding-left: 10px;
     height: 50px;
     line-height: 50px;
     border: 1px solid #ccc;
     border-radius: 5px;
   }
 }
 .popper-timepicker{
   top: 168px !important;
 }
</style>
