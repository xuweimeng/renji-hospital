<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input v-model.trim="searchParams.brxm" clearable placeholder="请输入姓名" ></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系电话</label>
        <el-input v-model.trim="searchParams.mobile" clearable placeholder="请输入联系方式"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >身份证号</label>
        <el-input v-model.trim="searchParams.sfzh" clearable placeholder="请输入证件号"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >方案名称</label>
        <el-input v-model.trim="searchParams.schemeName" clearable placeholder="请输入通知方案"></el-input>
      </li>
      <li class="common_search_single">
        <el-button type="primary" icon="el-icon-search" @click="getDataAction">查询</el-button>
        <el-button type="success" @click="additionPatients">
          发起肠胃镜通知
        </el-button>
      </li>
    </ul>
    <!-- tab切换 -->
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" class="mdTabs" >
      <el-tab-pane label="肠胃镜通知列表" name="first" v-loading="tableLoading">
        <el-table
          @selection-change="selectChange"
          :data="tableData"
          border fit highlight-current-row
        >
          <el-table-column type="selection"  width="55" align="center"></el-table-column>
          <el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="sfzh" label="身份证号" align="center"></el-table-column>
          <el-table-column prop="schemeName" label="方案名称" align="center"></el-table-column>
          <el-table-column prop="orderTime" label="客户预约时间" align="center"></el-table-column>
          <el-table-column prop="visitStartTime" label="AI通知开始时间" align="center"></el-table-column>
          <el-table-column label="详情" align="center" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showInfo(scope)">详情</el-button>
              <el-button size="mini" type="danger" @click="termination(scope.row.id)" v-if="scope.row.isComplete==0">终止</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="tableData.length" class="pagination-container" style="text-align:right;margin-top:15px;">
          <el-button style='margin-right:10px;float:left' type="warning"   @click="batchTermination" >批量终止</el-button>
          <el-pagination style="display:inline-block" background  @current-change="handleCurrentChange" :current-page="searchParams.pager"  :page-size="searchParams.limit" layout="total,  prev, pager, next, jumper" :total="totalPage">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已终止通知" name="second">
        <el-table
          :data="noPassData"
          border fit highlight-current-row
          v-loading="noPassLoading"
        >
          <el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="sfzh" label="身份证号" align="center"></el-table-column>
          <el-table-column prop="schemeName" label="方案名称" align="center"></el-table-column>
          <el-table-column prop="orderTime" label="客户预约时间" align="center"></el-table-column>
          <el-table-column prop="visitStartTime" label="AI通知开始时间" align="center"></el-table-column>
          <el-table-column prop="dateVet" label="终止时间" align="center"></el-table-column>
          <el-table-column prop="operator" label="终止人" align="center"></el-table-column>
          <el-table-column label="详情" align="center" >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showInfo(scope)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="noPassData.length" class="pagination-container" style="text-align:right;margin-top:15px;">
          <el-pagination style="display:inline-block" background  @current-change="pageChange" :current-page="nosearchParams.pager"  :page-size="nosearchParams.limit" layout="total,  prev, pager, next, jumper" :total="noTotalPage">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 审核不通过 -->
    <el-dialog title="审核不通过原因" :visible.sync="noCheck" width="350px"   @close="cancelSelect">
      <el-row slot>
        <el-col :span="24" style="margin-bottom: 20px;">
          <el-select v-model="selectCheck" placeholder="请选择"  popper-class="selectOut">
            <el-option  v-for="item in checkoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="24" >
          <span>详情</span>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="终止原因详情"
            v-model="notPassRemark">
          </el-input>
        </el-col>
        <el-col
          :span="24"
          class="btnCheck"
          style="margin-top:28px;text-align: center;"
        >
          <el-button type="primary"  @click.native="noothroughCkeck">确定</el-button>
          <el-button type="info" @click="cancelSelect">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 发起肠胃镜通知-->
    <el-dialog title="发起肠胃镜通知" :visible.sync="patientsShow" width="525px" top="30px" :center = "false" custom-class="patientDialog" @close="closeAction('ruleForm')">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="113px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="brxm">
          <!--<el-input v-model="ruleForm.brxm" placeholder="请输入姓名" @change="nameChangeAction"></el-input>-->
          <el-autocomplete
            v-model="ruleForm.brxm"
            :clearable="true"
            :fetch-suggestions="nameChangeAction"
            placeholder="请输入内容"
            style="width: 330px;"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <span v-html="item.name"></span>
            </template>
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="联系电话" prop="jtdh">
          <el-input v-model="ruleForm.jtdh" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" >
          <el-input v-model="ruleForm.sfzh" placeholder="请输入身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="客户类型" prop="isVip">
          <el-select v-model="ruleForm.isVip" placeholder="请选择客户类型" style="float: left">
            <el-option label="VIP" value="1"></el-option>
            <el-option label="普通" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知方案" prop="scheme" >
          <el-select v-model="ruleForm.scheme" placeholder="请选择客户类型" style="float: left ;width:370px" @change="schemeAction">
            <el-option  v-for="item,index in questionschemeDate" :key ="index" :label="item.name" :value="item.id + ','+item.name"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="性别" >
          <el-select v-model="ruleForm.brxb" placeholder="请选择活动区域" style="float: left">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年月" >
          <el-date-picker
            style="float: left;"
            v-model="ruleForm.csny"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="出生年月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户预约日期" prop="orderTime">
          <el-date-picker
            type="date"
            style="float: left;"
            @change = "orderTimeAction"
            v-model="ruleForm.orderTime"
            value-format="yyyy-MM-dd"
            placeholder="客户预约日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="AI通知日期" prop="visitStartTime">
          <el-date-picker
            type="date"
            style="float: left;"
            v-model="ruleForm.visitStartTime"
            placeholder="AI通知日期">
          </el-date-picker>
        </el-form-item>
        <el-alert
          style="margin-bottom: 20px;"
          title="如通知日期为当天，AI将会在提交后半个小时发起通知"
          type="success"
          :closable="false">
        </el-alert>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
        </el-form-item>
      </el-form>
    </el-dialog>

    <plan-info ref="record"   :patientId="patientId"  :hzxxId="hzxxId" :isGastroenteroscopy="false" :isComplete="isComplete" @stopAction="cancelAction"></plan-info>
  </div>
</template>
<script>
  import { initiateNotification } from 'RJPE_API/Gastroenteroscopy'; // 引入 api
  import { mapGetters } from 'vuex';
  import { NoticePlan } from 'LQPE_API/NoticePlan'; // 引入 api
  import PlanInfo from './components/PlanInfo';

  export default {
    components: {
      PlanInfo
    },
    data() {
      var validOrderTime =(rule, value, callback)=>{
        if(!value){
          return callback(new Error('请选择预约日期'));
        }
        var dataTime = new Date().getTime();
        var Time = new Date();
        let getHours = Time.getHours();
        let getMinutes = Time.getMinutes();
        let getSeconds = Time.getSeconds();
        let nowDateTime =value+" "+getHours.toString().padStart(2,"00")+":"+getMinutes.toString().padStart(2,"00")+":"+getSeconds.toString().padStart(2,"00");
        if(!this.isDataOrderTime){
          if(new Date(nowDateTime).getTime()<dataTime){
            return callback(new Error('预约日期请大于今天'));
          }
        }
        callback();
      };
      /**
       * 验证AI通知日期
       **/
      var validVisitStartTime =(rule, value, callback)=>{
        if(!value){
          return callback(new Error('请选择AI通知时间'));
        }
        var Time = new Date(this.ruleForm.orderTime).getTime();
        if(new Date(value).getTime()>Time){
          return callback(new Error('通知日期不得大于预约时间'));
        }
        callback();
      };
      return {
        isStop:false,   //判断是否已经成功终止
        isComplete:"",            //0代表可以终止  1代表不终止的
        notPassRemark:"",         //终止原因详情
        isDataOrderTime:true,    //初始化加载客户预约日期判断  是不是第一次
        questionschemeDate:"",  //方案列表
        patientId: '',
        isRepeat: false, //防止重复点击
        patientsShow: false, // 添加客户弹框
        hzxxId:"",   //患者id
        tableLoading: true,
        noPassLoading: true,
        dataRecord: 0,
        recordFlag: 1, // 1.代表终止 2.代表批量终止
        ordersList: [], // 采集指标
        searchParams: {
          adminId: sessionStorage.getItem("userId"),
          pager: 1, // 当前页码
          limit: 10, // 每页条数
          brxm: '', // 患者姓名（可选）
          mobile: null, // ；联系方式（可选）
          sfzh: '', // 身份证号
          schemeName: '',   //方案名称
          activeType: 9,
          status:"3",    //状态3 已排期 4 已取消
        },
        nosearchParams: {
          adminId: sessionStorage.getItem("userId"),
          pager: 1, // 当前页码
          limit: 10, // 每页条数
          brxm: '', // 患者姓名（可选）
          mobile: '', // ；联系方式（可选）
          icd: '', // 体检套餐名称id
          sfzh: '', // 身份证号
          schemeName: '',
          activeType: 9,
          status:"4",    //状态3 已排期 4 已取消
        },
        ruleForm: {
          scheme:"",
          activeType:9,
          adminId:sessionStorage.getItem("userId"),
          visitStartTime:"",  //通知时间
          brxm: "", // 客户姓名
          brxb: "", // 客户性别
          jtdh: "", // 联系手机
          sfzh: "", // 身份证号
          tjtcbh: "", // 体检套餐编号
          tjtcmc: "", // 体检套餐名称
          schemeId:"",  //方案id
          schemeName:"",  //方案id
          isVip: "1", // 1表示是VIP   是否vip,0:未知,1:是,2:否
          age: "", // 年龄
          orderTime: "", // 客户预约时间
          iccvd: "",
          csny: "" // 出生年月
        },
        noTotalPage: 0,
        totalPage: 0, // 总页数
        activeName: 'first', // tab
        tableData: [],
        noPassData: [],
        diseaseList: [] /* 疾病列表 */,
        checkoptions: [
          {
            value: '',
            label: '请选择'
          },
          {
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
          },
          {
            value: '5',
            label: '其他'
          }
        ],
        rules: {
          brxm: [
            { required: true, message: "请输入客户姓名", trigger: "change" },
            { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" }
          ],
          jtdh: [
            { required: true, message: "请输入客户联系方式", trigger: "blur" }
          ],
          isVip: [{ required: true, message: "请选择客户类型", trigger: "change" }],
          scheme: [{ required: true, message: "请选择方案", trigger: "change" }],
          orderTime: [
            { validator: validOrderTime, trigger: 'change' }
          ],
          visitStartTime: [
            { validator: validVisitStartTime, trigger: 'change' }
          ],

        },
        selectCheck: '', // 选中的审核不通过
        checkId: [], // 随访通过的id(多选时),
        noCheck: false // 审核不通过弹框
      };
    },
    mounted() {
      this.getData();
      this.questionschemeList();   //获取方案
    },
    computed: {
      ...mapGetters(['token'])
    },
    methods: {
      /**
       * 终止按钮
       **/
      cancelAction(){
        console.log("1111111111111111")
        this.isStop = false;
        this.termination(this.patientId);
        if(this.isStop){
          this.$refs.record.dialogTableVisible = false;
        }
      },
      /**
       * 获取当前日期 进行封装
       **/
      currentDataAction(time){
        if(time){
          var DateTime = new Date(time);
        }else{
          var DateTime = new Date();
        }
        let getFullYear = DateTime.getFullYear();
        let getMinutes = DateTime.getMonth()+1;
        let getSeconds = DateTime.getDate();
        return getFullYear+"-"+getMinutes.toString().padStart(2,"00")+"-"+getSeconds.toString().padStart(2,"00");
      },
      /**
       * 客户预约日期
       **/
      orderTimeAction(){
          this.isDataOrderTime = false;
      },



      /**
       * 选择名字  出现对应人的个人信息
       **/
      handleSelect(value){
        this.ruleForm.brxm = value.brxm;    //姓名
        this.ruleForm.jtdh = value.jtdh;    //联系电话
        this.ruleForm.sfzh = value.sfzh;    //身份证号
        this.ruleForm.brxb = value.brxb;    //性别
        this.ruleForm.csny = value.csny;    //出生年月 ,
      },
      /**
       * 发起肠胃镜通知 输入姓名 对应得内容填充出来
       **/
      nameChangeAction(queryString,cb){
        initiateNotification.inputContent({brxm:this.ruleForm.brxm}).then(res=>{
          let data = res.data;
          for(const item of res.data){
            if(!item.age){
              item.name = item.brxm + "&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:#67c23a'>" +item.jtdh +"</span>&nbsp;&nbsp;&nbsp;&nbsp; <sapn style='color:#f56c6c;'> "+item.brxb+"</span><span  class='select-name'>选择</span>";
            }else{
              if(!item.brxb){
                item.name = item.brxm + "&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:#67c23a'>  " +item.jtdh +"</span>&nbsp;&nbsp;&nbsp;&nbsp; <sapn style='color:#f56c6c;'>"+item.age+"</span><span class='select-name'>选择</span>";
              }else{
                item.name = item.brxm + "&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:#67c23a'>  " +item.jtdh +"</span>&nbsp;&nbsp;&nbsp;&nbsp; <sapn style='color:#f56c6c;'>"+item.age+"/"+item.brxb+"</span><span class='select-name'>选择</span>";
              }

            }

          }
          cb(data)
        })
      },
      /**
       * 获取方案名称 方案id
       **/
      schemeAction(value){
        this.ruleForm.schemeId = value.split(",")[0];
        this.ruleForm.schemeName = value.split(",")[1];
      },
      /**
       * 关闭弹窗
       **/
      closeAction(formName) {
        this.$refs[formName].resetFields();
        this.ruleForm = {
          activeType:9,
          scheme:"",
          adminId:sessionStorage.getItem("userId"),
          brxm: "", // 客户姓名
          brxb: "", // 客户性别
          jtdh: "", // 联系手机
          sfzh: "", // 身份证号
          tjtcbh: "", // 体检套餐编号
          tjtcmc: "", // 体检套餐名称
          schemeId:"", //方案
          isVip: "1", // 1表示是VIP   0表示不是
          age: "", // 年龄
          iccvd: "",
          csny: "",
          yytjrq: "" // 预约体检时间
        };
      },
      /**
       * 发起肠胃镜通知
       **/
      additionPatients() {
        this.ruleForm.orderTime =this.currentDataAction(new Date( new Date().getTime()+24*3600*1000));         //预约时间
        this.ruleForm.visitStartTime = this.currentDataAction(new Date());   //AI通知日期
        this.patientsShow = true;
      },
      /**
       * @function 取消终止
       * @return {type} {description}
       */
      cancelSelect() {
        this.noCheck = false;
        this.selectCheck = '';
        this.notPassRemark ='';
//        this.checkId = [];
      },
      /**
       * @function 搜索按钮
       * @return {type} {description}
       */
      getDataAction() {
        if (!this.dataRecord) {
          this.searchParams.status =3;
          this.tableLoading = true;
          this.searchParams.pager = 1;
          this.getData();
        } else {
          this.nosearchParams.status =4;
          this.noPassLoading = true;
          this.nosearchParams.pager = 1;
          this.nosearchParams.brxm = this.searchParams.brxm; // 患者姓名（可选）
          this.nosearchParams.mobile = this.searchParams.mobile; // ；联系方式（可选）
          this.nosearchParams.icd = this.searchParams.icd; // 体检套餐名称id
          this.nosearchParams.sfzh = this.searchParams.sfzh; // 身份证号
          this.nosearchParams.schemeName = this.searchParams.schemeName;
          this.getDateNotice();
        }
      },
      /**
       * @function 获取体检通知列表
       * @return {type} {description}
       */
      getData() {
        initiateNotification.customerList(this.searchParams).then(res => {
          this.tableLoading = false;
          this.tableData = res.data;
          this.totalPage = res.total;
        });
      },
      /**
       * @function 获取终止通知列表
       * @return {type} {description}
       */
      getDateNotice() {
        initiateNotification.customerList(this.nosearchParams).then(res => {
          this.noPassLoading = false;
          this.noPassData = res.data;
          this.noTotalPage = res.total;
        });
      },
      /**
       * @function 查看随访计划详情
       * @param  {type} scope {description}
       * @return {type} {description}
       */
      showInfo(scope) {
        if(scope.row.isComplete){
          if(scope.row.isComplete!='0'){
            this.isComplete ='1';
          }else{
            this.isComplete ='0'
          }
        }else{
          this.isComplete ='1';
        }
        this.patientId = scope.row.id;
        this.hzxxId = scope.row.hzxxId; //患者id
        this.$refs.record.dialogTableVisible = true;
      },
      /**
       * @function 监听所选的按钮
       * @param  {type} selection {description}
       * @return {type} {description}
       */
      selectChange(selection) {
        this.checkId = selection;
      },
      /**
       *弹框点击不通过确定
       *@function noothroughCkeck
       *@description 点击表格操作弹框不通过
       */
      noothroughCkeck() {
        const ids = [];
        for (const iterator of this.checkId) {
          ids.push(iterator.id);
        }
        if (this.selectCheck) {
          if (this.recordFlag === 1) {
            this.handleCheck(ids, this.selectCheck); // 单条终止
          } else {
            this.cancelBatchCancelPlot(ids, this.selectCheck); // 批量终止
          }
        } else {
          this.$message.warning('请选择原因');
        }
      },
      /**
       * @function 单个终止提交
       * @param  {type} ids           {description}
       * @param  {type} notPassReason {description}
       * @return {type} {description}
       */
      handleCheck(ids, notPassReason) {
        NoticePlan.cancelNotice({
          id: ids[0],
          adminId:sessionStorage.getItem("userId"),
          notPassReason: notPassReason,
          notPassRemark: this.notPassRemark
        })
          .then(res => {
            this.isStop = true;
            this.getData();
            this.noCheck = false;
            this.selectCheck = '';
            this.notPassRemark = '';
          })
          .catch(error => {
            this.$message.error(error+"")
            console.log(error);
          });
      },
      /**
       * @function 批量终止提交
       * @param  {type} ids           {description}
       * @param  {type} notPassReason {description}
       * @return {type} {description}
       */
      cancelBatchCancelPlot(ids, notPassReason) {
        NoticePlan.cancelBatchCancel({
          ids: ids,
          adminId:sessionStorage.getItem("userId"),
          notPassReason: notPassReason,
          notPassRemark: this.notPassRemark
        })
          .then(res => {
            this.getData();
            this.noCheck = false;
            this.selectCheck = '';
            this.notPassRemark = '';
          })
          .catch(error => {
            this.$message.error(error+"")
            console.log(error);
          });
      },
      /**
       * @function 切换table
       * @param  {type} tab   {description}
       * @param  {type} event {description}
       * @return {type} {description}
       */
      handleClick(tab, event) {
        switch (tab.index) {
          case '0':
            this.getData();
            this.dataRecord = 0;
            break;
          case '1':
            this.dataRecord = 1;
            this.getDateNotice();
            break;
        }
      },
      /**
       * @function table两种类型的分页
       * @param  {type} page {description}
       * @return {type} {description}
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
       * @function 批量终止
       * @return {type} {description}
       */
      batchTermination() {
        if (this.checkId.length === 0) {
          this.$message.warning('请选择所选项');
          return false;
        }
        this.recordFlag = 2;
        this.noCheck = true;
      },
      /**
       * 发起肠胃镜通知
       **/
      submitForm(formName) {
        console.log(this.ruleForm)
        this.$refs[formName].validate(valid => {
          console.log(3333333333333333333)
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
              initiateNotification.GastroenteroscopyTemporary(this.ruleForm)
                .then(res => {
                  if (res.code == 0) {
                    if(res.success=='false'){
                      this.$message.error(res.message);
                      this.isRepeat = false;
                       return false;
                    }
                    this.getData();
                    this.patientsShow = false;
                    this.ruleForm = {
                      activeType:9,
                      scheme:"",
                      adminId:sessionStorage.getItem("userId"),
                      brxm: "", // 客户姓名
                      brxb: "", // 客户性别
                      jtdh: "", // 联系手机
                      sfzh: "", // 身份证号
                      tjtcbh: "", // 体检套餐编号
                      tjtcmc: "", // 体检套餐名称
                      isVip: "1", // 1表示是VIP   0表示不是
                      age: "", // 年龄
                      iccvd: "",
                      csny: "",
                      yytjrq: "" // 预约体检时间
                    };

                  } else {
                    this.isRepeat = false;
                    this.$message.error(res.message);

                  }
                  this.isRepeat = false;
                  // this.diseaseList = res.data;
                })
                .catch(error => {
                  console.log(error)
                  this.isRepeat = false;
                });
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

      /**
       *
       **/
      questionschemeList(){
        initiateNotification.questionschemeList({
          activeType:9,
          pager:1,
          limit:1000,
        }).then(res=>{
            this.questionschemeDate = res.data;
           console.log(res)
        })
      },
      /**
       * @function 终止通知
       * @param  {type} id {description}
       * @return {type} {description}
       */
      termination(id,isComplete) {
        this.checkId = [
          {
            id: id
          }
        ];
        if(isComplete==0){
          this.isComplete = 0;
        }


        // 单个终止
        this.recordFlag = 1;
        this.noCheck = true;
      }
    }
  };
</script>

<style>
.select-name{
  width: 60px;
  height:28px ;
  border-radius: 4px;
  text-align: center;
  float: right;
  color: #fff;
  margin-top: 2px;
  background-color: #409EFF;
  border-color: #409EFF;
}

</style>

