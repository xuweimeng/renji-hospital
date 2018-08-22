<template>
  <div class="addList">
    <el-dialog
      title="添加患者"
      width="650px"
      custom-class="addDg"
      :visible.sync="dialogFormVisible"
      :before-close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" :label-width="formLabelWidth" ref="ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="ruleForm.name"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
            style="width: 100%">
            <template slot-scope="{ item }">
              <div class="name">{{ item.brxm }}</div>
              <span class="addr">{{ item.jtdh }}&nbsp;</span>
              <div class="name1">{{ item.brxb }} / {{item.age}}</div>
              <span class="addr1">{{ item.icdName }}&nbsp;</span>
              <div class="nameBtn"> <el-button type="primary">选择</el-button></div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model.trim="ruleForm.mobile" maxlength="11" auto-complete="off" placeholder="请输入患者联系电话"></el-input>
        </el-form-item>
        <el-form-item label="疾病名称" prop="icd">
          <el-col :span="11">
            <el-select
              v-model="ruleForm.icd"
              filterable
              remote
              clearable
              placeholder="请输入关键词"
              @change="handChange"
              :remote-method="remoteMethod"
              :loading="loading"
              style="100%">
              <el-option
                v-for="(item, index) in options4"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="性别">
          <el-col :span="11">
            <el-select v-model="ruleForm.sex" placeholder="请选择患者性别" style="100%">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="出生日期" class="formTime">
          <el-col :span="11">
            <el-date-picker type="date"
              placeholder="请选择出生日期"
              v-model="ruleForm.csny"
              style="width: 100%;"
              value-format="yyyy-MM-dd"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="时间" class="formTime">
          <el-col :span="11">
            <el-date-picker type="date"
              placeholder="请选择入院时间"
              v-model="ruleForm.intime"
              style="width: 100%;"
              value-format="yyyy-MM-dd"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-date-picker
             type="date"
             placeholder="请选择出院时间"
             v-model="ruleForm.outtime"
             value-format="yyyy-MM-dd"
             style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="主任医师">
          <el-input v-model="ruleForm.mainDoctor" auto-complete="off" placeholder="请输入主任医师"></el-input>
        </el-form-item>
        <el-form-item label="诊断">
          <el-input v-model="ruleForm.diagnose" auto-complete="off" placeholder="请输入诊断结果"></el-input>
        </el-form-item>
        <el-form-item label="治疗方案">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 3}" placeholder="请输入治疗方案" v-model="ruleForm.treatmentPlan"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" :loading="submitLoading" :disabled="submitDisabled" @click="submitForm('ruleForm')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { hzList } from 'RJZL_API/patientList'
  import { commonUrl } from 'RJZL_API/commonUrl'
  export default {
    name: 'AddList',
    data () {
      // var checkMobile = (rule, value, callback) => {
      //   // var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      //   // if (value === '') {
      //   //   callback(new Error('手机号不能为空'));
      //   // } 
      //   // else if (myreg.test(value)) {
      //   //   callback();
      //   // } else {
      //   //   callback(new Error('手机号码格式错误!'));
      //   // }
      // };
      return {
        dialogFormVisible: false,
        ruleForm: {
          adminId: sessionStorage.getItem('userId'),
          icd: '',
          icdName: '',
          sex: '',
          intime: '',
          outtime: '',
          diagnose: '',
          treatmentPlan: '',
          name: '',
          mainDoctor: '',
          csny: ''
       },
        formLabelWidth: '80px',
        loading: false, // select Loading...
        options4: [], // 疾病
        rules: {
          name: [
            { required: true, message: '请输入患者姓名', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
          ],
          icd: [
            { required: true, message: '请输入疾病名称', trigger: 'blur' }
          ]
        },
        closeMessage: {
          close: false,
          success: false
        },
        timeout: null,
        loadingName: false,
        restaurants: [],
        brxm: '',
        submitLoading: false, // 提交按钮loading
        submitDisabled: false // 提交按钮disabled
      }
    },
    props: [
      'elDialog'
    ],
    methods: {
      /**
       * 姓名远程搜索
       */
      querySearch(queryString, cb) {
        if (queryString) {
          hzList.getPatientByName({
            adminId: sessionStorage.getItem('userId'),
            patientName: queryString
          }).then( res => {
            if (res.code === 0) {
              this.restaurants = res.data
              var restaurants = res.data;
              this.$nextTick(function () {
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
              })
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.brxm.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      /** 选择已有的患者信息 */
      handleSelect(item) {
        let obj = {
          value: item.icd,
          label: item.icdName?item.icdName:' '
        }
        this.options4.push(obj)
        this.ruleForm.name = item.brxm
        this.ruleForm.mobile = item.jtdh
        this.ruleForm.sex = item.brxb
        this.ruleForm.csny = item.csny
        this.ruleForm.icd = item.icd
        this.ruleForm.icdName = item.icdName
        this.ruleForm.intime = item.intime
        this.ruleForm.outtime = item.outtime
        this.ruleForm.mainDoctor = item.mainDoctor
        this.ruleForm.diagnose = item.diagnose
        this.ruleForm.treatmentPlan = item.treatmentPlan
      },
      /** 疾病远程搜索 */
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            commonUrl.getdiseasefix({
              'jbmc': query
            }).then((res)=>{
              if(res.code == 0) {
                this.options4=res.data.map(item => {
                  return {label: item.jbmc,value: item.icd10}
                })
              }
            }).catch((error)=>{
              console.log(error)
            })
          }, 200);
        } else {
          this.options4 = [];
        }
      },
      /** 疾病检索获取label **/
      handChange (value) {
        if (value) {
          let obj = this.options4.find((item)=> {
            return item.value === value
          })
          this.ruleForm.icdName = obj.label
        }
      },
      /** 提交 */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addOncology()
          } else {
            return false;
          }
        });
      },
      /** 关闭弹框，清空数据 */
      closeDialog () {
        this.ruleForm.icd = ''
        this.ruleForm.icdName = ''
        this.ruleForm.sex = ''
        this.ruleForm.csny = ''
        this.ruleForm.intime = ''
        this.ruleForm.outtime = ''
        this.ruleForm.diagnose = ''
        this.ruleForm.treatmentPlan = ''
        this.ruleForm.mainDoctor = ''
        this.$refs.ruleForm.resetFields();
        this.options4.length = 0
        this.$emit('closeDialogFun', this.closeMessage)
      },
      /**
       * 新增患者
       */
      addOncology () {
        this.submitLoading = true
        this.submitDisabled = true
        hzList.addOncology(this.ruleForm).then((res)=>{
          this.submitLoading = false
          this.submitDisabled = false
          if(res.code == 0) {
            this.$message.success(res.message)
            this.closeMessage.success = true
            this.ruleForm.icdName = ''
            this.ruleForm.sex = ''
            this.ruleForm.csny = ''
            this.ruleForm.mainDoctor = ''
            this.ruleForm.intime = ''
            this.ruleForm.outtime = ''
            this.ruleForm.diagnose = ''
            this.ruleForm.treatmentPlan = ''
            this.options4 = []
            this.$emit('closeDialogFun', this.closeMessage)
            this.$refs.ruleForm.resetFields();
          }else {
            this.$message.error(res.message)
          }
        }).catch((error)=>{
          this.submitLoading = false
          this.submitDisabled = false
          this.$message.error(error.message)
        })
      }

    },
    watch: {
      elDialog(old, new3) {
        this.dialogFormVisible = this.elDialog
      }
    }
  }
</script>

<style lang="scss">
.addDg{
  z-index: 100;
  .el-dialog__header {
    padding: 10px 20px 10px;
    text-align: left;
    border-bottom: 1px solid #ececec;
    .el-dialog__title {
      font-size: 14px;
      color: #666;
    }
    .el-dialog__headerbtn {
      top: 11px;
    }
  }
  .el-dialog__body {
    padding: 30px 20px 55px;
    .el-form{
      // width: 80%;
      .el-form-item {
        text-align: left;
        .el-form-item__label {
          height: 32px;
          line-height: 32px;
        }
        .el-form-item__content{
          margin-left: 80px!important;
          height: 32px;
          line-height: 32px;
          .el-input .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }
      }
    }
  }
  .el-dialog__footer {
    padding: 10px 20px 10px;
    text-align: center;
    border-top: 1px solid #ececec;
  }
}
// 日期的icon行高
.formTime {
  .el-form-item__content .el-col .el-input .el-input__icon{
    line-height: 35px;
  }
}
// 姓名下拉搜索行
.my-autocomplete {
  z-index: 10000!important;
  width: 500px!important;
  li {
    line-height: normal;
    padding: 7px;
    border-bottom: 1px solid #eee;
    .name, .name1 {
      float: left;
      min-width: 70px;
      max-width: 70px;
      line-height: 30px;
      font-size: 14px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr, .addr1 {
      float: left;
      line-height: 30px;
      font-size: 14px!important;
      min-width: 140px;
      max-width: 140px;
      font-size: 12px;
      color: #b4b4b4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .highlighted .addr {
      color: #ddd;
    }
    .nameBtn {
      .el-button {
        padding: 6px 12px;
      }
    }
  }
}
</style>
