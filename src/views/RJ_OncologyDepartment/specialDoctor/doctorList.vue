<template>
  <div class="doctorList">
    <!-- 查询 -->
		<el-row class="common-search">
			<el-form :inline="true" :model="formInline" label-width="80px">
			  <el-col :span="6">
			  	<el-form-item label="医生姓名">
				    <el-input v-model.trim="formInline.name" placeholder="请输入姓名" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
			  	<el-form-item label="联系电话">
				    <el-input v-model.trim="formInline.mobile" placeholder="请输入联系电话" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
			  	<el-form-item label="科室">
				    <el-input v-model.trim="formInline.departmentName" placeholder="请输入科室名称" clearable></el-input>
				  </el-form-item>
				</el-col>
			  <el-col :span="6">
          <el-button type="primary" size="small" @click="searchBtn">查询</el-button>
			  	<el-button type="success" plain size="small" @click="editDoctor">新增</el-button>
			  </el-col>

			</el-form>
		</el-row>
		<!-- 表格 -->
		<el-row class="common-table">
			<el-col :span="24">
        <el-table
          border
          :data="tableData_list.list"
          style="width: 100%;"
          v-loading="tableData_list.loading"
        >
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="departmentName" label="所属科室" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="deleteDoctor(scope.row)">删除</el-button>
              <el-button type="primary" size="mini" @click="editDoctor(scope.row)">编辑</el-button>
              <el-button type="warning" size="mini" @click="lookDetailes(scope)">通知TA看诊</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row v-if="tableData_list.list.length" style="margin-top: 11px;">
          <!-- 分页 -->
          <el-col :span="12" :offset="12">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="tableData_list.pager"
              :page-size="10"
              layout="total,prev, pager, next, jumper"
              :total="tableData_list.totalPage">
            </el-pagination>
          </el-col>
        </el-row>

			</el-col>
		</el-row>
    <!-- 新增/编辑医生 -->
    <el-dialog
      title="新增/编辑医生"
      :visible.sync="addDoctorDialog"
      :before-close="beforeClose"
      custom-class="dialogBorder"
      width="900px"
      >
      <el-form :model="addDoctorForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="姓名" prop="name" class="tipNameitem">
          <el-input v-model="addDoctorForm.name" @change='nameChange'></el-input>
          <p class="tipName" v-if="tipName">该医生已存在!</p>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="addDoctorForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="科室名称" prop="departmentName">
          <el-input v-model="addDoctorForm.departmentName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button 
          @click="addDoctorBtn('ruleForm')" 
          :loading="addDoctorBtnLoading.addLoading" 
          :disabled="addDoctorBtnLoading.addDisabled">
          保存
        </el-button>
        <el-button 
        type="primary" 
          @click="addDoctorAndPlan('ruleForm')" 
          :loading="addDoctorBtnLoading.planLoading" 
          :disabled="addDoctorBtnLoading.addDisabled">保存并发起通知
        </el-button>
      </span>
    </el-dialog>
    <!-- 通知看诊 -->
    <el-dialog
      title="发起通知计划"
      :visible.sync="addPlanDialog"
      custom-class="dialogBorder"
      width="1200px"
      :before-close="resetPlanDialog"
      >
      <el-row class="common-table" style="padding: 0;">
        <el-col :span="24">
          <el-table
            :data="addPlanData"
            stripe
            border
            height="300"
            >
            <el-table-column prop="name" label="方案名称" align="center"></el-table-column>
            <el-table-column prop="departmentName" label="科室"  align="center"></el-table-column>
            <el-table-column prop="address" label="操作"  align="center">
              <template slot-scope="scope">
                <el-button :type="scope.row.selected?'success':'primary'" size="mini" @click="selectScheme(scope)">
                  {{scope.row.selected?'已选择':'选择方案'}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="timeStyle">
        <el-col :span="12">
          <el-tag type="primary" size="large">医生预约看诊时间</el-tag>
          <el-date-picker
            v-model="schemePramer.appointmentTime"
            value-format='yyyy-MM-dd HH:mm:ss'
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-col>
        <el-col :span="12">
          <el-tag type="primary" size="large">AI通知日期</el-tag>
          <el-date-picker
            v-model="schemePramer.visitTime"
            value-format='yyyy-MM-dd'
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
        <el-col :span="24" class="time-tips">
          <i class="el-icon-info tipIcon"></i>通知日期为当天时，AI将会在半个小时后进行电话通知(时间均为必填！)。
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPlanDialog">取 消</el-button>
        <el-button type="primary" @click="schemeBtn">发起通知</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { specialDoctor } from 'RJZL_API/specialDoctor';
  export default {
    name: 'doctorList',
    data() {
      var checkMobile = (rule, value, callback) => {
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (value === '') {
          callback(new Error('手机号不能为空'));
        } else if (myreg.test(value)) {
          callback();
        } else {
          callback(new Error('手机号码格式错误!'));
        }
      };
     　return {
        formInline: {
          name: '',
          mobile: '',
          departmentName: '',
          pager: 1,
          limit: 10
        },
        tableData_list: {
          list: [],
          totalPage: null,
          pager: 1,
          loading: false
        },
        addDoctorDialog: false, // 新增/编辑医生弹框
        addDoctorForm: { // 新增/编辑医生表单校验
          name: '',
          mobile: '',
          departmentName: ''
        },
        addDoctorBtnLoading: { // 新增按钮
          addLoading: false,
          addDisabled: false,
          planLoading: false,
          planDisabled: false
        },
        rules: {
          name: [
            { required: true, message: '请输入医生姓名', trigger: 'blur'}
          ],
          departmentName: [
            { required: true, message: '请输入科室名称', trigger: 'blur'}
          ],
          mobile: [
            { required: true, validator: checkMobile, trigger: 'blur'}
            // { required: true, message: '请输入科室名称', trigger: 'blur'},
          ]
        },
        addPlanDialog: false, // 通知看诊弹框
        addPlanData: [], // 方案列表
        schemePramer: { // 发起通知
          doctorId: '',
          adminId: sessionStorage.getItem('userId'),
          schemeId: '',
          schemeName: "", //随访方案名称
          appointmentTime: "", //医生预约时间
          visitTime: "",   //AI通知时间
          activeType: "10"   //随访类型  10--特约门诊通知。
        },
        markId: '', // 编辑医生的id
        tipName: false // 新增时该医生是否存在

      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      /** 查询 */
      searchBtn() {
        this.formInline.pager = 1
        this.getData()
      },
      /** 获取列表 */
      getData(item) {
        this.tableData_list.loading = true;
        specialDoctor.specialdoctorList(this.formInline).then(res => {
          this.tableData_list.loading = false;
          if(res.code === 0) {
            if(!item) {
              this.tableData_list.list = res.data
              if(this.tableData_list.pager==1) {
                this.tableData_list.totalPage = res.count
              }
            }else{
              res.data.length?this.tipName=true:this.tipName=false
            }
            
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          this.tableData_list.loading = false;
          this.$message.error(err.message)
        })
      },
      nameChange(value) {
       
        this.formInline.name = value
        this.formInline.limit = 100000
        this.getData(true)
      },
      /** 分页 */
      handleCurrentChange(page) {
        this.formInline.pager = page
        this.getData()
      },
      /** 打开 新增/编辑医生 弹框*/
      editDoctor(row) {
        this.addDoctorDialog = true
        this.addDoctorForm.departmentName = row.departmentName
        this.addDoctorForm.name = row.name
        this.addDoctorForm.mobile = row.mobile
        // 如果 选择编辑医生时获取该医生的id
        if(row.id) {
          this.markId = row.id
        }
      },
      /** 新增/编辑医生按钮 */
      addDoctorBtn(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.markId) {
              this.updateDoctorFun()
            }else {
              this.addDoctorFun()
            }
          } else {
            return false;
          }
        });
      },
      /** 新增医生 */
      addDoctorFun(item) {
        this.addDoctorBtnLoading.addLoading = true
        this.addDoctorBtnLoading.addDisabled = true
        specialDoctor.specialdoctorSave(this.addDoctorForm).then(res => {
          this.tipName?this.tipName=false:this.tipName
          this.addDoctorBtnLoading.addLoading = false
          this.addDoctorBtnLoading.addDisabled = false
          // 如果点击的按钮为保存并发起通知
          if(item) {
            this.addDoctorBtnLoading.planLoading = false
            this.addDoctorBtnLoading.planDisabled = false
          }
          if(res.code === 0) {
            this.$refs.ruleForm.resetFields();
            this.addDoctorDialog = false
            this.getData()
            this.$message.success(res.message)
            // 发起看诊通知
            if(item) {
              this.markId = res.data
              this.addPlanDialog = true
              this.getSchemList()
            }
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          this.tipName?this.tipName=false:this.tipName
          this.addDoctorBtnLoading.addLoading = false
          this.addDoctorBtnLoading.addDisabled = false
          if(item) {
            this.addDoctorBtnLoading.planLoading = false
            this.addDoctorBtnLoading.planDisabled = false
          }
          this.$message.error(err.message)
        })
      },
       /** 编辑医生 */
      updateDoctorFun(item) {
        this.addDoctorBtnLoading.addLoading = true
        this.addDoctorBtnLoading.addDisabled = true
        specialDoctor.specialdoctorUpdate({
          ...this.addDoctorForm,
          id:this.markId
          }).then(res => {
          this.tipName?this.tipName=false:this.tipName
          this.addDoctorBtnLoading.addLoading = false
          this.addDoctorBtnLoading.addDisabled = false
          // 如果点击的按钮为保存并发起通知
          if(item) {
            this.addDoctorBtnLoading.planLoading = false
            this.addDoctorBtnLoading.planDisabled = false
          }
          
          if(res.code === 0) {
            this.$refs.ruleForm.resetFields();
            this.addDoctorDialog = false
            this.getData()
            this.$message.success(res.message)
            // 发起看诊通知
            if(item) {
              this.addPlanDialog = true
              this.getSchemList()
            } else {
              this.markId = ''
            }
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          this.tipName?this.tipName=false:this.tipName
          this.markId = ''
          this.addDoctorBtnLoading.addLoading = false
          this.addDoctorBtnLoading.addDisabled = false
          if(item) {
            this.addDoctorBtnLoading.planLoading = false
            this.addDoctorBtnLoading.planDisabled = false
          }
          this.$message.error(err.message)
        })
      },
      /** 编辑并发起通知 */
      addDoctorAndPlan() {
        // 判断该医生是否已存在
        this.addDoctorBtnLoading.planLoading = true
        this.addDoctorBtnLoading.planDisabled = true
        // 如果存在markId,则为编辑，否则为新增
        if(this.markId) {
          this.updateDoctorFun(true)
        }else {
          this.addDoctorFun(true)
        }
      },
      // 清空form
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.addDoctorDialog = false
      },
      beforeClose() {
        this.$refs.ruleForm.resetFields();
        this.addDoctorDialog = false
        this.tipName?this.tipName=false:this.tipName
      },
      /** 删除医生 */
      deleteDoctor(row) {
        specialDoctor.specialdoctorDelete({
          id: row.id
        }).then(res => {
          if(res.code === 0) {
            this.getData()
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
       /** 打开 通知就诊 弹框*/
      lookDetailes(scope) {
        this.addPlanDialog = true
        this.getSchemList()
      },
      /** 获取方案列表 */
      getSchemList() {
        specialDoctor.planList({
          pager: 1,
          limit: 10000,
          departmentId: '',
          diseaseId: '',
          activeType: '10'
        }).then(res => {
          if(res.code === 0) {
            res.data.forEach(item => {
              item = Object.assign(item, {
                selected: false
              })
            })
            this.addPlanData = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      /** 选择方案 */
      selectScheme(scope) {
        scope.row.selected = !scope.row.selected
        // 选中方案，则其他方案为false，否则全部为false
        if(scope.row.selected){
          // 选中方案信息
          this.schemePramer= {
            ...this.schemePramer,
            doctorId: scope.row.id,
            schemeId: scope.row.id,
            schemeName: scope.row.name, //随访方案名称
          }
          this.addPlanData.forEach((item, index) => {
            if(index == scope.$index) {
              return item.selected
            } else {
              item.selected = false
            }
          })
        } else {
          this.addPlanData.forEach((item, index) => {
            item.selected = false
          })
        }
      },
      /** 发起通知 */
      schemeBtn() {
        if(this.schemePramer.appointmentTime =='' || this.schemePramer.visitTime =='') {
          this.$message.error('请选择时间!')
        } else if (this.schemePramer.schemeId =='') {
          this.$message.error('请选择方案!')
        } else {
          specialDoctor.clinic(this.schemePramer)
          .then(res => {
            this.addPlanDialog = false
            if(res.code === 0) {
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          }).catch(err => {
            this.addPlanDialog = false
            this.$message.error(err.message)
          })
        }
      },
      /** 取消通知 */
      resetPlanDialog() {
        this.schemePramer.appointmentTime = ''
        this.schemePramer.visitTime = ''
        this.addPlanDialog = false
      }
    }
  }
</script>
<style lang="scss">
  @import '~styles/search';
  .doctorList {
    .timeStyle {
      padding-top: 20px;
      .time-tips {
        line-height: 36px;
        color: rgba(0,0,0,.7);
        .tipIcon {
          color: #ff7800;
          padding-right: 10px;
        }
      }
    }
  }
  .dialogBorder {
    .el-dialog__body {
      padding-bottom: 0;
    }
    .el-dialog__footer {
      text-align: center;
      border-top: 1px solid #EBEEF5;
    }
  }
  .tipNameitem {
    position: relative;
    .tipName{
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 25px;
      left: 0;
    }
  }
</style>