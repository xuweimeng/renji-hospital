<template>
  <div class="app-container">
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input v-model.trim="followwaySearch.brxm" clearable placeholder="请输入姓名"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系电话</label>
        <el-input v-model.trim="followwaySearch.jtdh" clearable placeholder="请输入联系电话"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >证件号码</label>
        <el-input v-model.trim="followwaySearch.sfzh" clearable placeholder="请输入证件号码"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >性别</label>
        <el-select v-model="followwaySearch.brxb" placeholder="请选择" >
          <el-option label="全部" value=""></el-option>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </li>
      <li class="common_search_single common_search_single_time">
        <label class="radio-label" >出生年月</label>
        <el-date-picker
          v-model="endBirthday"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          popper-class="mdDate"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change ='selectDate'
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </li>
      <!--<li class="common_search_single">-->
        <!--<label class="radio-label" >标签</label>-->
        <!--<el-select v-model="followwaySearch.isLive" placeholder="请选择" >-->
          <!--<el-option label="全部" value=""></el-option>-->
          <!--<el-option label="正常" value="1"></el-option>-->
          <!--<el-option label="死亡" value="0"></el-option>-->
        <!--</el-select>-->
      <!--</li>-->
      <li class="common_search_single common_search_single_longBtn">
        <el-button  @click="waySearch" type="primary" icon="el-icon-search" >查询</el-button>

        <el-button type="success" @click="additionPatients">
          添加客户
        </el-button>
      </li>
    </ul>
  <div class="ctList">
    <!-- 活动通知 -->
    <el-row class="hztz" >
      <el-col :span="24">
        <el-table :data="tableAll" border style="margin-bottom: 10px;" ref="patientlist" class="wayTable" v-loading="loading1" >
          <el-table-column prop="brxm" label="姓名" align="center">
            <!--<template slot-scope="scope">-->
              <!--<Icon class="el-icon-star-off"></Icon>-->
            <!--</template>-->

          </el-table-column>
          <el-table-column prop="jtdh" label="联系电话" align="center">
          </el-table-column>
          <el-table-column prop="brxb" label="性别" align="center">
          </el-table-column>
          <el-table-column prop="csny" label="出生年月" align="center" >
          </el-table-column>
          <el-table-column prop="sfzh" label="证件号码" align="center">

          </el-table-column>
          <el-table-column label="操作" align="center" >
            <template slot-scope="scope">
              <el-button class="btn-public" plain style=" background: white" @click="modificationAction(scope)">改约</el-button>
              <el-button type="primary" style="" class="btn-public" @click="archiveAction(scope)">档案</el-button>
              <!--<el-button type="primary" style="height:23px;padding:0 5px;font-size-->
              <!--:13px;background:#1899ff;" @click="changeNumberAction(scope)">修改手机号</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-row class="block">
          <el-col :span="14" style="float: right;" >
            <el-pagination style="float: right;margin-right: 29px;"
                           background
                           :current-page.sync="followwaySearch.pager"
                           @current-change="handleCurrentChange"
                           :page-size="10"
                           layout="total,prev, pager, next, jumper"
                           :total="totalPage1" v-if="totalPage1>=10">
            </el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <record ref="record" @refresh="list" :patientId="patientId"></record>


    <!-- 添加客户弹框-->
    <el-dialog title="添加客户" :visible.sync="patientsShow" width="525px" top="30px" :center = "false" custom-class="patientDialog" @close="closeAction('ruleForm')">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="113px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="khxm">
          <el-input v-model="ruleForm.khxm" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="lxsj">
          <el-input v-model="ruleForm.lxsj" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" >
          <el-input v-model="ruleForm.sfzh" placeholder="请输入身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="客户类型" prop="vip">
          <el-select v-model="ruleForm.vip" placeholder="请选择客户类型" style="float: left">
            <el-option label="VIP" value="1"></el-option>
            <el-option label="普通" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="体检套餐" class="inputLength" prop="iccvd">
          <el-select
            style="float: left;"
            v-model="ruleForm.iccvd"
            filterable
            @change="selectAction"
            remote
            clearable
            reserve-keyword
            placeholder="请输入体检套餐"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in diseaseList"
              :key="item.icd"
              :label="item.name"
              :value="item.icd+','+item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" >
          <el-select v-model="ruleForm.khxb" placeholder="请选择活动区域" style="float: left">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年月" >
          <el-date-picker
            style="float: left;"
            v-model="ruleForm.csrq"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="出生年月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="年龄" >
          <el-input v-model="ruleForm.age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="预约体检时间" prop="yytjrq">
          <el-date-picker
            type="datetime"
            style="float: left;"
            v-model="ruleForm.yytjrq"
            default-time='8:00:00'
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="预约体检时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--客户改约-->
    <el-dialog title="修改预约时间" :visible.sync="isModify" width="525px" top="30px" :center = "false" custom-class="ModifyDialog" @close="closeAction('queryModify')">
      <el-form :model="queryModify" :rules="rules" ref="queryModify"  class="demo-ruleForm">
        <el-form-item label="预约体检时间" prop="physicalTime">
          <el-date-picker
            type="datetime"
            style="float: left;"
            v-model="queryModify.physicalTime"
            default-time='8:00:00'
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="预约体检时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="体检套餐" prop="physicalName" class="physicalName">
          <el-select
            style="width: 300px;"
            v-model="queryModify.physicalName"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入体检套餐"
            :remote-method="remoteMethod"
            :loading="queryLoading">
            <el-option
              v-for="item in diseaseListModify"
              :key="item.id"
              :label="item.name"
              :value="item.icd">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" @click="modifySubmitForm('queryModify')" style="margin-left: 105px;" >确认</el-button>
          <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import { PatientList } from "../../api/RJ_PhysicalExamination/PatientList"; // 引入 api
import Record from "./components/Record";
/**
 * 活动通知function列表
 * @module ctListTo
 */
//  import {API} from '@/serve'
import { mapGetters } from "vuex";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  data() {
    return {
      queryModify: {
        physicalTime: "", // 改约体检时间
        physicalName: "" // 体检套餐选择
      },
      value5: "",
      isRepeat: false, //防止重复点击
      diseaseListModify: [], // 体检套餐
      queryLoading: false, // 体检套餐loading
      iccvd: "",
      isModify: false, // 是否改约弹窗
      ruleForm: {
        khxm: "", // 客户姓名
        khxb: "", // 客户性别
        lxsj: "", // 联系手机
        sfzh: "", // 身份证号
        tjtcbh: "", // 体检套餐编号
        tjtcmc: "", // 体检套餐名称
        vip: "", // 1表示是VIP   0表示不是
        age: "", // 年龄
        yytjrq: "", // 预约体检时间
        iccvd: "",
        csrq: "" // 出生年月
      },
      patientsShow: false, // 添加客户弹框
      isNull: false, // 患者的住院门诊为都为视空
      swiperDate: [], // 患者就诊档案时间
      PhysicalExSet: {}, // 体检套餐信息
      selectNumber: 0, // 选中第几次
      followwaySearch: {
        pager: 1, // 当前页码
        limit: 10, // 每页条数
        brxb: "", // 男  女 （中文）
        fromBirthday: "", // 出生年月开始时间
        endBirthday: "", // 出生年月结束时间
        jtdh: "", // 联系电话
        brxm: "", // 姓名
        sfzh: "" // 身份证号
      },
      rules: {
        khxm: [
          { required: true, message: "请输入客户姓名", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" }
        ],
        lxsj: [
          { required: true, message: "请输入客户联系方式", trigger: "blur" }
        ],
        vip: [{ required: true, message: "请选择客户类型", trigger: "change" }],
        yytjrq: [
          { required: true, message: "请选择预约时间", trigger: "change" }
        ],
        physicalTime: [
          { required: true, message: "请选择预约时间", trigger: "change" }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请选择客户类型",
            trigger: "change"
          }
        ],
        iccvd: [
          { required: true, message: "请选择体检套餐", trigger: "change" }
        ],
        physicalName: [
          { required: true, message: "请选择体检套餐", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      isinspectPlength: true,
      swiperOption: {
        // swiper
        slidesPerView: 4,
        spaceBetween: 30,
        slidesPerGroup: 4,
        loop: false,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      diseaseList: [], // 科室列表
      PhysicalProject: {}, // 体检项目
      patientInfo: {}, // 记录个人信息
      isCare: false,
      endBirthday: "",
      initDate: "",
      repeatFlag: true,
      customDialog: false,
      tableAll: [], // 全部患者表格data
      totalPage1: 0, // 全部患者表格data总数量
      loading1: true, // 全部患者刷新
      currentPage3: 1,
      patientId: "", // 病人id
      dialogVisible: false, // model弹框
      modelContent: {},
      numberPercent: 0, // 未通知人数百分比,
      modifyId: "" // 确认改约id
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  mounted() {
    this.getUserId();
    this.list();
  },
  components: {
    swiper,
    swiperSlide,
    Record
  },
  methods: {
    /**
     * 改约详请接口
     **/
    modificationAction(scope) {
      this.modifyId = scope.row.id;
      PatientList.getPhysicalInfo({
        hzxxId: scope.row.id
      }).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.isModify = true;
          this.queryModify.physicalTime = new Date(res.orderTime);
          this.initDate = res.orderTime;
          this.diseaseListModify = res.diseases;
          this.queryModify.physicalName =
            res.oldIcd != "undefined" ? res.oldIcd : "";
        } else {
          this.$message.error(res.message);
        }
      });
    },
    /**
     * 确认改约
     */
    modifySubmitForm(formName) {
      let initDateTime = "";
      if (this.queryModify.physicalTime.toString().indexOf("-") == -1) {
        initDateTime = this.initDate;
      } else {
        initDateTime = this.queryModify.physicalTime;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.repeatFlag) {
            return false;
          }
          this.repeatFlag = false;
          PatientList.updatePhysicalInfo({
            hzxxId: this.modifyId,
            adminId: sessionStorage.getItem("userId"),
            icd: this.queryModify.physicalName, // 速成测试是
            orderTime: initDateTime
          })
            .then(res => {
              console.log(res.message)
              if (res.code == 0) {
                this.$message.success(res.message);
                this.isModify = false;
                this.list();
                this.repeatFlag = true;
              }else{
                this.$message.error(res.message);
              }
            })
            .catch(res => {
              var resDate = res+""
              this.repeatFlag = true;
              this.$message.error(resDate);
            });
        }
      });
    },

    /**
     * 关闭弹窗
     **/
    closeAction(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm = {
        khxm: "", // 客户姓名
        khxb: "", // 客户性别
        lxsj: "", // 联系手机
        sfzh: "", // 身份证号
        tjtcbh: "", // 体检套餐编号
        tjtcmc: "", // 体检套餐名称
        vip: "", // 1表示是VIP   0表示不是
        age: "", // 年龄
        iccvd: "",
        csrq: "",
        yytjrq: "" // 预约体检时间
      };
    },
    /**
     * 体检套餐搜素
     **/
    selectAction(val) {
      this.ruleForm.tjtcbh = val.split(",")[0];
      this.ruleForm.tjtcmc = val.split(",")[1];
    },
    /**
     * 添加患者
     **/
    additionPatients() {
      this.patientsShow = true;
    },
    /**
     * 增加患者
     **/
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (isNaN(this.ruleForm.age)) {
            this.$message.error("年龄请输入数字");
            this.ruleForm.age = "";
            return false;
          }
          if (this.ruleForm.sfzh) {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (!reg.test(this.ruleForm.sfzh)) {
              this.$message.error("请输入正确得身份证号");
              // this.ruleForm.age ='';
              return false;
            }
          }
          if (!this.isRepeat) {
            this.isRepeat = true;
            PatientList.addCustomerList(this.ruleForm)
              .then(res => {
                if (res.code == 0) {
                  this.patientsShow = false;
                  this.list();
                  this.ruleForm = {
                    khxm: "", // 客户姓名
                    khxb: "", // 客户性别
                    lxsj: "", // 联系手机
                    sfzh: "", // 身份证号
                    tjtcbh: "", // 体检套餐编号
                    tjtcmc: "", // 体检套餐名称
                    vip: "", // 1表示是VIP   0表示不是
                    age: "", // 年龄
                    iccvd: "",
                    csrq: "",
                    yytjrq: "" // 预约体检时间
                  };
                } else {
                  this.isRepeat = false;
                  this.$message.error(res.message);
                }
                console.log(res);
                // this.diseaseList = res.data;
              })
              .catch(error => {});
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /** @description
     * 体检中心-体检套餐自动补全搜索
     */
    remoteMethod(query) {
      if (query == "") {
        return false;
      }
      this.diseaseList = [];
      PatientList.autoComplete({
        zjm: query,
        diseaseType: 1
      })
        .then(res => {
          this.diseaseList = res.data;
          this.diseaseListModify = res.data;
        })
        .catch(error => {});
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /**
     * 修改手机号
     **/
    changeNumberAction(scope) {
      console.log(scope);
      this.$prompt("  ", "修改手机号", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入手机号",
        customClass: "careMsgBoxAdd",
        cancelButtonClass: "cancelButtonStyle",
        confirmButtonClass: "confirmButtonStyle"
      }).then(({ value }) => {
        if (!value) {
          this.$message.error("手机号不能为空!");
        } else {
          var myreg = /^1[3|4|5|7|8][0-9]{9}$/g;
          if (!myreg.test(value)) {
            this.$message.error("请填写正确得手机号码!");
          } else {
            PatientList.updateCustomer({
              adminId: sessionStorage.getItem("userId"), // 医生ID
              id: scope.row.id,
              jtdh: value // 家庭电话
            })
              .then(res => {
                if (res.code == 0) {
                  this.list();
                  this.$message({
                    type: "success",
                    message: "修改成功!"
                  });
                } else {
                  this.$message.error(res.message);
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        }
      });
    },

    /*
      *客户档案-体检项目信息
      */
    currentPartientInfo(item) {
      //         this.isNull = false;
      PatientList.clientTotalInspect({
        patientId: this.patientId, //
        date: item,
        clientId: this.clientId
      })
        .then(res => {
          this.loading4 = false;
          if (res.code == 0) {
            console.log(res);
            this.isNull = false;
            this.PhysicalExSet = res.data;
            if (res.data.inspectProjectsVoList.length) {
              this.PhysicalProject = res.data.inspectProjectsVoList[0];
              this.isinspectPlength = true;
            } else {
              this.isinspectPlength = false;
              //              this.isNull = true;
            }
          } else {
            this.isNull = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 点击档案
     **/
    archiveAction(scope) {
      this.scopeID = "";
      this.getPatinetInfo(scope.row.id);
      this.patientId = scope.row.id;
      this.$refs.record.dialogTableVisible = true;
    },
    /**
     * 客户档案-基本信息(刷新特别关注的标签)
     */
    getPatinetInfo(id) {
      this.patientInfo = "";
      PatientList.clientInformation({
        patientId: id, //
        adminId: this.token
      })
        .then(res => {
          if (res.code == 0) {
            this.dialogVisible = true;
            console.log(res.data);
            this.patientInfo = res.data;
            this.jzTime();
          } else {
            this.dialogVisible = false;
            this.$message.error(res.message);
          }
          if (res.data.gzTag) {
            this.isCare = true;
          } else {
            this.isCare = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 选中时间
     **/
    selectDate(val) {
      if (val) {
        const startDate = new Date(val[0]);
        const endDate = new Date(val[1]);
        this.followwaySearch.fromBirthday =
          startDate.getFullYear() +
          "-" +
          (startDate.getMonth() + 1) +
          "-" +
          startDate.getDate();
        this.followwaySearch.endBirthday =
          endDate.getFullYear() +
          "-" +
          (endDate.getMonth() + 1) +
          "-" +
          endDate.getDate();
      } else {
        this.followwaySearch.fromBirthday = "";
        this.followwaySearch.endBirthday = "";
      }
    },
    /*
     *点击就诊时间
     */
    sliderClick(item, index) {
      this.clientId = item.clientId;
      this.currentPartientInfo(item.clientDate); // 客户档案-体检项目信息
    },
    /**
     * 从sessionStorage获取医生id
     * @function getUserId
     * @param {String} userId 获取医生id
     */
    getUserId() {
      this.userId = this.token; // 用户名
    },
    /**
     * 通知方案列表
     * @function list
     * @param {String} adminId 医生Id
     * @param {String} mobile 通知方案名称
     * @param {String} pager 当前页码
     * @param {String} limit 每页显示条数
     */
    list() {
      PatientList.listDate(this.followwaySearch)
        .then(res => {
          if (res.code == 0) {
            this.tableAll = res.data;
            if (this.followwaySearch.pager == 1) {
              this.totalPage1 = res.count;
            }
            this.loading1 = false;
            return false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 分页
     * @function handleCurrentChange
     * @param {String} val 当前页码
     */
    handleCurrentChange(val) {
      this.loading1 = true;
      this.currentPage3 = val;
      this.followwaySearch.pager = val;
      this.list();
    },
    /**
     * 查询
     * @function waySearch
     * @param {String} 1 返回第一页
     */
    waySearch() {
      this.loading1 = true;
      this.followwaySearch.pager = 1;
      this.list();
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
      this.dialogVisible = true;
      this.modelContent = scope.row;
      if (scope.row.ctListCount) {
        this.numberPercent =
          (Number(scope.row.visitCount) - Number(scope.row.ctListCount)) /
          Number(scope.row.visitCount) *
          100;
      } else {
        this.numberPercent = 0;
      }
    },
    /**
     * 客户档案-历史体检日期
     */
    jzTime() {
      PatientList.clientInspectDate({
        patientId: this.patientId
      })
        .then(res => {
          if (res.code == 0) {
            this.isNull = false;
            this.swiperDate = res.data;
            if (res.data[0]) {
              this.zyData = [];
              this.clientId = res.data[0].clientId;
              this.selectNumber = 0;
              this.currentPartientInfo(res.data[0].clientDate);
            }
          } else {
            this.swiperDate = [];
            this.isNull = true;
          }
        })
        .catch(error => {
          this.isNull = true;
          console.log(error);
        });
    },
    /*
     *已处理
     */
    handleislike() {
      if (this.isCare) {
        // 取消关注
        const h = this.$createElement;
        this.$msgbox({
          title: "消息",
          message: h(
            "div",
            {
              style: "text-align:center"
            },
            [
              h(
                "img",
                {
                  attrs: { src: require("../../static/images/animal.png") },
                  style: "width: 60px;height:52px;margin:0 auto;"
                },
                null
              ),
              h("p", null, "确定取消关心吗?")
            ]
          ),
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          customClass: "careMsgBox",
          cancelButtonClass: "cancelButtonStyle",
          confirmButtonClass: "confirmButtonStyle",
          beforeClose: (action, instance, done) => {
            done();
          }
        })
          .then(action => {
            // 取消关注
            PatientList.updateGz({
              diagnoseType: 3,
              adminId: sessionStorage.getItem("userId"), // 医生ID
              patientId: this.patientId, // 患者的id （必填）
              operateType: 0, // (操作类型 1:关注 0：取消关注) （必填）
              operateTag: "" // 关注的标签
            })
              .then(res => {
                if (res.code == 0) {
                  //                this.isCare = false
                  this.getPatinetInfo(this.patientId);
                  //                this.patientInfo.GzTag = ''
                } else {
                  this.$message.error(res.message);
                }
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(() => {});
      } else {
        // 增加关注
        this.$prompt("  ", "添加标签", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: "请输入标签",
          customClass: "careMsgBoxAdd",
          cancelButtonClass: "cancelButtonStyle",
          confirmButtonClass: "confirmButtonStyle"
        })
          .then(({ value }) => {
            if (!value) {
              this.$message.error("标签不能为空!");
            } else if (value.toString().length < 6) {
              PatientList.updateGz({
                diagnoseType: 3,
                adminId: this.token, // 医生ID
                patientId: this.patientId, // 患者的id （必填）
                operateType: 1, // (操作类型 1:关注 0：取消关注) （必填）
                operateTag: value // 关注的标签
              })
                .then(res => {
                  if (res.code == 0) {
                    this.$message({
                      type: "success",
                      message: "关注成功!"
                    });
                    this.getPatinetInfo(this.patientId);
                    //                  this.getPatinetInfo()
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            } else {
              this.$message.error("标签长度不能大于5!");
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../styles/common";
@import "../../styles/base";
.physicalName {
  .el-form-item__label {
    width: 104px;
  }
}
.btn-public {
  height: 28px;
  width: 56px;
  padding: 0;
  font-size: 13px;
  background: #1899ff;
}
</style>
