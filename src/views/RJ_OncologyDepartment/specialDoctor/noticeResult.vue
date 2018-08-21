<template>
  <div class='app-container'>
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
      <li class="common_search_single">
        <label class="radio-label" >所属科室</label>
        <el-input v-model.trim="searchParams.department" clearable placeholder="请输入所属科室"></el-input>
      </li>
       <li class="common_search_single">
          <label class="radio-label" >是否过来</label>
          <el-select v-model="searchParams.fieldValue" placeholder='是否过来'>
				      <el-option label='全部' value='0'></el-option>
				      <el-option label='来' value='1'></el-option>
              <el-option label='不来' value='2'></el-option>
          </el-select>
      </li>
      <li class="common_search_single common_search_single_date">
          <label class="radio-label" >AI通知时间</label>
          <el-date-picker  @change='timeChange'
						  v-model='createTime'
							type="datetimerange"
							range-separator='至'
							start-placeholder='开始日期'
							end-placeholder='结束日期'
              value-format='yyyy-MM-dd HH:mm:ss'
              :default-time="['00:00:00', '23:59:59']"
              :picker-options='pickerTime'>
						</el-date-picker>
      </li>
      <li class="common_search_single">
          <el-button type="primary" @click.native="searchBtn" icon="el-icon-search">查询</el-button>
      </li>
    </ul>
    <!-- 表格 -->
		<el-row class='common-table'>
			<el-col :span='24'>
	    	<el-table :data='tableData' border style='width: 100%;' v-loading='dataLoading'>
	    		<el-table-column prop='brxm' label='医生姓名' align='center'></el-table-column>
	    		<el-table-column prop='mobile' label='联系电话' align='center' show-overflow-tooltip ></el-table-column>
          <el-table-column prop='department' label='所属科室' align='center'></el-table-column>
	    		<el-table-column prop='dateEnd' label='AI通知时间' align='center' show-overflow-tooltip ></el-table-column>
	    		<el-table-column prop='vetRemark' label='通知结果' align='center'></el-table-column>
	    		<el-table-column prop='backStatusStr' label='通话状态' align='center'></el-table-column>
	    		<el-table-column prop='fieldValue' label='是否过来' align='center'></el-table-column>
          	<el-table-column label='详情' align='center'>
              <template slot-scope='scope'>
                <el-button type='primary' size='mini' @click='detailBtn(scope)'>详情</el-button>
              </template>
            </el-table-column>
	    	</el-table>

        <div class='block' style='margin: 30px 50px;text-align: right;'>
          <el-pagination  @current-change='handleCurrentChange' :current-page.sync='searchParams.pager' :page-size='10' layout='total,prev, pager, next, jumper'
            :total='totalPage' v-if='totalPage'>
          </el-pagination>
        </div>
         <result-info ref="record" @refresh="getData" :resultData="dataTail" :patientId="patientId" ></result-info>
			</el-col>
		</el-row>
  </div>
</template>
<script>
  import { specialDoctor } from 'RJZL_API/specialDoctor';
  import * as getTime from 'utils/getDate';
  import * as utilsIndex from 'utils';
  import ResultInfo from './ResultInfo';
  import auditOptions from 'utils/auditOptions';
  export default {
    name: 'specialDoctorResults',
    data() {
      return {
        createTime: [] /* 创建时间 */,
        totalPage: null, // 总页数
        searchParams: { /* 搜索条件 */
          brxm: '',
          dateEndEnd: '',
          dateEndStart: '', // AI通知结束时间 ,
          department: '', // 医生所属科室 ,
          fieldValue: '', // 是否过来，全部传0，来传1，不来传2 ,
          limit: 10,
          mobile: '',
          pager: 1,
          type: '1'
        },
        tableData: [],
        dataLoading: false, // 表格数据请求等待
        checkoptions: auditOptions, // 审核不通过原因
        selectCheck: '', // 选中的审核不通过
        checkId: [], // 随访通过的id(多选时),
        queryLoading: false, // 搜索loading...
        pickerTime: {
          shortcuts: utilsIndex.pickerOptions
        },
        patientId: '',
        dataTail: {}
      };
    },
    components: {
      ResultInfo
    },
    mounted() {
      this.getData();
    },
    methods: {
      /** @description
       * 创建时间更改
       */
      timeChange(time) {
        if (time) {
          this.searchParams.dateEndStart = time[0];
          this.searchParams.dateEndEnd = time[1];
          if(this.searchParams.dateEndStart.indexOf('23:59:59')<0) {
            this.searchParams.dateEndStart = this.searchParams.dateEndStart.slice(0,11) + '00:00:00'
            this.createTime[0] = this.searchParams.dateEndStart
          }
          if(this.searchParams.dateEndEnd.indexOf('23:59:59')<0) {
            this.searchParams.dateEndEnd = this.searchParams.dateEndEnd.slice(0,11) + '23:59:59'
            this.createTime[1] = this.searchParams.dateEndEnd
          }
        } else {
          this.searchParams.dateEndStart = '';
          this.searchParams.dateEndEnd = '';
        }
      },
      /* 获取数据 */
      getData() {
        this.dataLoading = true;
        specialDoctor.noticeResultList(this.searchParams).then(res => {
          this.dataLoading = false;
          this.tableData = res.data;
          this.totalPage = res.total;
        });
      },
      /** 查询按钮 */
      searchBtn() {
        this.searchParams.pager = 1;
        this.getData();
      },
      /**
       * 分页
       * @function handleCurrentChange
       * @param {String} val 当前页码
       * @description this.tabActive = 0//全部医生=1特别关心
       */
      handleCurrentChange(page) {
        this.dataLoading = true;
        this.searchParams.pager = page;
        this.getData();
      },
      /** 详情 */
      detailBtn(scope) {
        this.dataTail = scope.row;
        this.patientId = scope.row.orderId;
        this.$refs.record.dialogTableVisible = true;
      }
    }
  };

</script>
<style lang='scss'>
  @import '~styles/search';
  .specialDoctorResults {
  }
</style>