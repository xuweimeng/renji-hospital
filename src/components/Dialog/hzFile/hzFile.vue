<template>
  <!-- 就诊档案 -->
	<el-dialog
		title="就诊档案"
		:visible.sync="hzDialog"
		width="650px"
		:center = "false"
		custom-class="hzDialog">
		<!-- 患者姓名 -->
		<hz-info />
		<!-- 就诊时间 -->
		<visit-times />
		<!-- 出院小结 -->
		<leave-text />
	</el-dialog>
</template>

<script>
import HzInfo from 'components/Dialog/hzFile/hzInfo';
import VisitTimes from './visitTimes';
import LeaveText from './leaveText';
import { mapState } from 'vuex';
export default {
  name: 'hzFile',
  data() {
    return {
      'hzDialog': false
    };
  },
  components: {
    HzInfo,
    VisitTimes,
    LeaveText
  },
  computed: {
    ...mapState({
      'patientInfo': state => state.user.scopeRowData.row,
      'getCareStatus': state => state.user.getCareStatus
    })
  }
};
</script>

<style lang="scss">
.hzDialog{
  .el-dialog__header {
    text-align: left;
    border-bottom: 1px solid #ececec;
    .el-dialog__title {
      font-size: 14px;
      color: #666;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>