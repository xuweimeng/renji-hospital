<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input v-model.trim="searchParams.brxm" clearable placeholder="请输入姓名"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系方式</label>
        <el-input v-model.trim="searchParams.mobile" clearable placeholder="请输入联系方式"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >证件号</label>
        <el-input v-model.trim="searchParams.sfzh" clearable placeholder="请输入证件号"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >体检套餐</label>
        <el-select
          v-model="searchParams.icd"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入体检套餐"
          :remote-method="remoteMethod">
          <el-option
            v-for="item in diseaseList"
            :key="item.icd"
            :label="item.name"
            :value="item.icd">
          </el-option>
        </el-select>
      </li>
      <li class="common_search_single common_search_single_date">
        <label class="radio-label" >通知时间</label>
        <el-date-picker
          @change="notiiceTimeChange"
          v-model="endBirthday"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </li>

      <li class="common_search_single">
        <label class="radio-label" >是否本人</label>
        <el-select v-model="searchParams.isMySelf" placeholder="请选择" popper-class="mdRtSelect">
          <el-option label="全部" value=""></el-option>
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >通话状态</label>
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
      </li>
      <li class="common_search_single">
        <label class="radio-label" >是否到场</label>
        <el-select v-model="searchParams.isCome" placeholder="请选择" popper-class="mdRtSelect">
          <el-option label="全部" value=""></el-option>
          <el-option label="来" value="1"></el-option>
          <el-option label="不来" value="0"></el-option>
          <el-option label="改约" value="2"></el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <el-button type="primary" @click.native="waySearch" icon="el-icon-search">查询</el-button>
      </li>
    </ul>
    <!--活动通知 -->
    <el-table :data="tableData" border fit highlight-current-row ref="patientlist"  v-loading="dataLoading">
      <el-table-column prop="brxm" label="姓名" align="center">
      </el-table-column>
      <el-table-column prop="mobile" label="联系电话" align="center">
      </el-table-column>
      <el-table-column prop="sfzh" label="身份证号" align="center">
      </el-table-column>
      <el-table-column prop="icdName" label="体检套餐" align="center">
      </el-table-column>
      <el-table-column prop="orderTime" label="体检时间" align="center">
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
      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"  @click="detailBtn(scope)" >详情</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div class="pagination-container" style="text-align:right;margin-top:15px;">
      <el-pagination style="display:inline-block" background  @current-change="handleCurrentChange" :current-page="searchParams.pager"  :page-size="searchParams.limit" layout="total,  prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>

    <result-info ref="record" @refresh="getData" :resultData="dataTail" :patientId="patientId" :hzxxId="hzxxId"></result-info>
  </div>
</template>

<script>
  /**
   * 随访计划
   * @module followParam
   */
  import { NoticeResult } from 'LQPE_API/NoticeResult'; // 引入 api
  import { mapGetters } from 'vuex';
  import ResultInfo from './components/ResultInfo';

  export default {
    components: {
      ResultInfo
    },
    data() {
      return {
        patientId: '',
        orderTime: '',
        dataTail: {},
        diseaseList: [] /* 疾病列表 */,
        endBirthday: '',
        /* 搜索条件 */
        searchParams: {
          backStatus: '',
          adminId: this.token,
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
          icd: '', // 体检套餐名称id
          orderTimeBegin: null,
          orderTimeEnd: null
        },
        tableData: [],
        hzxxId:"",   //患者id
        totalPage: 0, // 总页数
        dataLoading: false // 表格数据请求等待;
      };
    },
    computed: {
      ...mapGetters(['token'])
    },
    mounted() {
      this.endBirthday = [this.getCurrent() + ' 00:00:00', this.getCurrent() + ' 23:59:59'];
      this.searchParams.dateEndBegin = this.getCurrent() + ' 00:00:00';
      this.searchParams.dateEndEnd = this.getCurrent() + ' 23:59:59';
      this.getData();
    },
    methods: {
      /**
       * @function 获取当前时间
       * @return {type} {description}
       */
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
       * @function 通知时间更改
       * @param  {type} date {description}
       * @return {type} {description}
       */
      notiiceTimeChange(date) {
        this.searchParams.dateEndBegin = date ? date[0] : null;
        this.searchParams.dateEndEnd = date ? date[1] : null;
      },
      /**
       * @function 体检时间更改
       * @param  {type} date {description}
       * @return {type} {description}
       */
      orderTimeChange(date) {
        this.searchParams.orderTimeBegin = date ? date[0] : null;
        this.searchParams.orderTimeEnd = date ? date[1] : null;
      },
      /**
       * @function 查看体检通知结果详情
       * @param  {type} scope {description}
       * @return {type} {description}
       */
      detailBtn(scope) {
        this.dataTail = scope.row;
        this.patientId = scope.row.id;
        this.hzxxId = scope.row.hzxxId;
        this.$refs.record.dialogTableVisible = true;
      },
      /**
       * @function 搜索功能
       * @return {type} {description}
       */
      waySearch() {
        this.dataLoading = true;
        this.searchParams.pager = 1;
        this.getData(); // 获取数据
      },
      /**
       * @function 体检套餐自动补全
       * @param  {type} query {description}
       * @return {type} {description}
       */
      remoteMethod(query) {
        if (query === '') {
          return false;
        }
        this.diseaseList = [];
        NoticeResult.autoComplete({
          zjm: query,
          diseaseType: 1
        })
          .then(res => {
            this.diseaseList = res.data;
          })
          .catch(error => {
            console.log(error);
          });
      },
      /**
       * @function 获取列表初始数据
       * @return {type} {description}
       */
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
            this.dataLoading = false;
            this.tableData = res.data;
            this.totalPage = res.total;
          } else {
            this.tableData = [];
            this.totalPage = 0;
          }
        });
      },
      /**
       * 分页
       * @function handleCurrentChange
       * @param {String} val 当前页码
       * @description this.tabActive = 0//全部患者=1特别关心
       */
      handleCurrentChange(page) {
        this.dataLoading = true;
        this.searchParams.pager = page;
        this.getData();
      }
    }
  };
</script>
