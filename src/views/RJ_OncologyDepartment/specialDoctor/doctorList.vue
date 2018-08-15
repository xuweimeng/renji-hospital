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
          <!-- <el-table-column label="性别/年龄" align="center" width="110">
            <template slot-scope="scope">
              {{scope.row.brxb}} <span v-show="scope.row.brxb && scope.row.age >= 0">/</span> {{scope.row.age}}
            </template>
          </el-table-column> -->
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
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="addDoctor('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 通知看诊 -->
    <el-dialog
      title="发起通知计划"
      :visible.sync="addPlanDialog"
      custom-class="dialogBorder"
      width="900px"
      >
      <el-row class="common-table" style="padding: 0;">
        <el-col :span="24">
          <el-table
            :data="addPlanData"
            stripe
            border
            >
            <el-table-column prop="date" label="方案名称" align="center"></el-table-column>
            <el-table-column prop="deparment" label="科室"  align="center"></el-table-column>
            <el-table-column prop="address" label="操作"  align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini">选择方案</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="timeStyle">
        <el-col :span="12">
          <el-tag type="primary" size="large">医生预约看诊时间</el-tag>
          <el-date-picker
            v-model="times.time1"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-col>
        <el-col :span="12">
          <el-tag type="primary" size="large">AI通知日期</el-tag>
          <el-date-picker
            v-model="times.time2"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
        <el-col :span="24" class="time-tips">通知日期为当天时，AI将会在半个小时后进行电话通知。</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPlanDialog=false">取 消</el-button>
        <el-button type="primary" @click="addDoctor('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
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
        addPlanData: [{}], // 方案列表
        times: {
          time1: '', // 医生预约时间
          time2: '', // AI通知时间
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
      }
    }
  }
</script>
<style lang="scss">
  @import '~styles/search';
  .doctorList {
    .timeStyle {
      padding-top: 20px;
      // border-top: 1px solid #EBEEF5;
      .time-tips {
        line-height: 30px;
        color: rgba(0,0,0,.7);
      }
    }
  }
</style>