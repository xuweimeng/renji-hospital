<template>
  <div class="app-container">
    <div class="mdNotice">
      <!-- 搜索 -->
      <el-row class="mdNoticeRow">
        <el-col :span="24">
          <el-form :inline="true" :model="searchParams" class="demo-form-inline">
            <el-col :span="6" style="float:left">
                <el-form-item label="姓名" class="inputLength">
                  <el-input v-model.trim="searchParams.brxm" clearable placeholder="请输入姓名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6" style="float:left">
              <el-form-item label="联系方式" class="inputLength">
                <el-input v-model.trim="searchParams.mobile" clearable placeholder="请输入联系方式" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="float:left">
            <el-form-item label="证件号" class="inputLength">
              <el-input v-model.trim="searchParams.sfzh" clearable placeholder="请输入证件号"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="6" style="float:left">
            <el-form-item label="通知方案" class="inputLength">
              <el-input v-model.trim="searchParams.schemeName" clearable placeholder="请输入通知方案"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="6" style="float:left">
            <el-form-item label="体检套餐" class="inputLength" >
              <el-select
                v-model="searchParams.icd"
                filterable
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
                  :value="item.icd">
                </el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="4" style="float:left">
              <el-form-item>
                <el-button type="primary" @click="getDataAction">查询</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <!-- tab切换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick" class="mdTabs" >
        <el-tab-pane label="体检通知" name="first" v-loading="loading2">
          <el-table
            border
            @selection-change="selectChange"
            :data="tableData"
            style="width: 100%"
            class="mdTable">
            <el-table-column type="selection"  width="55" align="center"></el-table-column>
            <el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
            <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
            <el-table-column prop="sfzh" label="证件号" align="center"></el-table-column>
            <el-table-column prop="schemeName" label="通知方案" align="center"></el-table-column>
            <el-table-column prop="icdName" label="体检套餐" align="center"></el-table-column>
            <el-table-column prop="orderTime" label="预约时间" align="center"></el-table-column>
            <el-table-column prop="visitStartTime" label="通知开始时间" align="center"></el-table-column>
            <el-table-column label="详情" align="center" width="140">
              <template slot-scope="scope">
                <el-button style="height:22px;width:52px;padding:0;margin:0;background:#409EFF;font-size
              :13px;color:white;" @click="showInfo(scope)">详情</el-button>
                <el-button style="height:22px;width:52px;padding:0;margin:0;font-size
              :13px;" @click="passoutBtn(scope.row.id)" v-if="scope.row.isComplete==0">终止</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row v-if="tableData.length" style="margin-bottom: 20px;">
            <!-- 批量通过 -->
            <el-col :span="10">
              <div class="checkPiliang">
                <!--<el-button @click="toggleSelection(tableData)">全选</el-button>-->
                <el-button  @click="numCheck">批量终止</el-button>
              </div>
            </el-col>
            <!-- 分页 -->
            <el-col :span="14">
              <div class="block" style="margin-top: 11px;">
                <el-pagination  @current-change="handleCurrentChange" :current-page.sync="searchParams.pager" :page-size="10" layout="total,prev, pager, next, jumper"
                                :total="totalPage" v-if="totalPage>=10">
                </el-pagination>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="终止通知" name="second">
          <el-table
            :data="noPassdata"
            style="width: 100%"
            v-loading="loading3"
            class="mdTable">
            <el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
            <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
            <el-table-column prop="sfzh" label="证件号" align="center"></el-table-column>
            <el-table-column prop="schemeName" label="通知方案" align="center"></el-table-column>
            <el-table-column prop="icdName" label="体检套餐" align="center"></el-table-column>
            <el-table-column prop="orderTime" label="预约时间" align="center"></el-table-column>
            <el-table-column prop="visitStartTime" label="通知开始时间" align="center"></el-table-column>
            <el-table-column label="详情" align="center" width="140">
              <template slot-scope="scope">
                <el-button style="height:22px;width:52px;padding:0;margin:0;font-size
              :13px; background:#409EFF;color: white; " @click="showInfo(scope)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="14" style="float: right;margin-right: 20px;margin-bottom: 30px;">
            <div class="block" style="margin-top: 11px;">
              <el-pagination  @current-change="pageChange"

                              :current-page.sync="nosearchParams.pager"
                              :page-size="10"
                              layout="total,prev, pager, next, jumper"
                              :total="noTotalPage"
                              v-if="noTotalPage>=10">
              </el-pagination>
            </div>
          </el-col>
        </el-tab-pane>
      </el-tabs>

      <!-- 审核不通过 -->
      <el-dialog title="审核不通过原因" :visible.sync="noCheck" width="350px" :center = "false" custom-class="checknoPass" @close="closeAction">
        <el-row slot>
          <el-col :span="24" >
            <el-select v-model="selectCheck" placeholder="请选择" @change="changeSelect" popper-class="selectOut">
              <el-option  v-for="item in checkoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col
            :span="24"
            class="btnCheck"
            style="margin-top:28px;"
          >
            <el-button type="primary"  @click.native="noothroughCkeck">确定</el-button>
            <el-button type="info" @click="noCheck=false;selectCheck=''">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <!-- 弹框 -->
      <el-dialog title="就诊档案" :visible.sync="infoShow" width="525px" top="30px" :center = "false" custom-class="hzDialog">
        <!-- 外层弹框 -->
        <div class="content" slot>
          <!-- 个人信息 -->
          <el-row class="personInfo">
            <el-col :span="12" class="elCol1"><span class="personName colororigen" v-if="patientInfo">{{patientInfo.brxm}}</span><span class="personSex colororigen" v-if="patientInfo">{{patientInfo.name}} / {{patientInfo.sex}}&nbsp;&nbsp;&nbsp;</span>   <span class="personXg" v-if="patientInfo">{{patientInfo.birthday}} {{patientInfo.gzTag}}</span></el-col>
            <el-col :span="12" class="elCol2">
              <el-button type="text" @click="handleislike" v-bind:class="{ careColor: isCare}">
                <i class="iconfont" v-bind:class="{ careColor:patientInfo.gz}" style="margin-right:5px; font-size:12px;">&#xe604;</i>
                {{patientInfo.gz?'取消关心':'特别关心'}}
              </el-button>
            </el-col>
          </el-row>
          <el-row class="personResult">
            <!--<el-col :span="24" class="elCol3">-->
            <!--<span class="elCol3Span1">{{patientInfo.name}}</span>-->
            <!--<span class="elCol3Span2">{{patientInfo.sex}}/{{patientInfo.birthday}}</span>-->
            <!--</el-col>-->
          </el-row>
          <el-row class="personResult">
            <el-col :span="24" class="elCol3">
              <span class="elCol3Span1">体检套餐&nbsp;:&nbsp;</span>
              <span class="elCol3Span2">{{patientInfo.icdName}}</span>
            </el-col>
          </el-row>
          <el-row class="personResult">
            <el-col :span="24" class="elCol3">
              <span class="elCol3Span1">手机号码&nbsp;:&nbsp;</span>
              <span class="elCol3Span2">{{patientInfo.mobile}}</span>
            </el-col>
          </el-row>
          <el-row class="personResult">
            <el-col :span="24" class="elCol3">
              <span class="elCol3Span1">证件号码&nbsp;:&nbsp;</span>
              <span class="elCol3Span2">{{znjqrHzxx.sfzh?znjqrHzxx.sfzh:'无'}}</span>
            </el-col>
          </el-row>
          <!--<el-row class="personResult">-->
          <!--<el-col :span="24" class="elCol3">-->
          <!--<span class="elCol3Span1">是否是vip&nbsp;:&nbsp;</span>-->
          <!--<span class="elCol3Span2">{{patientInfo.clientType?patientInfo.clientType:"否"}}</span>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <el-row class="personResult">
            <el-col :span="24" class="elCol3">
              <span class="elCol3Span1">预约时间&nbsp;:&nbsp;</span>
              <span class="elCol3Span2">{{patientInfo.orderTime?patientInfo.orderTime:"无"}}</span>
            </el-col>
          </el-row>
          <!-- 患者就诊信息 -->
          <el-row class="visitRecords" style="padding-top:10px">
            <el-row class="personResult">
              <el-col :span="24" class="elCol3">
                <span class="elCol3Span1">通知方案&nbsp;:&nbsp;</span>
                <span class="elCol3Span2">{{patientInfo.schemeName}}</span>
              </el-col>
            </el-row>
            <el-row class="personResult">
              <el-col :span="24" class="elCol3">
                <span class="elCol3Span1">通知次数&nbsp;:&nbsp;</span>
                <span class="elCol3Span2">总共{{patientInfo.totalNum}}次</span>
              </el-col>
            </el-row>
            <!--<el-row class="personResult">-->
            <!--<el-col :span="24" class="elCol3">-->
            <!--<span class="elCol3Span1">开始通知时间&nbsp;:&nbsp;</span>-->
            <!--<span class="elCol3Span2">{{patientInfo.dateBegin}}</span>-->
            <!--</el-col>-->
            <!--</el-row>-->
            <el-row class="personResult" v-for="(item,index) in ordersList" :key="item.id" style="margin-bottom: 15px;">
              <el-col :span="24" class="elCol3">
                <span class="elCol3Span1">第{{index+1}}次通知：开始通知时间&nbsp;:&nbsp;</span>
                <span class="elCol3Span2">{{item.dateEnd?item.dateEnd:"无"}}</span>
              </el-col>
              <el-col :span="24" class="elCol3">
                <span class="elCol3Span1" style="color:#409EFF">{{item.CollectionIndex}}</span>
              </el-col>
            </el-row>
          </el-row>
        </div>
        <!-- 内层弹框 -->
      </el-dialog>
    </div>


  </div>
</template>
<script>
  import { NoticePlan } from '../../api/RJ_PhysicalExamination/NoticePlan';     // 引入 api
  export default {
    data() {
      return {
        loading2: true,
        loading3: true,
        isCare: false, // 点击记录后，查看病人是否被关注
        currentPage: 1,
        patientInfo: {}, // 记录个人信息
        znjqrHzxx: {},
        dataRecord: 0,
        value9: [],
        recordFlag: 1, // 1.代表终止 2.代表批量终止
        isTerminate: 1, // 1代表体检通知  2.代表通知
        dataList: [],
        ordersList: [], // 采集指标
        searchParams: {
          adminId: sessionStorage.getItem('userId'),
          pager: 1, // 当前页码
          limit: 10, // 每页条数
          brxm: '', // 患者姓名（可选）
          mobile: null, // ；联系方式（可选）
          icd: '', // 体检套餐名称id
          sfzh: '', // 身份证号
          schemeName: '',
          activeType: 5
        },
        nosearchParams: {
          adminId: sessionStorage.getItem('userId'),
          pager: 1, // 当前页码
          limit: 10, // 每页条数
          brxm: '', // 患者姓名（可选）
          mobile: '', // ；联系方式（可选）
          icd: '', // 体检套餐名称id
          sfzh: '', // 身份证号
          schemeName: '',
          activeType: 5
        },
        noTotalPage: 0,
        totalPage: 0, // 总页数
        activeName: 'first', // tab
        tableData: [],
        noPassdata: [],
        diseaseList: [] /* 疾病列表 */,
        checkoptions: [
          {
            value: '',
            label: "请选择"
          },
          {
            // 审核不通过options
            value: '1',
            label: '客户已死亡'
          },
          {
            value: '2',
            label: '客户不接受随访'
          },
          {
            value: '3',
            label: '随访方案重复'
          },
          {
            value: '4',
            label: '方案不匹配'
          }
        ],
        infoShow: false /* 通知计划详情显示 */,
        infoParams: {
          znjqrHzxx: {
            brxm: ''
          }
        },
        selectCheck: '', // 选中的审核不通过
        checkId: [], // 随访通过的id(多选时),
        noCheck: false // 审核不通过弹框
      };
    },
    mounted() {
      this.getData();
    },
    methods: {
      closeAction() {
        this.selectCheck = '';
      },
      /**
       * 点击查询
       **/
      getDataAction() {
        // dataRecord 1.代表终止通知 0.代表体检通知
        if (!this.dataRecord) {
          this.loading2 = true;
          this.searchParams.pager = 1;
          this.getData();
        } else {
          this.loading3 = true;
          this.nosearchParams.pager = 1;
          this.pager = 1; // 当前页码
          this.nosearchParams.brxm = this.searchParams.brxm; // 患者姓名（可选）
          this.nosearchParams.mobile = this.searchParams.mobile; // ；联系方式（可选）
          this.nosearchParams.icd = this.searchParams.icd; // 体检套餐名称id
          this.nosearchParams.sfzh = this.searchParams.sfzh; // 身份证号
          this.nosearchParams.schemeName = this.searchParams.schemeName;
          this.getDateNotice();
        }
      },
      /**@description
       * 体检中心-体检套餐自动补全搜索
       */
      remoteMethod(query) {
        if (query == "") {
          return false;
        }
        this.diseaseList = [];
        NoticePlan.autoComplete({
          zjm: query,
          diseaseType: 1
        })
          .then(res => {
            this.diseaseList = res.data;
          })
          .catch(error => {});
      },
      /* 获取体检通知数据 */
      getData() {
        NoticePlan.getPlan(this.searchParams).then(res => {
          if (res.code == 0) {
            this.loading2 = false;
            this.tableData = res.data;
            this.totalPage = res.total;
          } else {
            this.$message.error(res.message);
          }
        });
      },
      /**
       * 终止通知
       **/
      getDateNotice() {
        NoticePlan.zlistDate(this.nosearchParams).then(res => {
          this.noPassdata = res.data;
          this.noTotalPage = res.total;
          this.loading3 = false;
        });
      },

      /* 展示随访计划详情 */
      showInfo(scope) {
        this.scope = scope;
        this.patientId = scope.row.hzxxId;
        NoticePlan.planInfo({
          adminId: sessionStorage.getItem('userId'),
          id: scope.row.id
        }).then(res => {;
          this.infoParams = res.data;
          this.patientInfo = res.data;
          if (res.data.gz) {
            this.isCare = true;
          } else {
            this.isCare = false;
          }
          this.ordersList = res.data.orders; // 采集指标
          if (res.data.znjqrHzxx) {
            this.znjqrHzxx = res.data.znjqrHzxx;
          }
          this.infoShow = true;
        });
      },
      /**
       *审核不通过的原因
       *@function changeSelect
       *@param {String} value 审核不通过的原因
       */
      changeSelect(value) {
        this.selectCheck = value;
      },
      selectChange(selection) {
        this.checkId = selection;
      },
      /**
       *弹框点击不通过确定
       *@function noothroughCkeck
       *@description 点击表格操作弹框不通过
       */
      noothroughCkeck() {
        let ids = [];
        for (let iterator of this.checkId) {
          ids.push(iterator.id);
        }

        if (this.selectCheck) {
          if (this.recordFlag == 1) {
            this.handleCheck(ids, this.selectCheck); //单条终止
          } else {
            this.cancelBatchCancelPlot(ids, this.selectCheck); //批量终止
          }
        } else {
          this.$message.warning('请选择原因');
        }
        /* this.dialogVisible = false; */
      },

      /*
       *已处理
       */
      handleislike() {
        if (this.isCare) {
          // 取消关注
          const h = this.$createElement;
          this.$msgbox({
            title: '消息',
            message: h(
              "div",
              {
                style: 'text-align:center'
              },
              [
                h(
                  'img',
                  {
//                    attrs: { src: require("../../../static/images/animal.png") },
                    style: "width: 60px;height:52px;margin:0 auto;"
                  },
                  null
                ),
                h('p', null, '确定取消关心吗?')
              ]
            ),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'careMsgBox',
            cancelButtonClass: 'cancelButtonStyle',
            confirmButtonClass: 'confirmButtonStyle',
            beforeClose: (action, instance, done) => {
              done();
            }
          })
            .then(action => {
              //取消关注
              NoticePlan
                .updateGz({
                  diagnoseType: 3,
                  adminId: sessionStorage.getItem('userId'),
                  patientId: this.patientId, // 患者的id （必填）
                  operateType: 0, // (操作类型 1:关注 0：取消关注) （必填）
                  operateTag: '' // 关注的标签
                })
                .then(res => {
                  if (res.code == 0) {
                    //                this.isCare = false
                    this.patientInfo.GzTag = '';
                    // 为了防止当第二页删除完得时候 记录得页码还是第二页，需得重新赋值
                    // this.page = Math.ceil((this.totalPagehome - 1) / 4);
                    //                this.SpecialCare();
                    this.showInfo(this.scope);
                    this.dialogVisible = false;
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
          this.$prompt('  ', '添加标签', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入标签',
            customClass: 'careMsgBoxAdd',
            cancelButtonClass: 'cancelButtonStyle',
            confirmButtonClass: 'confirmButtonStyle'
          })
            .then(({ value }) => {
              if (!value) {
                this.$message.error('标签不能为空!');
              } else if (value.toString().length < 6) {
                NoticePlan
                  .updateGz({
                    diagnoseType: 3,
                    adminId: sessionStorage.getItem('userId'),
                    patientId: this.patientId, // 患者的id （必填）
                    operateType: 1, // (操作类型 1:关注 0：取消关注) （必填）
                    operateTag: value // 关注的标签
                  })
                  .then(res => {
                    if (res.code == 0) {
                      //                  this.isCare = true
                      this.$message({
                        type: 'success',
                        message: '关注成功!'
                      });
                      this.showInfo(this.scope);
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  });
              } else {
                this.$message.error('标签长度不能大于5!');
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消输入"
              });
            });
        }
      },

      /**
       *审核功能
       *@function handleCheck
       *@description 审核功能均调用这一个函数
       *@param {String} adminId 医生id
       *@param {String} operateType 通过(1：不通过 2：通过)
       *@param {String} isAll 是否全部提交(1:是 2：否)
       *@param {String} ids 患者id集合,数组转字符串
       *@param {String} noPassReason 审核不通过原因
       */
      handleCheck(ids, notPassReason) {
        NoticePlan.cancelNotice({
          id: ids[0],
          notPassReason: notPassReason,
          notPassRemark: "终止计划"
        })
          .then(res => {
            if (res.code == 0) {
              this.getData();
              this.noCheck = false;

              this.selectCheck='';
            } else {
              this.$message.error(res.mes);
            }
          })
          .catch(error => {});
      },

      cancelBatchCancelPlot(ids, notPassReason) {
        NoticePlan.cancelBatchCancel({
          ids: ids,
          notPassReason: notPassReason,
          notPassRemark: "终止计划"
        })
          .then(res => {
            if (res.code == 0) {
              this.getData();
              this.noCheck = false;
              this.selectCheck='';

            } else {
              this.$message.error(res.mes);
            }
          })
          .catch(error => {});
      },
      /**
       * [handleClick description] 切换tab
       * @param  {[type]} tab   [description]
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
       */
      handleClick(tab, event) {
        switch (tab.index) {
          case "0":
            this.getData();
            this.dataRecord = 0;
            break;
          case "1":
            this.dataRecord = 1;
            this.getDateNotice();
            break;
        }
      },
      /**
       * 分页
       * @function handleCurrentChange
       * @param {String} val 当前页码
       * @description this.tabActive = 0//全部患者=1特别关心
       */
      handleCurrentChange(page) {
        this.searchParams.pager = page;
        this.getData();
      },
      pageChange(page) {
        this.nosearchParams.pager = page;
        this.getDateNotice();
      },
      /**
       *待审核表格全选
       *@function toggleSelection
       *@param {object} rows 选中的行（参见element-ui的table-rows）
       */
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      // 部分通过
      numCheck() {
        if (this.checkId.length == 0) {
          this.$message.warning("请选择所选项");
          return false;
        }
        this.recordFlag = 2;
        this.noCheck = true;
      },
      /**
       * [lang description]表格通过按钮
       * @type {String}
       */
      passoutBtn(id) {
        this.checkId = [
          {
            id: id
          }
        ];
        this.recordFlag = 1;
        this.noCheck = true;
      }
    }
  };

</script>
<style lang="scss">
  @import "../../styles/base";
  @import "../../styles/common";
  .hzDialog .el-dialog__body .content .personInfo .elCol2 .el-button, .daDialog .el-dialog__body .content .personInfo .elCol2 .el-button {
    padding: 5px 7px;
    color: #777;
    background: #fdfdfd;
    border: 1px solid #ffe6de;
  }
  .hzDialog .el-dialog__body .content .personInfo .elCol1, .daDialog .el-dialog__body .content .personInfo .elCol1 {
    line-height: 27px;
    height: 27px;
    text-align: left;
  }
  .colororigen {
    color: #ff602d;
  }
  //特别关注
  .careColor {
    color: #ff7b58;
  }
</style>


