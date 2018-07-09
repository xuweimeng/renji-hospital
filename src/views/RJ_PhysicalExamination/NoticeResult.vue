<template>
  <div class="app-container">
  <div class="followplan">
    <!-- 搜索 -->
    <el-row class="mdNoticeRtRow">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-col :span="24"  class="searchRow1">
          <el-col :span="6" style="float:left">
            <el-form-item label="姓名" class="inputLength">
                <el-input v-model.trim="searchParams.brxm" clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="float:left">
            <el-form-item label="联系方式" class="inputLength">
              <el-input v-model.trim="searchParams.mobile" clearable placeholder="请输入联系方式"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="float:left">
            <el-form-item label="身份证号" class="inputLength">
              <el-input v-model.trim="searchParams.sfzh" clearable placeholder="请输入身份证号"></el-input>
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
        </el-col>
        <el-col :span="24"  class="searchRow2">
          <el-col :span="8" style="float:left">
          <el-form-item label="通知时间" class="inputLength">
            <el-date-picker
              @change="selectDate"
              v-model="endBirthday"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              popper-class="mdRtDate"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </el-form-item>
          </el-col>
          <el-col :span="4" style="float:left">
          <el-form-item label="是否本人" class="seclectLength">
            <el-select v-model="searchParams.isMySelf" placeholder="请选择" popper-class="mdRtSelect">
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="6" style="float:left">
          <el-form-item label="通话状态" class="seclectLength">
            <el-select v-model="searchParams.backStatus" placeholder="请选择" popper-class="mdRtSelect">
              <el-option label="全部" value=""></el-option>
              <el-option label="呼叫失败" value="1"></el-option>
              <el-option label="正常通话" value="2"></el-option>
              <el-option label="通话中" value="3"></el-option>
              <el-option label="关停机" value="4"></el-option>
              <el-option label="无人接听" value="5"></el-option>
              <el-option label="空号" value="6"></el-option>
              <el-option label="号码有误" value="7"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="6" style="float:left">
          <el-form-item label="是否到场" class="seclectLength">
            <el-select v-model="searchParams.isCome" placeholder="请选择" popper-class="mdRtSelect">
              <el-option label="全部" value=""></el-option>
              <el-option label="来" value="1"></el-option>
              <el-option label="不来" value="0"></el-option>
              <el-option label="改约" value="2"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="4" style="float:left">
            <el-form-item style="float:left;height: 44px">
              <el-button type="primary" @click.native="waySearch">查询</el-button>
            </el-form-item>
          </el-col>
        </el-col>
      </el-form>
    </el-row>
    <!--活动通知 -->
    <el-row class="mdRt">
      <el-col :span="24">
        <el-table :data="tableData" border style="margin-bottom: 10px" ref="patientlist" class="mdRtTable" v-loading="loading1">
          <el-table-column prop="brxm" label="姓名" align="center">
          </el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center">
          </el-table-column>
          <el-table-column prop="sfzh" label="身份证号" align="center">
          </el-table-column>
          <el-table-column prop="icdName" label="体检套餐" align="center">
          </el-table-column>
          <el-table-column prop="orderTime" label="预约时间" align="center">
          </el-table-column>
          <el-table-column prop="dateEnd" label="通知时间" align="center">
          </el-table-column>
          <el-table-column prop="vetRemark" label="通知结果" align="center">
          </el-table-column>
          <el-table-column prop="statusStr" label="通知状态" align="center">
          </el-table-column>
          <el-table-column prop="backStatusStr" label="通话状态" align="center">
          </el-table-column>
          <el-table-column prop="isMySelfDge" label="是否本人" align="center">
          </el-table-column>
          <el-table-column prop="isComeDge" label="是否到场" align="center">
          </el-table-column>
          <el-table-column label="操作" width="140" align="center">
            <template slot-scope="scope">
              <el-button type="primary"  @click="detailBtn(scope)" class="operationBtn">详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-row class="block" style="height: auto">
          <el-col :span="14" :offset="10">
            <el-pagination  @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total,prev, pager, next, jumper"
                            :total="totalPage" v-if="totalPage>9">
            </el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!--随访结果详情-->
    <!-- 内层弹框 -->
    <el-dialog width="650px" title="体检结果详情" :visible.sync="dialogWay" top="30px" :center = "false"  custom-class="sfDialog">
      <el-row class="waymodel">
        <el-col :span="24">
          <div class="content" slot>
            <!-- 个人信息 -->
            <el-row class="personInfo">
              <!--&lt;!&ndash; 姓名/年龄/性别/关注内容 &ndash;&gt;-->
              <el-col :span="12" class="elCol1">
                <span class="personName colororigen" v-if="patientInfo">{{patientInfo.brxm}}</span>
                <span class="personSex colororigen" v-if="patientInfo">{{patientInfo.brxb}} / {{patientInfo.brage}}</span>
                <span class="personXg" v-if="gztag">{{gztag}}</span>
              </el-col>
              <!--&lt;!&ndash; 已处理 &ndash;&gt;-->
              <el-col :span="12" class="elCol2">
                <el-button type="text"  @click="handleislike" v-bind:class="{ careColor: isCare}">
                  <i class="iconfont" v-bind:class="{ careColor: isCare}" style="margin-right:5px; font-size:12px;">&#xe604;</i>
                  {{isCare?'取消关心':'特别关心'}}
                </el-button>
              </el-col>
            </el-row>
            <el-row class="personResult">
              <el-col :span="12" class="elCol3"><span class="elCol3Span1">体检套餐&nbsp;:&nbsp;</span><span class="elCol3Span2">{{patientInfo.icdName?patientInfo.icdName:"无"}}</span></el-col>
              <el-col :span="12" class="elCol4 colororigen" style="font-size: 13px;"></el-col>
            </el-row>
            <el-row class="personResult">
              <el-col :span="12" class="elCol3" v-if="patientInfo.mobile"><span class="elCol3Span1">手机号码&nbsp;:&nbsp;</span><span class="elCol3Span2">{{patientInfo.mobile}}</span></el-col>
              <el-col :span="12" class="elCol3"></el-col>
            </el-row>
            <!--<el-row class="personResult">-->
            <!--<el-col :span="12" class="elCol3"><span class="elCol3Span1">身份证号&nbsp;:&nbsp;</span><span class="elCol3Span2">{{patientInfo.znjqrHzxx.sfzh}}</span></el-col>-->
            <!--<el-col :span="12" class="elCol3"></el-col>-->
            <!--</el-row>-->
            <!--  处理意见 -->
            <!--<el-row class="resolveBtn">-->
            <!--<el-col :span="4" style="text-align:left;color:#000;"><span>处理意见&nbsp;:&nbsp;</span></el-col>-->
            <!--<el-col :span="7"><el-button round id="updateDiseaseInfo1" class="updateDiseaseInfo" @click="resolveBTN">暂不处理<i class="el-icon-check"></i></el-button></el-col>-->
            <!--<el-col :span="7"><el-button round id="updateDiseaseInfo2" class="updateDiseaseInfo" @click="resolveBTN">病情稳定<i class="el-icon-check"></i></el-button></el-col>-->
            <!--<el-col :span="6"><el-button round id="updateDiseaseInfo3" class="updateDiseaseInfo" @click="resolveBTN">通知就诊<i class="el-icon-check"></i></el-button></el-col>-->
            <!--</el-row>-->
            <!-- 随访结果 -->
            <el-row class="resultNumber">
              <el-col :span="4" class="elCol5">随访结果&nbsp;:&nbsp;</el-col>
              <el-col :span="16" class="elCol6"><div></div></el-col>
              <!--<el-col :span="4" class="elCol7">-->
              <!--<el-select v-model="selectNumber" placeholder="请选择" @change="numberChange">-->
              <!--<el-option v-for="item,index in selecOptions" :key="index+1" :label="item.label" :value="item.value"></el-option>-->
              <!--</el-select>-->
              <!--</el-col>-->
            </el-row>
            <el-row class="targetResult" >
              <!-- 指标详情 -->
              <el-row class="targetDetails" style="margin-bottom: 10px;">
                <!--<div-->
                <!--v-for="(item, index) in modelData"-->
                <!--:key="index+2"-->
                <!--style="display:inline-block;height:20px;line-height:20px;margin-bottom:10px;float:left;padding-right: 20px;">-->
                <!--<span v-if="item.fieldName">{{item.fieldName}}&nbsp;:&nbsp;</span>-->
                <!--<el-tag :type="item.isNum" v-if="item.fieldValue" style="height:20px;line-height: 18px;margin-top:10px;">{{item.fieldValue==''?'无':item.fieldValue}}-->
                <!--</el-tag>-->
                <!--</div>-->
                <div
                  v-if="dataTail.isMySelfDge"
                  style="display:inline-block;height:20px;line-height:20px;margin-bottom:10px;float:left;padding-right: 20px;">
                  <span >是否本人&nbsp;:&nbsp;</span>
                  <el-tag  style="height:20px;line-height: 18px;margin-top:10px;">{{dataTail.isMySelfDge}}
                  </el-tag>
                </div>
                <div
                  v-if="dataTail.isComeDge"
                  style="display:inline-block;height:20px;line-height:20px;margin-bottom:10px;float:left;padding-right: 20px;">
                  <span >是否到场&nbsp;:&nbsp;</span>
                  <el-tag  style="height:20px;line-height: 18px;margin-top:10px;">{{dataTail.isComeDge}}
                  </el-tag>
                </div>
                <el-row v-if="!dataTail.isComeDge&&!dataTail.isMySelfDge">
                  <el-col :span="12" style="height: 250px;line-height:286px;text-align:right;"><img src="../../assets/images/animal.png" style="margin-right:20px;" alt=""></el-col>
                  <el-col :span="12" style="height: 250px;line-height:250px;text-align:left;"><span>这个病人没有随访指标哦...</span></el-col>
                </el-row>
              </el-row>
              <el-row v-if="dataTail.isComeDge||dataTail.isMySelfDge">
                <div style="text-align: left;margin-bottom: 10px;" >审核意见： <span >{{patientInfo.vetRemark}}</span></div>
                <div style="text-align: left;" v-if="patientInfo.isArtificialCall==1">人工外呼：<span style="">{{patientInfo.callRemark}}</span></div>
              </el-row>
              <!-- 指标tab -->
              <!--<el-row class="targetEcharts" style="background:#f9f9f9;">-->
              <!--<el-col :span="24">-->
              <!--<el-tabs v-model="activeName1" @tab-click="handleClick1" style="height: 200px;">-->
              <!--<el-tab-pane v-for="(item, index) in targetTab" :name="'a'+index" :label="item" :key="index+2">-->
              <!--<div :id="'a'+index" style="width:485px;height:200px;"></div>-->
              <!--<el-row v-if="!yChart.length" style="height: 200px;">-->
              <!--<el-col :span="12" style="height: 250px;line-height:203px;text-align:right;"><img src="../../assets/images/animal.png" style="margin-right:20px;" alt=""></el-col>-->
              <!--<el-col :span="12" style="height: 250px;line-height:160px;text-align:left;"><span>这个病人没有随访指标哦...</span></el-col>-->
              <!--</el-row>-->
              <!--</el-tab-pane>-->
              <!--</el-tabs>-->
              <!--</el-col>-->
              <!--</el-row>-->
            </el-row>
            <!-- 随访问题语音 -->
            <el-row class="resultVoice">
              <el-col :span="24" class="elCol18">
                <el-collapse :accordion="true" value="1">
                  <el-collapse-item name="1">
                    <template slot="title">
                      <el-row>
                        <el-col :span="4" style="text-align:left;">
                          <div class="collapseTitle">记录详情&nbsp;:&nbsp;</div>
                        </el-col>
                        <el-col :span="16"style="border-bottom:1px dotted #ebebeb;margin-top:24px;">
                          <div tsyle="height:1px;background:#f00; " class="line"></div>
                        </el-col>
                      </el-row>
                    </template>
                    <el-row v-if="patientInfo.isArtificialCall==1" style="padding-top:10px;padding-bottom:10px;text-align: left;font-weight: bold" ><span>人工外呼</span></el-row>
                    <el-row v-if="!modelData.length" style="padding-top:20px;"><span>这个病人没有语音记录哦...</span></el-row>
                    <el-row class="voiceRow" v-for="item in modelData" :key="item.id" v-if="modelData.length">
                      <el-col :span="24" class="aiyuyin">
                        <div class="ai" style="text-align: center;">AI</div>
                        <div class="aiWords" style="line-height: 40px;">
                          <span>{{item.question}}</span>
                          <div class="arrows"></div>
                        </div>
                      </el-col>
                      <el-col :span="24" class="hzyuyin">
                        <div class="hzhead" style="text-align: center;">客户</div>
                        <div class="hzWords">
                          <audio :src="urlAddress+item.audio" controls="controls" style="margin-top: 7px;"></audio>
                          <div class="arrows1"></div>
                        </div>
                      </el-col>
                      <el-col :span="24" class="hzms" >( 指标：{{item.isNormal?'正常':'不正常'}} /  {{item.fieldName}} : {{item.fieldValue}} )</el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </el-col>
            </el-row>
            <!-- div分割线 -->
          </div>
          <!-- </el-dialog> -->
        </el-col>
      </el-row>
    </el-dialog>
  </div>
  </div>
</template>

<script>
  import { NoticeResult } from '../../api/RJ_PhysicalExamination/NoticeResult'; // 引入 api

  /**
   * 随访计划
   * @module followParam
   */
//  import { API } from "@/serve";
  export default {
    data() {
      return {
        y: 1,
        urlAddress: '',
        dataTail: {},
        patientInfo: {},
        isCare: false, // 点击记录后，查看病人是否被关注
        dialogWay: false,
        diseaseList: [], /* 疾病列表 */
        modelData: [],
        loading1: true,
        resultDg: false, // 详情弹窗
        createTime: '', // 创建时间
        currentPage: 1, // 当前页
        totalPage: 2000, // 总页数
        endBirthday: '',
        gztag: '',
        /* 搜索条件 */
        searchParams: {
          backStatus: '',
          adminId: sessionStorage.getItem('userId'),
          sfzh: '',
          pager: 1, // 当前页码
          limit: 10, // 每页条数
          brxm: '', // 患者姓名（可选）
          dateBeginBegin: null, // 预约开始时间（可选）
          dateBeginEnd: null, // 预约结束时间（可选）
          activeType: 5, // 0，随访；1，通知，2，临时随访；3，是出院随访;4入院通知；5体检
          mobile: null, // 联系方式
          isMySelf: '', // 是否本人（1：是，0：否）
          isCome: '', // 是否过来入院（0：不来，1：来，2：改约）
          icd: '' // 体检套餐名称id
        },
        input10: '',
        activeName: 'first', // tab
        tableData: [],
        dataLoading: false, // 表格数据请求等待;
        checkoptions: [
          {
            value: '',
            label: '请选择'
          },
          {
            // 审核不通过options
            value: '1',
            label: '患者已死亡'
          },
          {
            value: '2',
            label: '患者不接受随访'
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
        selectCheck: '', // 选中的审核不通过
        checkId: [], // 随访通过的id(多选时),
        noCheck: false // 审核不通过弹框
      };
    },

    mounted() {
      this.endBirthday = [this.getCurrent(), this.getCurrent()];
      this.searchParams.dateEndBegin = this.getCurrent() + ' 00:00:00';
      this.searchParams.dateEndEnd = this.getCurrent() + ' 23:59:59';
      this.getData();
    },
    methods: {
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
       * 选中时间
       **/
      selectDate(val) {
        if (val) {
          const startDate = new Date(val[0]);
          const endDate = new Date(val[1]);
          this.searchParams.dateEndBegin = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate() + ' 00:00:00';
          this.searchParams.dateEndEnd = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate() + ' 23:59:59';
        } else {
          this.searchParams.dateEndBegin = '';
          this.searchParams.dateEndEnd = '';
        }
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
              'div',
              {
                style: 'text-align:center'
              },
              [
                h(
                  'img',
                  {
                  //                    attrs: { src: require("../../../static/images/animal.png") },
                    style: 'width: 60px;height:52px;margin:0 auto;'
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
              // 取消关注
              NoticeResult
                .updateGz({
                  diagnoseType: 3,
                  adminId: sessionStorage.getItem('userId'),
                  patientId: this.patientId, // 患者的id （必填）
                  operateType: 0, // (操作类型 1:关注 0：取消关注) （必填）
                  operateTag: '' // 关注的标签
                })
                .then(res => {
                  if (res.code == 0) {
                    this.gztag = '';
                    this.isCare = false;
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
                NoticeResult
                  .updateGz({
                    diagnoseType: 3,
                    adminId: sessionStorage.getItem('userId'),
                    patientId: this.patientId, // 患者的id （必填）
                    operateType: 1, // (操作类型 1:关注 0：取消关注) （必填）
                    operateTag: value // 关注的标签
                  })
                  .then(res => {
                    if (res.code == 0) {
                      this.isCare = true;
                      this.gztag = value;
                      this.$message({
                        type: 'success',
                        message: '关注成功!'
                      });
                    //                    this.showInfo(this.scope);
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
                type: 'info',
                message: '取消输入'
              });
            });
        }
      },
      /** 详情 */
      detailBtn(scope) {
        this.dataTail = scope.row;
        this.patientId = scope.row.hzxxId;
        this.detailView(scope);
      },
      detailView(scope) {
        NoticeResult.getPatientRecord({
          id: scope.row.id,
          //         id:"03a5832e-f835-11e7-b52b-6cae8b369de2",
          adminId: sessionStorage.getItem('userId')
        }).then(res => {
          if (res.code == 0) {
            this.dialogWay = true;
            if (res.islike) {
              this.isCare = true;
            } else {
              this.isCare = false;
            }
            this.gztag = res.gztag;
            if (res.data) {
              this.patientInfo = res.data;
            }
            this.urlAddress = res.AIVOICURL;
            if (res.data) {
              console.log(111111);
              if (res.data.orderReplyQuestions.length) {
                this.modelData = res.data.orderReplyQuestions;
              } else {
                this.modelData = [];
              }
            }
          } else {
            this.$message.error(res.message);
          }
        });
      },
      /** 监听弹窗子组件的关闭动作 */
      closeChildren(val) {
        this.resultDg = val;
      },
      /**
       * 点击查询
       **/
      waySearch() {
        console.log(this.searchParams.icd);
        this.loading1 = true;
        this.searchParams.pager = 1;
        this.getData(); // 获取数据
      },
      /** @description
       * 体检中心-体检套餐自动补全搜索
       */
      remoteMethod(query) {
        if (query == '') {
          return false;
        }
        this.diseaseList = [];
        NoticeResult.autoComplete({
          zjm: query,
          diseaseType: 1
        })
          .then(res => {
          //            this.value9 = res.data;
            this.diseaseList = res.data;
          })
          .catch(error => {});
      },
      /* 获取数据 */
      getData() {
        NoticeResult.resultList(this.searchParams).then(res => {
          if (res.data) {
            for (const item of res.data) {
              switch (item.isCome) {
                case 0:
                  item.isComeDge = '不来';
                  break;
                case 1:
                  item.isComeDge = '来';
                  break;
                case 2:
                  item.isComeDge = '改约';
                  break;
                case -1:
                  item.isComeDge = '';
                  break;
              }
              switch (item.isMySelf) {
                case 1:
                  item.isMySelfDge = '是';
                  break;
                case 0:
                  item.isMySelfDge = '否';
                  break;
                case -1:
                  item.isMySelfDge = '';
                  break;
              }
            }
            this.loading1 = false;
            this.tableData = res.data;
            this.totalPage = res.total;
          } else {
            this.tableData = [];
            this.totalPage = 0;
          }
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
      /**
       *弹框点击不通过确定
       *@function noothroughCkeck
       *@description 点击表格操作弹框不通过
       */
      noothroughCkeck() {
        const id = this.checkId.join(',');
        this.handleCheck(1, 2, id, this.selectCheck);
        this.dialogVisible = false;
        this.list(this.currentPage);
        this.list1(this.currentPage1);
      },
      /**
       *审核功能
       *@function handleCheck
       * @description 审核功能均调用这一个函数
       * @param {String} adminId 医生id
       * @param {String} operateType 通过(1：不通过 2：通过)
       * @param {String} isAll 是否全部提交(1:是 2：否)
       *@param {String} ids 患者id集合,数组转字符串
       *@param {String} noPassReason 审核不通过原因
       */
      handleCheck(operateType, isAll, ids, noPassReason) {
        NoticeResult
          .editVisitProjectStatus({
            adminId: this.userId,
            operateType: operateType,
            isAll: isAll,
            ids: ids,
            noPassReason: noPassReason
          })
          .then(res => {
            if (res.code == 0) {
              this.$message({
                message: '操作已完成',
                type: 'success'
              });
              this.list(this.currentPage);
              this.list1(this.currentPage1);
              this.noCheck = false;
            }
          })
          .catch(error => {});
      },
      /**
       * 分页
       * @function handleCurrentChange
       * @param {String} val 当前页码
       * @description this.tabActive = 0//全部患者=1特别关心
       */
      handleCurrentChange(page) {
        this.loading1 = true;
        this.dataLoading = true;
        this.searchParams.pager = page;
        this.getData();
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
      }
    }
  };
</script>
<style lang="scss">
  @import "../../styles/common";
  @import "../../styles/base";
</style>
