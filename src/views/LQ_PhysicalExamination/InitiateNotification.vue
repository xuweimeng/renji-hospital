<template>
	<div class="app-container">
		<!-- 步骤 -->
		<el-row style="background: #fbfbfb;padding: 10px">
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
			<!-- 查询 -->
			<ul class="common_search" style="margin-top:10px">
				  <li class="common_search_single">
            <label class="radio-label" >姓名</label>
            <el-input v-model="searchParams.brxm" placeholder="请输入姓名" clearable></el-input>
					</li>
					<li class="common_search_single">
            <label class="radio-label" >联系电话</label>
					    <el-input v-model="searchParams.jtdh" placeholder="请输入联系电话" clearable></el-input>
					</li>
          <li class="common_search_single">
            <label class="radio-label" >身份证号</label>
              <el-input v-model="searchParams.sfzh" placeholder="请输入身份证号" clearable></el-input>
          </li>

          <li class="common_search_single">
            <label class="radio-label" >性别</label>
            <el-input v-model="searchParams.brxb" placeholder="请输入性别" clearable></el-input>
					</li>

          <li class="common_search_single common_search_single_time" >
            <label class="radio-label" >年龄范围</label>
					     <el-input-number v-model="searchParams.ageBegin"  :min="0" :max="99" label="请输入开始年龄"></el-input-number>
					     <el-input-number v-model="searchParams.ageEnd"  :min="0" :max="99" label="请输入结束年龄"></el-input-number>
					</li>

          <li class="common_search_single common_search_single_time">
            <label class="radio-label" >体检时间</label>
							<el-date-picker
								@change="timeChange"
								v-model="startTime"
								value-format="yyyy-MM-dd HH:mm:ss"
								type="daterange"
								start-placeholder="开始时间"
					      end-placeholder="结束时间">
					    </el-date-picker>
					</li>

          <li class="common_search_single">
            <label class="radio-label" >地址</label>
              <el-input v-model="searchParams.xzzQtdz" placeholder="请输入地址" clearable></el-input>
          </li>

					<li class="common_search_single">
            <label class="radio-label" >体检套餐</label>
					    <el-select
                v-model="searchParams.icd"
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
					
				  <li class="common_search_single">
				  	<el-button type="primary" icon="el-icon-search" @click="searchParams.pager=1;getData()" >查询</el-button>
				  </li>
			</ul>
			<!-- 通知患者 -->
			<el-row>
				<el-col :span="24">
					<el-table :data="dataList"  border fit highlight-current-row ref="multipleTable" >
						<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
						<el-table-column prop="jtdh" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="sfzh" label="身份证号" align="center"></el-table-column>
						<el-table-column prop="brxb" label="性别" align="center"></el-table-column>
						<el-table-column prop="age" label="年龄" align="center"></el-table-column>
						<el-table-column prop="xzzQtdz" label="地址" align="center"></el-table-column>
						<el-table-column prop="orderTime" label="最近一次体检时间" align="center"></el-table-column>
						<el-table-column prop="icdName" label="体检套餐" align="center" show-overflow-tooltip></el-table-column>
						<el-table-column prop="date" label="操作"  align="center">
							<template slot-scope="scope">
								<el-button @click="addPat(scope.row,scope.$index)"
                size="mini"
                  :type="scope.row.isAdd?'success':'primary'">
                  {{scope.row.isAdd?"已选择":"选择"}}
               </el-button>
							</template>
						</el-table-column>
    			</el-table>
				</el-col>
			</el-row>
			<el-row v-if="dataList.length" >
				<!-- 批量通过 -->
				<el-col :span="12">
					<div class="checkPiliang" style="margin: 11px 0;">
						<el-button type="primary" size="small" @click="addAll">添加当前页</el-button>
						<el-button type="primary" size="small"  @click="addAllPages">添加所有页</el-button>
					</div>
				</el-col>
				<!-- 分页 -->
				<el-col :span="12">
					<div class="pagination-container" style="margin: 11px 0;text-align:right">
						<el-pagination  @current-change="handleCurrentChange" background :current-page.sync="searchParams.pager" :page-size="10" layout="total,prev, pager, next, jumper"
							:total="totalPage" v-if="totalPage">
						</el-pagination>
					</div>
				</el-col>
			</el-row>

			<el-row class="center" style = "padding: 30px 0;border-top: 1px solid #f0f0f0;text-align:center" v-if="dataList.length">
				<el-badge :value="addList.length" class="item">
				<el-button type="default" @click="patModal=true;" >已选中客户</el-button>
				</el-badge>
				<el-button type="primary" @click="nextStep"  style="margin-left:15px">下一步</el-button>
			</el-row>
		</div>
		</transition>
		<!-- 步骤二 -->
		<transition name="el-zoom-in-top">
			<div class="step2" v-if="step === 1">
    	 <el-alert
        title="请选择一个方案"
        type="success"
        :closable="false"
        style="margin:10px 0;"
        >
      </el-alert>
			<el-row>
				<el-col :span="24">
					<el-table  :data="planList"  border style="width: 100%; margin: 0 auto;" class="upTable">
						<el-table-column prop="name" label="方案名称" align="center"></el-table-column>
						<el-table-column prop="date" label="操作" width="180" align="center">
							<template slot-scope="scope">
								<el-button
                  @click="selectAction(scope.row,scope.$index)"
                  size="mini"
									:type="scope.row.isAdd?'success':'primary'">
                  {{scope.row.isAdd?"已选择":"选择"}}
                </el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
      <div class="pagination-container" style="text-align:right;margin:15px 0;">
         <div class="time_box" style="display:inline-block;float:left">
           <label class="radio-label" >体检时间</label>
            <el-date-picker
              v-model="sendData.orderTime"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="体检时间">
            </el-date-picker>
             <label class="radio-label" >通知日期</label>
            <el-date-picker
              v-model="sendData.visitStartTime"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="通知时间">
            </el-date-picker>
         </div>
        <el-pagination style="display:inline-block"  @current-change="PlanChangePage"  :current-page.sync="planParams.pager" :page-size="10" layout="total,prev, pager, next, jumper" :total="patTotalPage" v-if="patTotalPage">
        </el-pagination>
      </div>
      <el-alert style="white-space: pre;"
            :closable="false"
            title="注：如通知时间选择当天，则半个小时后发起通知"
            type="warning">
      </el-alert>
			<el-row class="center" style = "padding: 30px 0;background: #fff;border-top: 1px solid #f0f0f0;">
				<el-button type="default" @click="backBtn">上一步</el-button>
				<el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click="sureStep">确定发起通知</el-button>
			</el-row>
		</div>
			</transition>
		<transition name="el-zoom-in-top">
		<div class="step3" v-if="step === 3">
			<i class="el-icon-success"></i>
			<p class="sussP">发起成功!</p>
		</div>
		</transition>
		<!-- 步骤一已选中患者 -->
		<div class="addList">
			<el-dialog
			title="选中患者"
			width="1000px"
			custom-class="addDg"
			:visible.sync="patModal">
				<el-table :data="addList" height="490px" width="100%" class="addListTable" border fit highlight-current-row>
						<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
						<el-table-column prop="jtdh" label="联系方式" align="center"></el-table-column>
            <el-table-column prop="sfzh" label="身份证号" align="center"></el-table-column>
						<el-table-column prop="brxb" label="性别" align="center"></el-table-column>
						<el-table-column prop="age" label="年龄" align="center"></el-table-column>
						<el-table-column prop="xzzQtdz" label="地址" align="center"></el-table-column>
						<el-table-column prop="orderTime" label="最近一次体检时间" align="center"></el-table-column>
						<el-table-column prop="icdName" label="体检套餐" align="center" show-overflow-tooltip></el-table-column>
						<el-table-column prop="date" label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button @click="removePat(scope.$index)"
								type="danger"
								style="height:22px;width:52px;padding:0;margin:0;font-:13px;">移除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import { InitiateNotification } from 'LQPE_API/InitiateNotification'; // 引入 api
export default {
  data() {
    return {
      fullscreenLoading: false,
      step: 0, // 步骤
      activeName: 'first',
      totalPage: 10000, // 总页数
      searchParams: {
        pager: 1, // 当前页码
        limit: 10, // 每页条数
        brxm: '', // 病人姓名（可选）
        sfzh: '', // 身份证号（可选）
        brxb: '',
        icd: '',
        xzzQtdz: null,
        ageBegin: 0,
        ageEnd: 99,
        jtdh: null, // 联系方式（可选）
        orderTimeBegin: '', // 创建开始时间：年月日时分秒(可选)
        orderTimeEnd: '' // 创建结束时间：年月日时分秒（可选)
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
        orderTimeBegin: '', // 导入开始时间：年月日时分秒(可选)
        orderTimeEnd: '', // 导入结束时间：年月日时分秒（可选）
        hzxxIds: [], // 患者id
        sfzh: '', // 身份证号（可为空，查询条件，全选时（isAll=1）使用）
        icd: '', // 套餐名称（可为空，查询条件，全选时（isAll=1）使用）
        isAll: '', // 是否选择全部人数
        jtdh: '', // 联系方式
        brxm: '' // 病人姓名（可选）
      },
      startTime: '',
      queryLoading: true // 疾病loading
    };
  },

  mounted() {
    this.sendData.orderTime = this.getCurrent();
    this.sendData.visitStartTime = this.getCurrent();
    this.getData();
    this.getPlanList();
    let idList = localStorage.getItem('idList');
    if (idList) {
      idList = JSON.parse(idList);
      this.addList = idList;
      this.step = 1;
      localStorage.setItem('idList', '');
    }
  },
  methods: {
    /** @description
     * 疾病远程搜索
     */
    remoteMethod(query) {
      if (query) {
        this.diseaseList = [];
        this.queryLoading = true;
        InitiateNotification.autoComplete({
          zjm: query,
          diseaseType: 1
        })
          .then(res => {
            this.queryLoading = false;
            this.diseaseList = res.data;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    /** @description
     * 创建时间更改;
     */
    timeChange(time) {
      if (time) {
        this.searchParams.orderTimeBegin = time[0];
        this.searchParams.orderTimeEnd = time[1];
      } else {
        this.searchParams.orderTimeBegin = '';
        this.searchParams.orderTimeEnd = '';
      }
    },
    /**
     * @function 获取患者列表数据
     * @return {type} {description}
     */
    getData() {
      this.hzLoading = true;
      InitiateNotification.queryCustomerList(this.searchParams).then(res => {
        this.hzLoading = false;
        this.dataList = this.formData(res.data);
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
          if (item.hzxxId === ite.hzxxId) {
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
          if (item.hzxxId === ite.hzxxId) {
            flag++;
            item.isAdd = 1;
          }
        }
        if (flag === 0) {
          item.isAdd = 0;
        }
      }
      this.dataList = JSON.parse(JSON.stringify(this.dataList));
      console.log(this.dataList);
    },
    /**
     * 全选或者全部取消-
     */
    addAll() {
      for (let index = 0; index < this.dataList.length; index++) {
        if (this.dataList[index].isAdd !== 1) {
          this.addPat(this.dataList[index], index);
        }
      }
    },
    /**
     * 添加所有页
     */
    addAllPages() {
      this.isAll = 1;
      if (this.dataList.length === 0) {
        Message.warning('您尚未添加任何患者');
        return false;
      }
      this.step = 1;
    },
    /**
     * 获取随访方案
     */
    getPlanList() {
      InitiateNotification.questionScheme(this.planParams)
        .then(res => {
          for (const iterator of res.data) {
            if (iterator.id === this.sendData.schemeId) {
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
      if (this.addList.length === 0) {
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
      console.log(data);
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
          this.fullscreenLoading = true;
          if (this.isAll === 0) {
            this.sendData.hzxxIds = [];
            for (const item of this.addList) {
              this.sendData.hzxxIds.push(item.hzxxId);
            }
            this.sendData.isAll = 0;
          } else if (this.isAll === 1) {
            this.sendData.isAll = 1;
            this.sendData.brxm = this.searchParams.brxm;
            this.sendData.brxb = this.searchParams.brxb;
            this.sendData.sfzh = this.searchParams.sfzh;
            this.sendData.xzzQtdz = this.searchParams.xzzQtdz;
            this.sendData.orderTimeBegin = this.searchParams.orderTimeBegin;
            this.sendData.orderTimeEnd = this.searchParams.orderTimeEnd;
            this.sendData.icd = this.searchParams.icd;
            this.sendData.ageBegin = this.searchParams.ageBegin;
            this.sendData.ageEnd = this.searchParams.ageEnd;
          }
          InitiateNotification.confirmationFollowUp(this.sendData)
            .then(res => {
              this.fullscreenLoading = false;
              this.step = 3;
            })
            .catch(err => {
              console.log(err);
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
<style lang="scss" scoped>
.step3{
 >i{
   font-size: 100px;
   color: #67c23a;
   margin:  20px auto;
   display: block;
   width: 100px;
 }
 >p{
   text-align: center;
   font-size: 25px;

 }
}
</style>

