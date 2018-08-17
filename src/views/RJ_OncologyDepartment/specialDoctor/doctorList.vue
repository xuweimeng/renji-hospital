<template>
  <div class="doctorList">
    <!-- 查询 -->
		<el-row class="common-search">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
			  <el-col :span="6">
			  	<el-form-item label="患者姓名">
				    <el-input v-model.trim="formInline.brxm" placeholder="请输入姓名" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
			  	<el-form-item label="联系电话">
				    <el-input v-model.trim="formInline.mobile" placeholder="请输入联系电话" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
			  	<el-form-item label="科室">
				    <el-input v-model.trim="formInline.schemeName" placeholder="请输入科室名称" clearable></el-input>
				  </el-form-item>
				</el-col>
			  <el-col :span="6">
          <el-button type="primary" size="small" @click="searchBtn">查询</el-button>
			  	<el-button type="primary" size="small" @click="editDoctor()">新增</el-button>
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
          <el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="mobile" label="所属科室" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="editDoctor(scope)">删除</el-button>
              <el-button type="primary" size="mini" @click="editDoctor(scope)">编辑</el-button>
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addDoctorForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="addDoctorForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="科室名称" prop="deparment">
          <el-input v-model="addDoctorForm.deparment"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">保存</el-button>
        <el-button type="primary" @click="addDoctor('ruleForm')">保存并发起通知</el-button>
      </span>
    </el-dialog>
    <!-- 通知看诊 -->
    <el-dialog
      title="发起通知计划"
      :visible.sync="addPlanDialog"
      custom-class="dialogBorder"
      width="1200px"
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
        <el-button @click="addPlanDialog=false">取 消</el-button>
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
          deparment: '',
          pager: 1,
          limit: 10
        },
        tableData_list: {
          list: [{}],
          totalPage: 100,
          pager: 1,
          loading: false
        },
        addDoctorDialog: false, // 新增/编辑医生弹框
        addDoctorForm: { // 新增/编辑医生表单校验
          name: '',
          mobile: '',
          deparment: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入医生姓名', trigger: 'blur'}
          ],
          deparment: [
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
        }

      }
    },
    mounted() {
    },
    methods: {
      /** 查询 */
      searchBtn() {

      },
      /** 分页 */
      handleCurrentChange(page) {

      },
      /** 打开 新增/编辑医生 弹框*/
      editDoctor(row) {
        this.addDoctorDialog = true
      },
      /** 新增/编辑医生 */
      addDoctor(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.addDoctorDialog = false
      },
      beforeClose() {
        this.$refs.ruleForm.resetFields();
        this.addDoctorDialog = false
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
            doctorId: scope.row.doctorId,
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
        // if(this.schemePramer.appointmentTime =='' || this.schemePramer.visitTime =='') {
        //   this.$message.error('请选择时间!')
        // } else if (this.schemePramer.schemeId =='') {
        //   this.$message.error('请选择方案!')
        // } else {
          specialDoctor.clinic(
            // this.schemePramer
            {
                  "doctorId": "19a6419d-9b87-11e8-bea8-005056a77d99", //看疹医生ID
                  "adminId": "23b62522-058e-11e8-aef9-005056a9612c",  //登录账号ID（操作者为护士）
                  "schemeId": "07595524-a049-11e8-95d3-005056a77d99", //随访方案ID
                  "schemeName": "看诊通知", //随访方案名称
                  "appointmentTime": "2018-08-20 09:00:00", //看疹预约时间
                  "visitTime": "2018-08-18",   //通知时间
                  "activeType": "10"   //随访类型  10--特约门诊通知。
            }
            ).then(res => {
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
      //   }
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
</style>