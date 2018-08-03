<template>
  <div class="activity">
    <!-- 搜索 -->
    <el-row class="followwayRow">
      <el-col :span="24">
        <el-form :inline="true" :model="followwaySearch" class="demo-form-inline">
          <el-form-item label="通知方案" class="inputLength">
            <el-input v-model.trim="followwaySearch.taskName" clearable placeholder="请输入引用随访方案"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="button" @click="waySearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 活动通知 -->
    <el-row class="hztz">
      <el-col :span="24">
        <el-table :data="tableAll" style="width: 1110px;margin-left:10px;" ref="patientlist" class="wayTable" v-loading="loading1">
          <el-table-column prop="taskName" label="通知计划名称" align="center">
          </el-table-column>
          <el-table-column prop="schemeName" label="通知方案" align="center">
          </el-table-column>
          <el-table-column prop="visitStartTime" label="开始通知时间" align="center">
          </el-table-column>
          <el-table-column label="状态" align="center" prop="statusStr"></el-table-column>
          <el-table-column prop="eatDrugInfo" label="完成进度" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.activityCount?scope.row.visitCount - scope.row.activityCount:'0'}}</span>&nbsp;/&nbsp;<span>{{scope.row.visitCount?scope.row.visitCount:0}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="活动详情" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="wayButton(scope)" style="height:23px;width:52px;padding:0;font-size
              :13px;">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="block">
          <el-col :span="14" :offset="10">
            <el-pagination  @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="10" layout="total,prev, pager, next, jumper"
              :total="totalPage1" v-if="tableAll.length">
            </el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- model -->
    <el-dialog  :visible.sync="dialogVisible" width="30%" :before-close="handleClose" @center="false" custom-class="activityDialog">
      <div slot="title" style="text-align: left;" class="aTitle">详情</div>
      <div class="details">
         <el-row style="height: 165px;background:#fff8f6;margin-bottom: 20px;">
          <el-col :span="24">
            <span style="font-size: 16px;font-weight:bold;line-height:30px;">{{modelContent.taskName}}</span>
           <!--  <p style="margin-top: 20px;">{{modelContent.remark}}</p> -->
            <p style="margin-top: 20px;">{{modelContent.remark}}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">当前通知进度&nbsp;:&nbsp;</el-col>
          <el-col :span="14"><el-progress :text-inside="true" :stroke-width="18" :percentage="numberPercent" status="success"></el-progress></el-col>
          <el-col :span="4">共{{modelContent.visitCount}}人</el-col>
        </el-row>
        
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 活动通知function列表
 * @module activityTo
 */
import {API} from '@/serve'
import echarts from 'echarts'
  export default {
    data() {
      return {
        followwaySearch: {
          taskName: '',//通知方案
        },
        tableAll: [],//全部患者表格data
        totalPage1: 0, //全部患者表格data总数量
        loading1: false,//全部患者刷新
        currentPage3: 1,
        patientId: '',//病人id
        dialogVisible: false,//model弹框
        modelContent: {},
        numberPercent: 0,//未通知人数百分比
      }
    },

    mounted() {
      this.getUserId()
      this.list(1)
    },
    methods: {
      /**
      * 从sessionStorage获取医生id
      * @function getUserId
      * @param {String} userId 获取医生id
      */
      getUserId() {
        this.userId = this.$store.state.user.token//用户名
      },

     /**
      * 通知方案列表
      * @function list
      * @param {String} adminId 医生Id
      * @param {String} schemeName 通知方案名称
      * @param {String} pager 当前页码
      * @param {String} limit 每页显示条数
      */
      list(page) {
        this.loading1 = true
        API.activityTo.list({
          'adminId': this.userId,
          'schemeName': this.followwaySearch.taskName,
          'pager': page,
          'limit': '10'
        }).then((res)=>{
          this.loading1 = false
          if(res.code == 0) {
            this.tableAll = res.data
            this.totalPage1 = res.count
          }
        }).catch((error)=>{
          this.loading1 = false
          console.log(error)
        })
      },
      /**
      * 分页
      * @function handleCurrentChange
      * @param {String} val 当前页码
      */
      handleCurrentChange(val) {
        this.loading1 = true
        this.list(val)
      },
      /**
      * 查询
      * @function waySearch
      * @param {String} 1 返回第一页
      */
      waySearch() {
        this.loading1 = true
        this.list(1)
      },
      /**
      * 关闭弹框
      * @function handleClose
      * @param {String} done 关闭弹框
      */
      handleClose(done) {
        done();
      },
      /**
      * 详情弹框
      * @function wayButton
      * @param {Object} scope 点击列表的scope的信息
      */
      wayButton(scope) {
        this.dialogVisible = true
        this.modelContent = scope.row
        if(scope.row.activityCount) {
          this.numberPercent = (Number(scope.row.visitCount)-Number(scope.row.activityCount))/Number(scope.row.visitCount) *100
        }else {
          this.numberPercent = 0
        }
      }
    }
  }
</script>

<style lang="scss">

 @import '../../assets/scss/mixin';
 @import '../../assets/scss/reset';
  .activity {
    background: $background;
    .followwayRow {
      height: 52px;
      margin-bottom: 10px;
      background: $white;
      .el-col {
        .el-form {
          height: 52px;
          padding-left: 25px;
          .el-form-item:nth-of-type(1) {
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
                width: 179px;
                height: 26px;
                .el-input__inner {
                  border-radius: 12px;
                  height: 26px;
                  padding-left: 5px;
                }
              }
            }
          }
          .el-form-item:nth-of-type(2) {
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
              .el-button {
                height: 26px;
                line-height: 0;
                margin-top: 13px;
                background: #fff9f7;
                border-color: #fdd3c4;
                color: #ff6e40;
                font-size: 14px;
                border-radius: 16px;
              }
            }
          }
        }
      }
    }
  }
  .hztz {
    width: 100%;
    background: #fff;
  }
  //表格
  .wayTable {
    //表头
    .el-table__header-wrapper .el-table__header thead tr th{
      color: #888;
      font-weight: normal;
      .is-leaf{
        border: 0!important;
      }
    }
    //tbody
    .el-table__body-wrapper {
      .el-table__body tbody{
        //tr
        .el-table__row {
          td {
            padding: 8px 0;
            .cell {
              padding: 0;
            }
          }
        }
      }
    }
  } 
  // .el-table__header, .el-table__body{
  //   width: 1110px!important;
  // }
  
  //分页
  .block {
    height: 40px;
    background: #fff;
    .el-pagination {
      padding-top: 8px;
    }
  }
  //弹框
  .activityDialog {
    .el-dialog__header {
      border-bottom: 1px solid #e6e6e6;
      .aTitle {
        font-size: 16px;
      }
    }
    .el-dialog__body {
      padding: 20px;
    }
  }
</style>
