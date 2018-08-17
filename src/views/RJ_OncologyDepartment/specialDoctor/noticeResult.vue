<template>
  <div class='specialDoctorResults'>
    <!-- 查询 -->
		<el-row class='common-search'>
			<el-form :inline='true' :model='searchParams' label-position="center" label-width="90px">
			  <el-col :span='6'>
			  	<el-form-item label='医生姓名'>
				    <el-input v-model='searchParams.brxm' placeholder='请输入医生姓名' clearable ></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span='6'>
			  	<el-form-item label='联系电话'>
				    <el-input v-model='searchParams.mobile' placeholder='请输入医生联系电话' clearable ></el-input>
				  </el-form-item>
				</el-col>
        <el-col :span='6'>
			  	<el-form-item label='所属科室'>
				    <el-input v-model='searchParams.department' placeholder='请输入医生联系电话' clearable ></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span='6'>
					<el-form-item label='AI通知时间'>
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
					</el-form-item>
				</el-col>
        <el-col :span='6'>
			  	<el-form-item label='是否过来'>
				    <el-select v-model='searchParams.fieldValue ' placeholder='是否过来'>
				      <el-option label='全部' value='0'></el-option>
				      <el-option label='来' value='1'></el-option>
              <el-option label='不来' value='2'></el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
			  <el-col :span='3'>
			  	<el-button type='primary' @click='searchBtn'>查询</el-button>
			  </el-col>
			</el-form>
		</el-row>
    <!-- 表格 -->
		<el-row class='common-table'>
			<el-col :span='24'>
	    	<el-table :data='tableData' border style='width: 100%;' v-loading='dataLoading'>
	    		<el-table-column prop='brxm' label='医生姓名' align='center'></el-table-column>
	    		<el-table-column prop='mobile' label='联系电话' align='center' show-overflow-tooltip ></el-table-column>
          <el-table-column prop='backStatusStr' label='所属科室' align='center'></el-table-column>
	    		<el-table-column prop='dateBegin' label='AI通知时间' align='center' show-overflow-tooltip ></el-table-column>
	    		<el-table-column prop='vetRemark' label='通知结果' align='center'></el-table-column>
	    		<el-table-column prop='resultStatusStr' label='通话状态' align='center'></el-table-column>
	    		<el-table-column prop='isCome' label='是否过来' align='center'>
						<template slot-scope='scope'>
							{{ scope.row.isCome==0?'不来':scope.row.isCome==1?'来':scope.row.isCome==2?'改约':'' }}
						</template>
					</el-table-column>
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

			</el-col>
		</el-row>
    <!-- 详情 -->
    <ad-result :resultDg='resultDg'
		@closeChildren='closeChildren'></ad-result>
  </div>
</template>
<script>
  import { specialDoctor } from 'RJZL_API/specialDoctor';
  import AdResult from '@/components/dialog/aDresult/ppResult';
  import * as getTime from 'utils/getDate';
  import * as utilsIndex from 'utils'
  import auditOptions from 'utils/auditOptions'
  export default {
    name: 'specialDoctorResults',
    data() {
      return {
        createTime: [] /* 创建时间 */,
        totalPage: null, // 总页数
        searchParams: {  /* 搜索条件 */
          // adminId: sessionStorage.getItem('userId'),
          brxm: "",
          dateEndEnd: "",
          dateEndStart: "",
          department: "",
          fieldValue: "",
          limit: 10,
          mobile: "",
          pager: 1,
          type: "1"
        },
        tableData: [],
        dataLoading: false, // 表格数据请求等待
        checkoptions: auditOptions,  // 审核不通过原因
        selectCheck: '', // 选中的审核不通过
        checkId: [], // 随访通过的id(多选时),
        queryLoading: false, // 搜索loading...
        resultDg: false, // 详情弹窗
        pickerTime: {
          shortcuts: utilsIndex.pickerOptions
        }
      };
    },
    components: {
      AdResult
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
          this.searchParams.dateEndStart   = time[0];
          this.searchParams.dateEndEnd   = time[1];
        } else {
          this.searchParams.dateEndStart   = '';
          this.searchParams.dateEndEnd   = '';
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
        this.searchParams.pager = 1
        this.getData()
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
        this.resultDg = true;
        this.$store.dispatch('getScopeRowData', scope);
      },
      /** 监听弹窗子组件的关闭动作 */
      closeChildren(val) {
        this.resultDg = val;
      }
    }
  };

</script>
<style lang='scss'>
  @import '~styles/search';
  .specialDoctorResults {
  }
</style>