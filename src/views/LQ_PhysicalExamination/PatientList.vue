<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input v-model.trim="searchParams.brxm" clearable placeholder="请输入姓名"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系电话</label>
        <el-input v-model.trim="searchParams.jtdh" clearable placeholder="请输入联系电话"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >证件号码</label>
        <el-input v-model.trim="searchParams.sfzh" clearable placeholder="请输入证件号码"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >性别</label>
        <el-select v-model="searchParams.brxb" placeholder="请选择" >
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
      <li class="common_search_single">
        <label class="radio-label" >标签</label>
         <el-select v-model="searchParams.isLive" placeholder="请选择" >
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="死亡" value="0"></el-option>
        </el-select>
      </li>
      <li class="common_search_single common_search_single_longBtn">
        <el-button  @click="waySearch" type="primary" icon="el-icon-search" >查询</el-button>
        <el-upload
          style="margin:0 10px"
          class="upload-demo"
          :on-success="handleSuccess"
          multiple
          name="upfile"
          :show-file-list="false"
          :action="uploadPat"
          >
          <el-button  type="primary" icon="el-icon-upload">导入患者</el-button>
        </el-upload>
        <el-button type="success" @click="downloadPat">
          下载Excel
        </el-button>
      </li>
    </ul>
    <!-- 活动通知 -->
        <el-table :data="tableData"  ref="patientlist" class="wayTable" border fit highlight-current-row v-loading="tableLoading">
          <el-table-column prop="brxm" label="姓名" align="center">
          </el-table-column>
          <el-table-column prop="jtdh" label="联系电话" align="center">
          </el-table-column>
          <el-table-column prop="brxb" label="性别" align="center">
          </el-table-column>
          <el-table-column prop="csny" label="出生年月" align="center" >
          </el-table-column>
          <el-table-column prop="sfzh" label="证件号码" align="center">
          </el-table-column>
          <el-table-column prop="state" label="标签" align="center" >
              <template slot-scope="scope">
                <div  @click="changeTag(scope.row)">
                  <el-tag type="success" v-if="scope.row.state===0" >正常</el-tag>
                  <el-tag type="danger" v-else-if="scope.row.state===1" >死亡</el-tag>
                  <el-tag type="danger" v-else></el-tag>
                </div>
              </template>
          </el-table-column>
          <el-table-column label="操作" align="center" >
            <template slot-scope="scope">
              <el-button type="primary"  size="mini" @click="getRecord(scope)">查看档案</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container" style="text-align:right;margin-top:15px;">
          <el-pagination style="display:inline-block" background  @current-change="handleCurrentChange" :current-page="searchParams.pager"  :page-size="searchParams.limit" layout="total,  prev, pager, next, jumper" :total="totalPage">
          </el-pagination>
        </div>

        <record ref="record" @refresh="getData" :patientId="patientId"></record>

        <!-- 上传错误提示 -->
      <el-dialog title="上传错误" :visible.sync="errorMsg">
        <el-button  type="danger" @click="downLoadErr">
        下载错误信息
        </el-button>
      </el-dialog>
        <!-- 修改死亡标签 -->
      <el-dialog title="修改标签" :visible.sync="tagShow">
           <el-radio-group v-model="tagValue">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">死亡</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
              <el-button @click="tagShow = false">取 消</el-button>
              <el-button type="primary" @click="submitChange">确 定</el-button>
            </span>
      </el-dialog>
  </div>
</template>

<script>
import { PatientList } from 'LQPE_API/PatientList'; // 引入 api
import Record from './components/Record';
export default {
  data() {
    return {
      errorMsg: false, // 错误信息显示弹窗
      uploadPat: PatientList.uploadPat, // 患者上传接口
      tagValue: null, // 标签内容
      tagId: 0, // 标签id
      tagShow: false, // 标签修改弹框
      patientId: null,
      iccvd: '',
      isModify: false, // 是否改约弹窗
      endBirthday: '',
      searchParams: {
        pager: 1, // 当前页码
        limit: 10, // 每页条数
        brxb: '', // 男  女 （中文）
        fromBirthday: '', // 出生年月开始时间
        endBirthday: '', // 出生年月结束时间
        jtdh: '', // 联系电话
        brxm: '', // 姓名
        sfzh: '' // 身份证号
      },
      totalPage: 0,
      isinspectPlength: true,
      tableData: [], // 全部患者表格data
      tableLoading: true // 全部患者刷新
    };
  },
  mounted() {
    this.getData();
  },
  components: {
    Record
  },
  methods: {
    /**
     * @function 获取档案
     * @return {type} {description}
     */
    getRecord(item) {
      console.log(item);
      this.patientId = item.row.id;
      this.$refs.record.dialogTableVisible = true;
    },
    downLoadErr() {
      window.open(PatientList.downloadErr);
    },
    handleSuccess(res, file) {
      res = JSON.parse(res);
      if (res.code === 0) {
        this.$message.success('上传成功');
      } else {
        this.errorMsg = true;
        this.$message.warning(res.message);
      }
    },
    /**
     * @function 修改标签
     * @return {type} {description}
     */
    changeTag(item) {
      this.tagShow = true;
      this.tagId = item.id;
      this.tagValue = item.state;
    },
    /**
     * @function 提交标签状态修改
     * @return {type} {description}
     */
    submitChange() {
      if (this.tagValue !== 1 && this.tagValue !== 0) {
        this.$message.error('请选择标签状态');
        return false;
      }
      PatientList
        .updateIsLive({
          hzxxId: this.tagId,
          isDed: this.tagValue
        })
        .then(res => {
          this.$message.success('修改成功');
          this.tagShow = false;
          this.getData();
        });
    },
    /**
     * @function 下载模板
     * @return {type} {description}
     */
    downloadPat() {
      window.open(PatientList.downloadPat);
    },
    /**
     * 通知方案列表
     * @function list
     * @param {String} adminId 医生Id
     * @param {String} mobile 通知方案名称
     * @param {String} pager 当前页码
     * @param {String} limit 每页显示条数
     */
    getData() {
      this.tableLoading = true;
      PatientList.listDate(this.searchParams)
        .then(res => {
          this.tableData = res.data;
          if (res.count) {
            this.totalPage = res.count;
          }
          this.tableLoading = false;
          return false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 选中时间
     **/
    selectDate(val) {
      this.searchParams.fromBirthday = val ? val[0] : '';
      this.searchParams.endBirthday = val ? val[1] : '';
    },
    /**
     * 分页
     * @function handleCurrentChange
     * @param {String} val 当前页码
     */
    handleCurrentChange(val) {
      this.searchParams.pager = val;
      this.getData();
    },
    /**
     * 查询
     * @function waySearch
     * @param {String} 1 返回第一页
     */
    waySearch() {
      this.searchParams.pager = 1;
      this.getData();
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
    }
  }
};
</script>

