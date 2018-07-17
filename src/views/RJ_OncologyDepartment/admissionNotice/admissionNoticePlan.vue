<template>
  <div class='admissionNoticePlan'>
    <!-- 步骤 -->
		<el-row style='background: #fbfbfb;padding: 10px'>
		  <el-col :span='12' :offset='6'>
				<el-steps :active='step'  align-center process-status='finish' finish-status='success'>
					<el-step title='选择患者'></el-step>
					<el-step title='选择方案'></el-step>
					<el-step title='发起成功'></el-step>
				</el-steps>
		  </el-col>
		  <el-col :span='6'></el-col>
		</el-row>
		<!-- 步骤一 -->
		<transition name='el-zoom-in-top'>
		<div class='stepContent' v-if='step === 0'>
			<el-row class='upnum'>
				<el-col :span='24'><el-tag type='primary' size='medium'>请选择需要通知的患者</el-tag></el-col>
			</el-row>
			<!-- 查询 -->
			<el-row class='common-search'>
				<el-form  label-position='center' label-width='80px' :inline='true' :model='searchParams'>
				  <el-col :span='5'>
				  	<el-form-item label='姓名'>
					    <el-input v-model='searchParams.brxm' placeholder='请输入姓名' clearable></el-input>
					  </el-form-item>
					</el-col>
					<el-col :span='5'>
				  	<el-form-item label='联系电话'>
					    <el-input v-model='searchParams.mobile' placeholder='请输入联系电话' clearable></el-input>
					  </el-form-item>
					</el-col>
					<el-col :span='5'>
				  	<el-form-item label='疾病名称'>
					    <el-select
                v-model='searchParams.diseaseId'
                filterable
                clearable
                remote
                reserve-keyword
                placeholder='请输入疾病类型'
                :remote-method='remoteMethod'
                :loading='queryLoading'>
                <el-option
                  v-for='item in diseaseList'
                  :key='item.id'
                  :label='item.value'
                  :value='item.id'>
                </el-option>
              </el-select>
					  </el-form-item>
					</el-col>
					<el-col :span='9'>
						<el-form-item label='创建时间' class='formTime'>
							<el-date-picker
								@change='timeChange'
								v-model='startTime'
								value-format='yyyy-MM-dd HH:mm:ss'
								type='daterange'
								range-separator='至'
								start-placeholder='开始日期'
					      end-placeholder='结束日期'>
					    </el-date-picker>
		        </el-form-item>
					</el-col>
				  <el-col :span='3'>
				  	<el-button type='primary' @click='getData'>查询</el-button>
				  </el-col>
				</el-form>
			</el-row>
			<!-- 通知患者 -->
			<el-row class='common-table'>
				<el-col :span='24'>
					<el-table border :data='dataList' style='width: 100%' ref='multipleTable' v-loading='hzLoading'>
						<el-table-column prop='brxm' label='姓名' align='center'></el-table-column>
						<el-table-column prop='jtdh' label='联系方式' align='center'></el-table-column>
						<el-table-column prop='brxb' label='性别' align='center'></el-table-column>
						<el-table-column prop='age' label='年龄' align='center'></el-table-column>
						<el-table-column prop='sourcetime' label='创建时间' align='center'></el-table-column>
						<el-table-column prop='diseaseName' label='疾病名称' align='center' show-overflow-tooltip></el-table-column>
						<el-table-column label='操作' width='180' align='center'>
							<template slot-scope='scope'>
								<el-button
                  @click='addPat(scope.row,scope.$index)'
                  size='mini'
                  :type="scope.row.isAdd?'success':'primary'">
                  {{scope.row.isAdd?'已选择':'选择'}}
               </el-button>
							</template>
						</el-table-column>
    			</el-table>
				</el-col>
			</el-row>
			<el-row v-if='dataList.length' style='padding: 11px 0;background: #fff;'>
				<!-- 批量通过 -->
				<el-col :span='12' style='padding-left: 10px;'>
          <el-button type='primary' size='small'  @click='addAll'>添加当前页</el-button>
          <el-button type='warning' size='small' @click='addAllPages'>添加所有页</el-button>
				</el-col>
				<!-- 分页 -->
				<el-col :span='12'>
          <el-pagination
            @current-change='handleCurrentChange'
            :current-page.sync='searchParams.pager'
            :page-size='10'
            layout='total,prev, pager, next, jumper'
            :total='totalPage'
            v-if='totalPage'>
          </el-pagination>
				</el-col>
			</el-row>
      <!-- 选中患者、下一步 -->
			<el-row class='btnRow' v-if='dataList.length'>
				<el-badge :value='addList.length' class='item'>
				  <el-button type='default' @click='patModal=true' size='small'>已选中患者</el-button>
				</el-badge>
				<el-button type='primary' @click='nextStep' size='small' style='margin-left: 20px;'>下一步</el-button>
			</el-row>
		</div>
		</transition>
		<!-- 步骤二 -->
		<transition name='el-zoom-in-top'>
			<div class='step2' v-if='step === 1'>
      <el-row class='upnum'>
				<el-col :span='24'><el-tag type='primary' size='medium'>请选择一个方案</el-tag></el-col>
			</el-row>
			<el-row class='common-table'>
				<el-col :span='24'>
					<el-table border  :data='planList'>
						<el-table-column prop='name' label='方案名称' align='center'></el-table-column>
						<el-table-column prop='diseaseName' label='疾病名称' align='center'></el-table-column>
						<el-table-column prop='departmentName' label='科室' align='center'></el-table-column>
						<el-table-column label='操作' width='180' align='center'>
							<template slot-scope='scope'>
								<el-button
                  @click='selectAction(scope.row,scope.$index)'
                   size='mini'
									:type='scope.row.isAdd?'success':'primary''>
                  {{scope.row.isAdd?'已选择':'选择'}}
                </el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
			<el-row v-if='planList.length' class='step2Page'>
				<!-- 入院时间选择 -->
				<el-col :span='16' style='padding-top: 12px;'>
					<div class='endHsTime'>
						<span class='demonstration'>患者入院时间(<span class='yyc'>必填</span>):</span>
						<el-date-picker
              size='small'
							v-model='sendData.orderTime'
							type='datetime'
							value-format='yyyy-MM-dd HH:mm:ss'
							placeholder='选择日期'>
						</el-date-picker>
            <span class='demonstration' style='padding-left: 20px;'>通知日期(<span class='yyc'>必填</span>):</span>
						<el-date-picker
              size='small'
							v-model='sendData.visitStartTime'
							type='date'
							value-format='yyyy-MM-dd'
							placeholder='选择日期'
              :picker-options='pickerOptions1'>
						</el-date-picker>
            <br/>
            <span style='line-height: 30px;'>注:如果通知时间选择当天，则半个小时后发起通知。</span>
					</div>
				</el-col>
        <!-- 分页 -->
				<el-col :span='8'>
					<div class='block' style='margin: 11px 0;'>
						<el-pagination  @current-change='PlanChangePage' :current-page.sync='planParams.pager' :page-size='10' layout='total,prev, pager, next, jumper'
							:total='patTotalPage' v-if='patTotalPage'>
						</el-pagination>
					</div>
				</el-col>
			</el-row>
			<el-row class='btnRow'>
				<el-button type='default' size='small' @click='backBtn'>上一步</el-button>
				<el-button type='primary' size='small' :loading='sureStepLoading' @click='sureStep'>确定发起通知</el-button>
			</el-row>
		  </div>
			</transition>
		<transition name='el-zoom-in-top'>
		<div class='step3' v-if='step === 3'>
			<i class='el-icon-success'></i>
			<p class='sussP'>发起成功!</p>
			<!-- <p class='sussP1'>通知人数：10人</p> -->
		</div>
		</transition>
		<!-- 步骤一已选中患者 -->
		<div class='addList'>
			<el-dialog
			title='选中患者'
			width='1000px'
			custom-class='addDg'
			:visible.sync='patModal'>
				<el-table border :data='addList' height='490px' width='100%' class='addListTable'>
					<el-table-column prop='brxm' label='姓名' align='center'></el-table-column>
						<el-table-column prop='jtdh' label='联系方式' align='center'></el-table-column>
						<el-table-column prop='brxb' label='性别' align='center'></el-table-column>
						<el-table-column prop='age' label='年龄' align='center'></el-table-column>
						<el-table-column prop='sourcetime' label='创建时间' align='center'></el-table-column>
						<el-table-column prop='diseaseName' label='疾病名称' align='center' show-overflow-tooltip></el-table-column>
						<el-table-column label='操作' width='180' align='center'>
						<template slot-scope='scope'>
							<el-button @click='removePat(scope.$index)'
								type='danger'
								size='mini'>移除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-dialog>
		</div>
  </div>
</template>
<script>
  import { AdmissionNotice } from 'RJZL_API/hospitalNotice';
  export default {
    name: 'admissionNoticePlan',
    data() {
      return {
        value: '',
        step: 0, // 步骤
        activeName: 'first',
        totalPage: 10000, // 总页数
        searchParams: {
          adminId: sessionStorage.getItem('userId'),
          pager: 1, //当前页码
          limit: 10, //每页条数
          brxm: '', //病人姓名（可选）
          mobile: null, //联系方式（可选）
          beginTime: '', //创建开始时间：年月日时分秒(可选)
          endTime: '', //创建结束时间：年月日时分秒（可选)
          diagnosetype: '4' // 肿瘤患者
        },
        diseaseList: [] /* 疾病列表 */,
        /* 表格数据 */
        dataList: [],
        addList: [], //已经添加的用户
        hzLoading: false, // 患者loading
        patModal: false, //已选患者列表显示
        /***********方案请求 ***************/
        /**
         * 方案请求数据
         */
        planParams: {
          pager: 1, //当前页码
          limit: 10, //每页条数
          departmentId: '',
          diseaseId: '', //疾病类型（可选）
          activeType: 4 //方案类型：0，表示随访方案；1，表示通知方案（可选）
        },
        planList: [] /* 方案列表 */,
        patTotalPage: 0,
        isAll: 0, //是否选择当前时间段的所有病人
        sendData: {
          schemeId: '', //方案id
          schemeName: '', //方案名称
          adminId: sessionStorage.getItem('userId'), //用户
          diseaseId: '',
          orderTime : '', //入院时间
          beginTime: '', //导入开始时间：年月日时分秒(可选)
          endTime: '', //导入结束时间：年月日时分秒（可选）
          hzxxIds: [], //患者id
          isAll: '', //是否选择全部人数
          mobile: '', //联系方式
          brxm: '' ,//病人姓名（可选）
          activeType:'4', //  随访类型：4 入院通知 ,
          visitStartTime: '' // 通知时间
        },
        startTime: '',
        queryLoading: false, // 疾病loading
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < (Date.now()-3600 * 1000 * 24);
          },
        }, // 通知时间
        sureStepLoading: false // 确定发起通知loading
      };
    },
    mounted() {
      this.getData();
      this.getCurrent();
      this.getPlanList();
    },
    methods: {
      getCurrent() {
        let current = new Date()
        let currentYear = current.getFullYear()
        let currentMonth = current.getMonth() + 1
        if(currentMonth<10) {
          currentMonth = '0' + currentMonth
        }
        let startDate = current.getDate()
        if(startDate<10) {
          startDate = '0' + startDate
        }
        let currentTime1 = currentYear + '-' + currentMonth + '-' + startDate
        console.log(currentTime1);

        this.sendData.visitStartTime = currentTime1
      },
      /**@description
       * 疾病远程搜索
       */
      remoteMethod(query) {
        if (query !== '') {
          this.queryLoading = true;
          setTimeout(() => {
            commonUrl.autocomplete({
              'zjm': query,
              'diseaseType': '0'
            }).then((res)=>{
              this.queryLoading = false;
              console.log(res)
              if(res.code == 0) {
                this.diseaseList = res.data
              } else {
                this.options4 = [];
              }
            }).catch((error)=>{
              console.log(error)
            })
          }, 200);
        } else {
          this.options4 = [];
        }
      },
      /**@description
       * 创建时间更改
       */
      timeChange(time) {
        if (time) {
          this.searchParams.beginTime = time[0];
          this.searchParams.endTime = time[1];
        } else {
          this.searchParams.beginTime = ''
          this.searchParams.endTime = ''
        }
      },
      /***@description
       * 获取患者数据
       */
      getData() {
        this.hzLoading = true
        AdmissionNotice.patList(this.searchParams).then(res => {
          this.hzLoading = false
          if(res.data) {
            this.dataList = this.formData(res.data);
          }
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
        for (let item of data) {
          for (let ite of this.addList) {
            if (item.id == ite.id) {
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
        let copyData = JSON.parse(JSON.stringify(data));
        copyData.isAdd = 1;
        this.dataList.splice(index, 1, copyData);
        this.addList.push(copyData);
      },
      /**
       * 移除已选患者
       */
      removePat(index) {
        this.addList.splice(index, 1);
        for (let item of this.dataList) {
          let flag = 0;
          for (let ite of this.addList) {
            if (item.id == ite.id) {
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
        AdmissionNotice.planList(this.planParams)
          .then(res => {
            for (let iterator of res.data) {
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
      /**@description
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
       * 选择具体方案
       */
      selectAction(data, index) {
        if (data.isAdd) {
          return false;
        }
        for (let iterator of this.planList) {
          iterator.isAdd = 0;
        }
        let copyData = JSON.parse(JSON.stringify(data));
        copyData.isAdd = 1;
        this.planList.splice(index, 1, copyData);
        this.sendData.schemeId = data.id;
        this.sendData.schemeName = data.name;
      },
      /**@description
       * 上一步，选择患者
       */
      backBtn() {
        this.step = 0;
      },
      /**@description
       * 发起通知
       */
      sureStep() {
        if(new Date (this.sendData.visitStartTime) > new Date(this.sendData.orderTime)) {
          this.$message.error('通知日期不得早于入院日期！')
          return false;
        }
        if (!this.sendData.orderTime ) {
          Message.warning('请填写具体入院时间');
          return false;
        }
        this.$confirm('确定要发起随访吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (this.isAll == 0) {
              this.sendData.hzxxIds = [];
              for (let item of this.addList) {
                this.sendData.hzxxIds.push(item.id);
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
            this.sureStepLoading = true
            AdmissionNotice.createNotice(this.sendData)
              .then(res => {
                this.sureStepLoading = false
                if (res.code == 0) {
                  this.step = 3;
                } else {
                  Message.warning(res.message);
                }
              })
              .catch(err => {this.sureStepLoading = false});
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
<style lang='scss'>
@import '~styles/search';
  .upnum {
    background: aliceblue;
  }
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
    background: #fff;
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
</style>