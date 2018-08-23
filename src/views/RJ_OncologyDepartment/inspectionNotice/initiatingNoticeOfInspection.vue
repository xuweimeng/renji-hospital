<template>
  <div class='app-container'>
    <!-- 步骤 -->
    <el-card  style="margin-bottom:10px">
      <el-steps :active='step'  align-center process-status='finish' finish-status='success'>
        <el-step title='选择患者'></el-step>
        <el-step title='选择检查'></el-step>
        <el-step title='发起成功'></el-step>
      </el-steps>
    </el-card>
		<!-- 步骤一 -->
		<transition name='el-zoom-in-top'>
      <div class='stepContent' v-if='step === 0'>
        <el-row class='upnum'>
				  <el-col :span='24'><el-tag type='primary' size='medium'>请选择需要通知的患者</el-tag></el-col>
			  </el-row>
        <!-- 查询 -->
        <ul class="common_search">
          <li class="common_search_single">
            <label class="radio-label" >姓名</label>
            <el-input v-model.trim="searchParams.brxm" clearable placeholder="请输入姓名"></el-input>
          </li>
          <li class="common_search_single">
            <label class="radio-label" >联系方式</label>
            <el-input v-model.trim="searchParams.mobile" clearable placeholder="请输入联系方式"></el-input>
          </li>
          <li class="common_search_single common_search_single_date">
              <label class="radio-label" >创建时间</label>
              <el-date-picker
                @change='timeChange'
                v-model='startTime'
                value-format='yyyy-MM-dd HH:mm:ss'
                type='daterange'
                range-separator='至'
                start-placeholder='开始日期'
                end-placeholder='结束日期'>
              </el-date-picker>
          </li>
          <li class="common_search_single">
            <label class="radio-label" >疾病名称</label>
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
          </li>
          <li class="common_search_single">
              <el-button type="primary" @click.native="getData" icon="el-icon-search">查询</el-button>
          </li>
        </ul>
        <!-- 通知患者 -->
        <el-card shadow="never">
            <el-table :data='dataList' border style='width: 100%' v-loading='hzLoading'>
              <el-table-column prop='brxm' label='姓名' align='center'></el-table-column>
              <el-table-column prop='jtdh' label='联系方式' align='center'></el-table-column>
              <el-table-column label='性别/年龄' align='center' width='100'>
                <template slot-scope='scope'>
                  {{scope.row.brxb}} <span v-if='scope.row.brxb && scope.row.age'>/</span> {{scope.row.age}}
                </template>
              </el-table-column>
              <el-table-column prop='sourcetime' label='创建时间' align='center'></el-table-column>
              <el-table-column prop='diseaseName' label='疾病名称' align='center' show-overflow-tooltip></el-table-column>
              <el-table-column label='检查安排' align='center'>
                <template slot-scope='scope'>
                  <el-tag type='info' size="mini" v-if='scope.row.checkNum===0'>暂无安排</el-tag>
                  <el-tag type='primary' size="mini"
                    v-if='scope.row.checkNum&&scope.row.checkNum!=0'
                    @click.native='lookDetailsBtn(scope.row)'>
                    已预约{{scope.row.checkNum}}项检查
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label='操作' width='180' align='center'>
                <template slot-scope='scope'>
                  <el-button @click='addPat(scope.row,scope.$index)'
                    size="mini"
                    :type="scope.row.isAdd?'success':'primary'">
                    {{scope.row.isAdd?'已选择':'选择'}}
                </el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-card>
        <el-row v-if='dataList.length' :style="{'padding' : '11px 0', 'background': '#fff'}">
          <!-- 批量添加 -->
            <el-button type='primary' style="margin-left:15px" size="small" @click='addAll'>添加当前页</el-button>
            <el-button type='warning' size="small" @click='addAllPages'>添加所有页</el-button>
          <!-- 分页 -->
          <el-pagination style="float:right;margin-right:15px"  @current-change='handleCurrentChange' :current-page.sync='searchParams.pager' :page-size='10' layout='total,prev, pager, next, jumper'
            :total='totalPage' v-if='totalPage'>
          </el-pagination>
        </el-row>
        <el-row class='rowCenter' v-if='dataList.length'>
          <el-badge :value='addList.length' class='item'>
          <el-button type='default' @click='patModal=true' size="small">已选中患者</el-button>
          </el-badge>
          <el-button type='primary' @click='nextStep' size="small">下一步</el-button>
        </el-row>
      </div>
		</transition>
		<!-- 步骤二 -->
		<transition name='el-zoom-in-top'>
			<div class='step2' v-if='step === 1'>
        <el-row class='upnum' style="padding:10px">
          <el-col :span='24'><el-tag type='primary' size='medium'>已选中患者:</el-tag></el-col>
          <el-col :span='24' :style="{'marginTop': '10px'}">
            <el-tag
              type='primary'
              :style="{'color': '#333','margin': '5px'}"
              v-for='(item, index) in addList'
              :key='index'>{{item.brxm}}</el-tag>
          </el-col>
        </el-row>
        <!-- 选择方案2 -->
        <div class='step2-select-list'
          v-for=' (item, index) in checkVos'
          :key='index'>
            <div class='select-options'>
              <span>检查项目: </span>
              <el-select
                @focus='liClick(index)'
                v-model='checkVos[index].icd'
                @change='selectProjectName'
                :name='String(index)'
                placeholder='请选择检查项目'>
                <el-option
                  v-for='item in projectName'
                  :key='item.disease.id'
                  :label='item.disease.name'
                  :value='item.disease.icd'>
                </el-option>
              </el-select>
            </div>
            <div class='select-options'>
              <span>检查地点: </span>
              <el-select
                v-model='checkVos[index].locationId'
                @change='selectAdress'
                :name='String(index)'
                placeholder='请选择检查地点'>
                <el-option
                  v-for='item in projectAdress'
                  :key='item.id'
                  :label='item.location'
                  :value='item.id'
                  :disabled='item.disabled'>
                </el-option>
              </el-select>
            </div>
            <div class='select-options'>
              <span>检查时间: </span>
              <el-date-picker
                v-model='checkVos[index].orderTime'
                align='right'
                type='datetime'
                @change='selectTime'
                placeholder='请选择检查日期'
                value-format='yyyy-MM-dd HH:mm:ss'
                :picker-options='pickerOptions1'>
              </el-date-picker>
            </div>
            <div v-if='index > 0' style='padding-top: 0;'>
              <el-button type='danger' style='padding: 6px 12px;' @click='deleteBtn(index)'>删除</el-button>
            </div>
        </div>
        <!-- 再次添加方案 -->
        <el-row class='add-algin-button'>
          <el-col :span='24' style="padding: 10px; background: #fff;">
            <el-button type='primary' @click='addAgainButton' size="small">+添加检查</el-button>
          </el-col>
        </el-row>
        <el-row class='rowCenter'>
          <el-button type='default' @click='backBtn' size="small">上一步</el-button>
          <el-button type='primary' @click='sureStep' size="small" :loading='step2Loading'>确定发起通知</el-button>
        </el-row>
        <!-- :loading='step2Loading' -->
      </div>
		</transition>
    <!-- 步骤三 -->
		<transition name='el-zoom-in-top'>
      <div class='step3' v-if='step === 3'>
        <i class='el-icon-success'></i>
        <p class='sussP'>发起成功!</p>
      </div>
		</transition>
		<!-- 步骤一已选中患者 -->
		<div class='addList'>
			<el-dialog
			title='选中患者'
			width='1000px'
			custom-class='addDg'
			:visible.sync='patModal'>
				<el-table :data='addList' border height='490px' width='100%' class='addListTable'>
					<el-table-column prop='brxm' label='姓名' align='center'></el-table-column>
						<el-table-column prop='jtdh' label='联系方式' align='center'></el-table-column>
						<el-table-column prop='brxb' label='性别' align='center'></el-table-column>
						<el-table-column prop='age' label='年龄' align='center'></el-table-column>
						<el-table-column prop='sourcetime' label='创建时间' align='center'></el-table-column>
						<el-table-column prop='diseaseName' label='疾病名称' align='center' show-overflow-tooltip></el-table-column>
						<el-table-column prop='date' label='操作' width='180' align='center'>
						<template slot-scope='scope'>
							<el-button @click='removePat(scope.$index)'
								type='danger'
								style='height:22px;width:52px;padding:0;margin:0;font-:13px;'>移除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-dialog>
		</div>
    <!-- 步骤一已预约检查 -->
    <checked-list
      :infoShow2='infoShow'
      :checkListData='gridData'
      @closeDialog='closeList'>
    </checked-list>
  </div>
</template>
<script>
  import { InspectionNotice } from 'RJZL_API/InitiateNotification';
  import { commonUrl } from 'RJZL_API/commonUrl';
  import { setTimeout } from 'timers';
  import CheckedList from './checkedList/checkedList';
  export default {
    name: 'initiatingNoticeOfInspection',
    data() {
      return {
        adminId: sessionStorage.getItem('userId'),
        step: 0, // 步骤
        totalPage: 10000, // 总页数
        searchParams: {
          adminId: sessionStorage.getItem('userId'),
          pager: 1, // 当前页码
          limit: 10, // 每页条数
          brxm: '', // 病人姓名（可选）
          mobile: '', // 联系方式（可选）
          beginTime: '', // 创建开始时间：年月日时分秒(可选)
          endTime: '', // 创建结束时间：年月日时分秒（可选)
          diagnosetype: '4', // 肿瘤患者
          diseaseId: ''
        },
        diseaseList: [] /* 疾病列表 */,
        /* 表格数据 */
        dataList: [],
        addList: [], // 已经添加的用户
        hzLoading: false, // 患者loading
        patModal: false, // 已选患者列表显示
        isAll: 0, // 是否选择当前时间段的所有病人
        startTime: '',
        queryLoading: false, // 疾病loading
        projectName: [], // 检查项目
        projectAdress: [], // 检查地点
        icd: '选项3',
        locationId: '选项5',
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() <= (Date.now() - 3600 * 1000 * 24);
          }
        },
        orderTime: '',
        checkVos: [
          {
            icd: '',
            locationId: '',
            orderTime: '',
            icdName: '',
            locationName: ''
          }
        ],
        icdName: '',
        locationName: '',
        params: {
          adminId: sessionStorage.getItem('userId'),
          hzxxIds: [],
          isAll: '',
          beginTime: '', // 导入开始时间：年月日时分秒(可选)
          endTime: '', // 导入结束时间：年月日时分秒（可选）
          mobile: '', // 联系方式
          brxm: '', // 病人姓名（可选）
          diseaseId: '',
          checkVos: []
        },
        step2Loading: false, // 确定发起通知
        projectIndex: '0', // 选中的当前项目行
        infoShow: false, /* 通知计划详情显示 */
        gridData: []
      };
    },
    components: {
      CheckedList
    },
    mounted() {
      this.getData();
      // this.getPlanList();
    },
    methods: {
      /** 疾病远程搜索 */
      remoteMethod(query) {
        if (query !== '') {
          this.queryLoading = true;
          setTimeout(() => {
            commonUrl.autocomplete({
              'zjm': query,
              'diseaseType': '0'
            }).then((res) => {
              this.queryLoading = false;
              if (res.code == 0) {
                this.diseaseList = res.data;
              } else {
                this.diseaseList = [];
              }
            }).catch((error) => {
              console.log(error);
            });
          }, 200);
        } else {
          this.diseaseList = [];
        }
      },
      /** @description
       * 创建时间更改
       */
      timeChange(time) {
        console.log(time);
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
        InspectionNotice.select(this.searchParams).then(res => {
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
       * 查看已预约项目
       */
      lookDetailsBtn(rows) {
        this.infoShow = true;
        InspectionNotice.checktaskList({
          'hzxxId': rows.id
        }).then(res => {
          this.gridData = res.data;
        });
      },
      /**
       * 关闭已预约的弹框
       */
      closeList(value) {
        this.infoShow = value;
      },
      /**
       * 数据格式化
       */
      formData(data) {
        for (const item of data) {
          for (const ite of this.addList) {
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
          this.$message.warning('您尚未添加任何患者');
          return false;
        }
        this.step = 1;
        this.$nextTick(function() {
          this.getProjectList();
        });
      },
      /** @description
       * 下一步，选择方案
       */
      nextStep() {
        if (this.addList.length == 0) {
          this.$message.warning('您尚未添加任何患者');
          return false;
        }
        this.step = 1;
        this.$nextTick(function() {
          this.getProjectList();
        });
      },
      /** @description
       * 上一步，选择患者
       */
      backBtn() {
        if (this.isAll === 1) {
          window.location.reload();
        } else {
          this.step = 0;
        }
      },
      /** @description
       * 发起通知
       */
      sureStep() {
        let foo = 0;
        // 判断是否为空
        this.checkVos.forEach(item => {
          if (!item.icd || !item.locationId || !item.orderTime) {
            this.$message.warning('请填写完整信息！');
            foo++;
            return false;
          }
        });

        if (foo < 1) {
          this.$confirm('确定要发起随访吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              if (this.isAll == 0) {
                this.params.isAll = 0;
                this.params.hzxxIds = [];
                for (const item of this.addList) {
                  this.params.hzxxIds.push(item.id);
                }
              } else if (this.isAll == 1) {
                this.params.isAll = 1;
                this.params.brxm = this.searchParams.brxm;
                this.params.beginTime = this.searchParams.beginTime;
                this.params.endTime = this.searchParams.endTime;
                this.params.diseaseId = this.searchParams.diseaseId;
                this.params.mobile = this.searchParams.mobile;
              }
              this.params.checkVos = this.checkVos;
              const pp = this.params;
              this.step2Loading = true;
              InspectionNotice.visit(pp)
                .then(res => {
                  this.step2Loading = false;
                  if (res.code == 0) {
                    this.step = 3;
                  } else {
                    this.$message.warning(res.message);
                  }
                })
                .catch(err => {
                  this.step2Loading = false;
                });
            })
            .catch(() => {
              this.$message.info('已取消');
            });
        }
      },
      /** 选择发起时间 */
      selectTime(val) {
        this.orderTime = val;
        console.log(this.checkVos);
      },
      /**
       * 选中的当前项目index
       */
      liClick(index) {
        console.log(index);

        this.projectIndex = index;
      },
      /** 选择发起地点 */
      selectAdress(value) {
        let obj = {};
        obj = this.projectAdress.find((item) => {
          return item.id === value;
        });
        this.locationName = '';
        this.locationName = obj.location;
        this.checkVos[this.projectIndex].locationName = this.locationName;
      },
      /** 再次添加 */
      addAgainButton() {
        this.checkVos.push({
          icd: '',
          locationId: '',
          orderTime: '',
          icdName: '',
          locationName: ''
        });
      },
      /** 获取检查项目的label */
      selectProjectName(value) {
        let selectProject = '';
        this.icdName = '';
        this.projectName.forEach(item => {
          if (item.disease.icd === value) {
            selectProject = item.disease.id;
            this.icdName = item.disease.name;
          }
        });
        this.checkVos[this.projectIndex].icdName = this.icdName;
        this.getAdressList(selectProject);
      },
      /** 步骤二获取检查项目列表 */
      getProjectList() {
        InspectionNotice.list({
          page: '1',
          diseaseType: '2',
          limit: '100000'
        })
          .then(res => {
            if (res.code === 0) {
              this.projectName = res.data;
              this.checkVos[0].icd = res.data[0].disease.icd;
              this.checkVos[0].icdName = res.data[0].disease.name;
              this.$nextTick(function() {
                this.getAdressList(res.data[0].disease.id);
              });
            }
          })
          .catch(error => {
            this.$message.error(error.message);
          });
      },
      /** 步骤二获取检查地点 */
      getAdressList(value) {
        InspectionNotice.associateId({
          pager: '1',
          limit: '10000',
          associateId: value,
          associateType: '1'
        })
          .then(res => {
            console.log(res);
            if (res.code === 0) {
              if (res.data.length) {
                this.projectAdress = res.data;
                this.$nextTick(function() {
                  this.checkVos[this.projectIndex].locationId = res.data[0].id;
                  this.checkVos[this.projectIndex].locationName = res.data[0].location;
                });
              }
            }
          })
          .catch(error => {
            this.$message.error('test');
          });
      },
      /** 删除检查项目 */
      deleteBtn(index) {
        this.checkVos.splice(index, 1);
      }
    }
  };
</script>
<style lang='scss'>
  @import '~styles/search';
  .app-container {
    .step2 {
      background: #fff;
      .step2-select-list {
        width: 100%;
        height: 50px;
        line-height: 39px;
        padding: 5px 20px;
        background: #66b1ff4f;
        margin: 5px;
        border-radius: 10px;
        .select-options {
          width: 300px;
          float: left;
          span {
            display: display-inline;
            // float: left;
          }
        }
      }
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
  }
  // 下一步
  .rowCenter {
    padding: 30px 0;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    text-align: center;
    .el-button {
      margin-left: 20px;
    }
  }
  // 已预约患者
  .addDg {
    .el-dialog__header {
      border-bottom: 1px solid #EBEEF5;
    }
  }
</style>