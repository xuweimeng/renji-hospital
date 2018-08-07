<template>
	<div class="app-container">
		<!-- 步骤 -->
		<el-row>
		  <el-col :span="12" :offset="6">
				<el-steps :active="step"  align-center process-status="finish" finish-status="success">
					<el-step title="选择客户"></el-step>
					<el-step title="选择方案"></el-step>
					<el-step title="发起成功"></el-step>
				</el-steps>
		  </el-col>
		  <el-col :span="6"></el-col>
		</el-row>
		<!-- 步骤一 -->
		<transition name="el-zoom-in-top">
		<div class="stepContent" v-if="step === 0">
			<el-row class="upnum" style="margin-bottom: 10px;">
				<el-col :span="24">
          <el-alert
            :closable="false"
            title="请选择需要通知的客户"
            type="warning"
            show-icon>
          </el-alert>
        </el-col>
			</el-row>
			<!-- 查询 -->
      <ul class="common_search" style="margin-top:10px">
        <li class="common_search_single">
          <label class="radio-label" >姓名</label>
          <el-input v-model="searchParams.brxm" placeholder="请输入姓名" clearable></el-input>
        </li>
        <li class="common_search_single">
          <label class="radio-label" >联系电话</label>
          <el-input v-model="searchParams.mobile" placeholder="请输入联系电话" clearable></el-input>
        </li>
        <li class="common_search_single">
          <label class="radio-label" >身份证号</label>
          <el-input v-model="searchParams.idNunber" placeholder="请输入身份证号" clearable></el-input>
        </li>
        <li class="common_search_single">
          <label class="radio-label" >体检套餐</label>
          <el-select
            v-model="searchParams.physicalName"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入体检套餐"
            :remote-method="remoteMethod"
            :loading="queryLoading">
            <el-option
              v-for="item in diseaseList"
              :key="item.id"
              :label="item.name"
              :value="item.icd">
            </el-option>
          </el-select>
        </li>
        <li class="common_search_single common_search_single_time">
          <label class="radio-label" >预约时间</label>
            <el-date-picker
              @change="timeChange"
              v-model="startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              :picker-options="pickerOptions"
              end-placeholder="结束日期">
            </el-date-picker>

        </li>
        <li class="common_search_single">
          <el-button type="primary" icon="el-icon-search" @click="searchParams.pager=1,getData()" >查询</el-button>
        </li>
      </ul>
			<!-- 通知患者 -->
			<el-row>
				<el-col :span="24">
					<el-table :data="dataList"  class="upTable" ref="multipleTable" border fit highlight-current-row>
						<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
						<el-table-column prop="jtdh" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="sfzh" label="身份证号" align="center"></el-table-column>
						<el-table-column prop="brxb" label="性别" align="center"></el-table-column>
						<el-table-column prop="age" label="年龄" align="center"></el-table-column>
						<el-table-column prop="sourcetime" label="预约时间" align="center"></el-table-column>
						<el-table-column prop="diseaseName" label="体检套餐" align="center" show-overflow-tooltip></el-table-column>
						<el-table-column prop="date" label="操作" width="180" align="center">
							<template slot-scope="scope">
								<el-button @click="addPat(scope.row,scope.$index)"
                  style="height:28px;width:56px;padding:0;margin:0;font-size :13px;"
                  :type="scope.row.isAdd?'success':'primary'">
                  {{scope.row.isAdd?"已选择":"选择"}}
               </el-button>
							</template>
						</el-table-column>
    			</el-table>
				</el-col>
			</el-row>
			<el-row v-if="dataList.length">
				<!-- 批量通过 -->
				<el-col :span="12">
					<div class="checkPiliang" style="margin:11px 0;">
						<el-button type="primary" @click="addAll">添加当前页</el-button>
						<el-button type="primary" @click="addAllPages">添加所有页</el-button>
					</div>
				</el-col>
				<!-- 分页 -->
				<el-col :span="12">
					<div class="block" style="margin: 11px 0;">
						<el-pagination  background @current-change="handleCurrentChange" :current-page.sync="searchParams.pager" :page-size="10" layout="total,prev, pager, next, jumper"
							:total="totalPage" v-if="totalPage" >
						</el-pagination>
					</div>
				</el-col>
			</el-row>

			<el-row class="center" style = "padding: 30px 0;text-align: center;" v-if="dataList.length">
				<el-badge :value="addList.length" class="item">
				<el-button type="default" @click="patModal=true;" class="btnStyle">已选中客户</el-button>
				</el-badge>
				<el-button type="primary" @click="nextStep" class="btnStyle" style="margin-left: 20px;">下一步</el-button>
			</el-row>
		</div>
		</transition>
		<!-- 步骤二 -->
		<transition name="el-zoom-in-top">
			<div class="step2" v-if="step === 1">
    	<el-row class="finishjb" style="margin-bottom: 10px;">
    		<el-col :span="24">
          <el-alert
            :closable="false"
            title="请选择一个方案"
            type="warning"
            show-icon>
        </el-alert>
        </el-col>
    	</el-row>
			<el-row style="margin-bottom: 10px;">
				<el-col :span="24">
					<el-table  :data="planList"  border style="width: 100%; margin: 0 auto;" class="upTable">
						<el-table-column prop="name" label="方案名称" align="center"></el-table-column>
						<el-table-column prop="date" label="操作" width="180" align="center">
							<template slot-scope="scope">
								<el-button
                  @click="selectAction(scope.row,scope.$index )"
                   style="height:28px;width:56px;padding:0;margin:0;font-size :13px;"
									:type="scope.row.isAdd?'success':'primary'">
                  {{scope.row.isAdd?"已选择":"选择"}}
                </el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
			<el-row v-if="planList.length" class="step2Page" >
				<!-- 批量通过 -->
				<el-col :span="12">
					<div class="endHsTime">
						<span class="demonstration">
              <el-alert
                :closable="false"
                title="注：如通知时间选择当天，则半个小时后发起通知"
                type="warning"
                show-icon>
              </el-alert>
            </span>
					</div>
				</el-col>
				 <!--分页-->
				<el-col :span="12">
					<div class="block" style="margin: 0px 0;">
						<el-pagination  style="float: right;margin-right: 20px;" background @current-change="PlanChangePage" :current-page.sync="planParams.pager" :page-size="10" layout="total,prev, pager, next, jumper"
							:total="patTotalPage" v-if="patTotalPage">
						</el-pagination>
					</div>
				</el-col>
			</el-row>
        <el-row  style="margin-bottom: 20px" class="select-TIME">
          <!-- 批量通过 -->
          <el-col :span="6">
            <span class="demonsAdnice">体检时间</span>
            <el-date-picker
              v-model="sendData.orderTime"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="体检时间"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            <span class="demonsAdnice">通知日期</span>
            <el-date-picker
              v-model="sendData.visitStartTime"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="通知时间"
            >
            </el-date-picker>
          </el-col>
          <!-- 分页 -->
        </el-row>
			<el-row class="center" style = "padding: 30px 0;text-align: center;">
				<el-button type="default" @click="backBtn">上一步</el-button>
				<el-button type="primary" @click="sureStep">确定发起通知</el-button>
			</el-row>
		</div>
			</transition>
		<transition name="el-zoom-in-top">
		<div class="step3" v-if="step === 3">
			<i class="el-icon-success"></i>
			<p class="sussP">发起成功!</p>
			<!-- <p class="sussP1">通知人数：10人</p> -->
		</div>
		</transition>

		<!-- 步骤一已选中患者 -->

      <el-dialog

        custom-class='addDg'
        width='1000px'
        title="选中患者"
        :visible.sync="patModal">
        <el-table border :data="addList" height="490px"    width='100%' class='addListTable'>
          <el-table-column prop="brxm" label="姓名" width='100' align="center"></el-table-column>
          <el-table-column prop="jtdh" label="联系方式"width='130' align="center"></el-table-column>
          <el-table-column prop="sfzh" label="身份证号"width='180' align="center"></el-table-column>
          <el-table-column prop="brxb" label="性别" width='60' align="center"></el-table-column>
          <el-table-column prop="age" label="年龄" width='60' align="center"></el-table-column>
          <el-table-column prop="sourcetime" width='110'label="预约时间" align="center"></el-table-column>
          <el-table-column prop="diseaseName"width='120'  label="疾病名称" align="center" ></el-table-column>
          <el-table-column prop="date" label="操作" width='180' align='center'>
            <template slot-scope="scope">
              <el-button @click="removePat(scope.$index)"
                         type="danger"
                         size='mini'
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
	</div>
</template>
<script>
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import * as utilsIndex from 'utils';
import { initiateNotification } from '../../api/RJ_PhysicalExamination/InitiateNotification';     // 引入 api
export default {
  name: 'InitiateNotification',
  data() {
    return {
      step: 0, // 步骤
      activeName: 'first',
      totalPage: 10000, // 总页数
      searchParams: {
        pager: 1, // 当前页码
        limit: 10, // 每页条数
        brxm: '', // 病人姓名（可选）
        idNunber: '', // 身份证号（可选）
        physicalName: '', // 套餐名称（可选）
        mobile: null, // 联系方式（可选）
        beginTime: '', // 创建开始时间：年月日时分秒(可选)
        endTime: '', // 创建结束时间：年月日时分秒（可选)
        diagnosetype: '3' // 肿瘤患者
      },
      diseaseList: [] /* 疾病列表 */,
      /* 表格数据 */
      dataList: [],
      addList: [], // 已经添加的用户
      hzLoading: true, // 患者loading
      patModal: false, // 已选患者列表显示
      /** *********方案请求 ***************/
      /**
       * 方案请求数据
       */
      planParams: {
        pager: 1, // 当前页码
        limit: 10, // 每页条数
        departmentId: '',
        diseaseId: '', // 疾病类型（可选）
        activeType: 5 // （必填）方案类型：5（activeType=5,体检方案）
      },
      planList: [] /* 方案列表 */,
      patTotalPage: 0,
      isAll: 0, // 是否选择当前时间段的所有病人
      sendData: {
        orderTime: '', // //体检时间（必填）
        visitStartTime: '', // 通知时间（可为空，当天通知默认30分钟后）
        schemeId: '', // 方案id
        schemeName: '', // 方案名称
        adminId: sessionStorage.getItem('userId'), // 用户
        activeType: '5',
        diseaseId: '', // 疾病名称
        //        visitStartTime: "", //入院时间
        beginTime: '', // 导入开始时间：年月日时分秒(可选)
        endTime: '', // 导入结束时间：年月日时分秒（可选）
        hzxxIds: [], // 患者id
        sfzh: '', // 身份证号（可为空，查询条件，全选时（isAll=1）使用）
        physicalName: '', // 套餐名称（可为空，查询条件，全选时（isAll=1）使用）
        isAll: '', // 是否选择全部人数
        mobile: '', // 联系方式
        brxm: '' // 病人姓名（可选）
      },
      startTime: '',
      queryLoading: true, // 疾病loading
      pickerOptions: { // 日期选择器
        shortcuts: utilsIndex.pickerOptions
      }
    };
  },
  mounted() {
    this.sendData.orderTime = this.getCurrent();
    this.sendData.visitStartTime = this.getCurrent();
    this.getData();
    this.getPlanList();
  },
  methods: {
    /** @description
     * 疾病远程搜索
     */
    remoteMethod(query) {
      if (query) {
        this.diseaseList = [];
        this.queryLoading = true;
        initiateNotification.autoComplete({
          zjm: query,
          diseaseType: 1
        })
          .then(res => {
            this.queryLoading = false;
            if (res.code == 0) {
              this.diseaseList = res.data;
            } else {
              this.options4 = [];
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.options4 = [];
      }
    },
    /** @description
     * 创建时间更改;
     */
    timeChange(time) {
      if (time) {
        this.searchParams.beginTime = time[0];
        this.searchParams.endTime = time[1];
      } else {
        this.searchParams.beginTime = '';
        this.searchParams.endTime = '';
      }
    },
    /** *@description
     * 获取患者数据
     */
    getData() {
      this.hzLoading = true;
      initiateNotification.queryCustomerList(this.searchParams).then(res => {
        this.hzLoading = false;
        console.log(res)
        this.dataList = this.formData(res.data);
        console.log(this.dataList)
        this.totalPage = res.total;
      });
    },
    /**
     * 分页
     * @function handleCurrentChange
     * @param {String} val 当前页码
     */
    handleCurrentChange(page) {
      this.searchParams.pager = page;
      this.getData();
    },
    /**
     * 数据格式化
     */
    formData(data) {
      for (const item of data) {
        for (const ite of this.addList) {
          if (item.hzxxId == ite.hzxxId) {
            item.isAdd = 1;
          }
        }
      }
      return data;
    },
    /**
     * 添加患者
     */
    addPat(data, index) {
      if (data.isAdd) {
        return false;
      }
      const copyData = JSON.parse(JSON.stringify(data));
      copyData.isAdd = 1;
      this.dataList.splice(index, 1, copyData);
      this.addList.push(copyData);
    },
    /**
     * 移除已选患者
     */
    removePat(index) {
      this.addList.splice(index, 1);
      for (const item of this.dataList) {
        let flag = 0;
        for (const ite of this.addList) {
          if (item.hzxxId == ite.hzxxId) {
            flag++;
            item.isAdd = 1;
          }
        }
        if (flag == 0) {
          item.isAdd = 0;
        }
      }
      this.dataList = JSON.parse(JSON.stringify(this.dataList));
    },
    /**
     * 全选或者全部取消-
     */
    addAll() {
      for (let index = 0; index < this.dataList.length; index++) {
        if (this.dataList[index].isAdd != 1) {
          this.addPat(this.dataList[index], index);
        }
      }
    },
    /**
     * 添加所有页
     */
    addAllPages() {
      this.isAll = 1;
      if (this.dataList.length == 0) {
        Message.warning('您尚未添加任何患者');
        return false;
      }
      this.step = 1;
    },
    /**
     * 获取随访方案
     */
    getPlanList() {
      initiateNotification.questionScheme(this.planParams)
        .then(res => {
          for (const iterator of res.data) {
            if (iterator.id == this.sendData.schemeId) {
              iterator.isAdd = 1;
            }
          }
          this.planList = res.data;
          this.patTotalPage = res.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 方案列表页码更改
     */
    PlanChangePage(index) {
      this.planParams.pager = index;
      this.getPlanList();
    },
    /** @description
     * 下一步，选择方案
     */
    nextStep() {
      if (this.addList.length == 0) {
        Message.warning('您尚未添加任何患者');
        return false;
      }
      this.step = 1;
    },
    /**
     * 选择时间
     **/
    getCurrent() {
      const nowDate = new Date();
      const year = nowDate.getFullYear();
      const month =
        nowDate.getMonth() + 1 < 10
          ? '0' + (nowDate.getMonth() + 1)
          : nowDate.getMonth() + 1;
      const day =
        nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate();
      const dateStr = year + '-' + month + '-' + day;
      return dateStr;
    },
    /**
     * 选择具体方案
     */
    selectAction(data, index) {
      if (data.isAdd) {
        return false;
      }
      for (const iterator of this.planList) {
        iterator.isAdd = 0;
      }
      const copyData = JSON.parse(JSON.stringify(data));
      copyData.isAdd = 1;
      this.planList.splice(index, 1, copyData);
      this.sendData.schemeId = data.id;
      this.sendData.schemeName = data.name;
    },
    /** @description
     * 上一步，选择患者
     */
    backBtn() {
      this.step = 0;
    },
    /** @description
     * 发起通知
     */
    sureStep() {
      if (!this.sendData.orderTime) {
        Message.warning('请选择体检时间');
        return false;
      }

      if (!this.sendData.visitStartTime) {
        Message.warning('请选择通知时间');
        return false;
      }
      if (
        new Date(this.getCurrent()).getTime() >
        new Date(this.sendData.visitStartTime).getTime()
      ) {
        Message.warning('通知时间不得小于当天日期');
        return false;
      }
      if (
        new Date(this.getCurrent()).getTime() >
        new Date(this.sendData.orderTime).getTime()
      ) {
        Message.warning('体检日期日期不得小于当天日期');
        return false;
      }
      if (
        new Date(this.sendData.visitStartTime).getTime() >
        new Date(this.sendData.orderTime).getTime()
      ) {
        Message.warning('通知日期不能大于体检日期');
        return false;
      }
      if (!this.sendData.schemeId) {
        Message.warning('请选择体检方案');
        return false;
      }
      MessageBox.confirm('确定要发起随访吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.isAll == 0) {
            this.sendData.hzxxIds = [];
            for (const item of this.addList) {
              this.sendData.hzxxIds.push(item.hzxxId);
            }
            this.sendData.isAll = 0;
          } else if (this.isAll == 1) {
            this.sendData.isAll = 1;
            this.sendData.brxm = this.searchParams.brxm;
            this.sendData.beginTime = this.searchParams.beginTime;
            this.sendData.endTime = this.searchParams.endTime;
            this.sendData.diseaseId = this.searchParams.diseaseId;
            this.sendData.mobile = this.searchParams.mobile;
          }
          initiateNotification.confirmationFollowUp(this.sendData)
            .then(res => {
              if (res.code === 0) {
                this.step = 3;
              } else {
                Message.warning(res.message);
              }
            })
            .catch(err => {
              this.$message.warning(err);
            });
        })
        .catch(() => {
          Message({
            type: 'info',
            message: '已取消'
          });
        });
    }
  }
};
</script>

<style lang="scss">
@import "../../styles/common";

.addDg {
  .el-dialog__header {
    padding: 15px 15px 10px;
    border-bottom: 1px solid #ececec;
    span {
      font-size: 14px;
    }
  }
  .el-dialog__body {
    .addListTable th {
      background: rgb(248, 248, 249);
    }
  }
}
.step2Page {
  padding-left: 10px;
  background: #fdf6ec;
  font-size: 14px;
}
.btnRow {
  padding: 30px 0;
  text-align:center;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}
.step3 {
  min-height: 600px;
  text-align: center;
  i {
    margin: 30px auto 20px;
    color: #67c23a;
    font-size: 80px;
  }
  .sussP {
    font-size: 20px;
    color: #333;
    font-weight: bold;
    line-height: 50px;
  }
  .sussP1 {
    color: #666;
  }
}
.el-badge__content{
  line-height: 16px;
}
</style>
